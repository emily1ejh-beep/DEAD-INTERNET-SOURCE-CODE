import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  GameState,
  GamePhase,
  ChapterId,
  EndingId,
  SurvivorId,
  ActiveNavSection,
  GameSettings,
  ChatMessage,
  DialogueChoice
} from '../types';
import {
  EVIDENCE_ITEMS,
  DEDUCTION_RECIPES,
  DIALOGUE_PROMPTS,
  SYSTEM_LOGS,
  FEED_POSTS
} from '../data/storyContent';
import { soundManager } from '../audio/soundManager';

const STORAGE_KEY = 'dead_internet_save_v1';
const SETTINGS_KEY = 'dead_internet_settings_v1';
const ENDINGS_KEY = 'dead_internet_endings_v1';

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.6,
  ambientEnabled: true,
  sfxEnabled: true,
  crtEffects: true,
  reducedMotion: false
};

const INITIAL_STATE: GameState = {
  phase: 'BOOT',
  currentChapter: 'CH1',
  inGameTime: '2041-11-04 03:17:08',
  trustMira: 45,
  trustElias: 40,
  trustGhost: 30,
  networkStability: 78,
  shelterSecurity: 85,
  playerSuspicion: 20,
  evidenceCollected: [],
  deductionsDiscovered: [],
  decisions: {},
  activeChatCharacter: 'mira',
  chatHistory: {
    mira: [
      {
        id: 'init-mira',
        sender: 'mira',
        text: 'Hello? Is someone there? The terminal screen just flickered. Please tell me you\'re a real person. I\'m trapped on Level 4 of St. Jude Memorial with three wounded survivors.',
        timestamp: '03:17:15'
      }
    ],
    elias: [
      {
        id: 'init-elias',
        sender: 'elias',
        text: 'Node 42-Echo handshake detected. This is Substation 08. Confirm your operator clearance and terminal firmware version.',
        timestamp: '03:17:22'
      }
    ],
    ghost: [
      {
        id: 'init-ghost',
        sender: 'ghost',
        text: 'you woke up at 03:17. why did you look at the survivor list before checking your own life support meters?',
        timestamp: '03:17:30'
      }
    ],
    system: [
      {
        id: 'init-system',
        sender: 'system',
        text: '[DIRECTIVE 41-A ACTIVE] Civil Continuity Mesh running. Welcome, Terminal 4 Operator.',
        timestamp: '03:17:08',
        isSystemAlert: true
      }
    ]
  },
  currentDialogueNode: {
    mira: 'mira_ch1_start',
    elias: 'elias_ch1_start',
    ghost: 'ghost_ch1_start',
    system: 'system_ch1_start'
  },
  activeNav: 'feed',
  readPosts: [],
  savedPostIds: [],
  inspectedProfiles: [],
  unlockedEndings: [],
  activeEnding: null,
  settings: DEFAULT_SETTINGS,
  lastSavedTime: null,
  terminalHistory: [
    'DEAD INTERNET OS // KERNEL v4.11-REL',
    'Type "help" for a list of diagnostics commands.',
    'System status: UNKNOWN · Network stability: 78% · Security: 85%'
  ],
  hasSeenPrologue: false,
  selectedEvidenceForDeduction: [],
  investigationNotification: null
};

interface GameContextType {
  state: GameState;
  hasSavedGame: boolean;
  startNewGame: () => void;
  continueGame: () => void;
  setPhase: (phase: GamePhase) => void;
  setActiveNav: (nav: ActiveNavSection) => void;
  setActiveChatCharacter: (id: SurvivorId) => void;
  chooseDialogue: (charId: SurvivorId, choice: DialogueChoice) => void;
  collectEvidence: (evidenceId: string) => void;
  toggleEvidenceSelection: (evidenceId: string) => void;
  clearEvidenceSelection: () => void;
  testDeduction: () => { success: boolean; message: string };
  decryptLog: (logId: string) => void;
  runTerminalCommand: (cmd: string) => void;
  advanceChapter: (targetChapter: ChapterId) => void;
  triggerEnding: (endingId: EndingId) => void;
  savePost: (postId: string) => void;
  inspectProfile: (id: SurvivorId) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetAllProgress: () => void;
  dismissNotification: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    // Attempt to load settings and unlocked endings from localStorage
    let savedSettings = DEFAULT_SETTINGS;
    let unlockedEndings: EndingId[] = [];
    if (typeof window !== 'undefined') {
      try {
        const s = localStorage.getItem(SETTINGS_KEY);
        if (s) savedSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(s) };
        const e = localStorage.getItem(ENDINGS_KEY);
        if (e) unlockedEndings = JSON.parse(e);
      } catch {
        // storage disabled or corrupted
      }
    }
    return {
      ...INITIAL_STATE,
      settings: savedSettings,
      unlockedEndings
    };
  });

  const [hasSavedGame, setHasSavedGame] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return !!saved;
    } catch {
      return false;
    }
  });

  // Sound settings synchronization
  useEffect(() => {
    soundManager.setMasterVolume(state.settings.masterVolume);
    soundManager.setAmbient(state.settings.ambientEnabled);
    soundManager.setSfx(state.settings.sfxEnabled);
  }, [state.settings]);

  // Persist game state helper
  const persistState = useCallback((s: GameState) => {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        ...s,
        lastSavedTime: new Date().toLocaleTimeString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s.settings));
      localStorage.setItem(ENDINGS_KEY, JSON.stringify(s.unlockedEndings));
      setHasSavedGame(true);
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, []);

  // Check endings trigger conditions
  const checkAutoEndings = useCallback((currentState: GameState) => {
    // If shelter security hit 0
    if (currentState.shelterSecurity <= 0 && !currentState.activeEnding) {
      return 'ENDING_D';
    }
    // High suspicion + critical security failure in Chapter 4 or 5
    if (currentState.shelterSecurity <= 15 && currentState.playerSuspicion >= 85 && (currentState.currentChapter === 'CH4' || currentState.currentChapter === 'CH5')) {
      return 'ENDING_D';
    }
    return null;
  }, []);

  const startNewGame = useCallback(() => {
    soundManager.userInteract();
    soundManager.playClick();
    
    // Clear old gameplay save but preserve unlocked endings and settings
    const fresh: GameState = {
      ...INITIAL_STATE,
      phase: 'PROLOGUE',
      settings: state.settings,
      unlockedEndings: state.unlockedEndings,
      lastSavedTime: new Date().toLocaleTimeString()
    };
    setState(fresh);
    persistState(fresh);
  }, [state.settings, state.unlockedEndings, persistState]);

  const continueGame = useCallback(() => {
    soundManager.userInteract();
    soundManager.playClick();
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GameState;
        // Merge with defaults to protect against corrupted keys
        const restored: GameState = {
          ...INITIAL_STATE,
          ...parsed,
          phase: parsed.phase === 'ENDING' ? 'PLAYING' : parsed.phase || 'PLAYING',
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || state.settings) },
          unlockedEndings: parsed.unlockedEndings || state.unlockedEndings
        };
        setState(restored);
        soundManager.playNotification();
        return;
      }
    } catch (err) {
      console.error('Save file corrupt, starting fresh', err);
    }
    startNewGame();
  }, [startNewGame, state.settings, state.unlockedEndings]);

  const setPhase = useCallback((phase: GamePhase) => {
    soundManager.playClick();
    setState(prev => {
      const updated = { ...prev, phase };
      persistState(updated);
      return updated;
    });
  }, [persistState]);

  const setActiveNav = useCallback((nav: ActiveNavSection) => {
    soundManager.playClick();
    setState(prev => {
      const updated = { ...prev, activeNav: nav };
      return updated;
    });
  }, []);

  const setActiveChatCharacter = useCallback((id: SurvivorId) => {
    soundManager.playClick();
    setState(prev => ({ ...prev, activeChatCharacter: id }));
  }, []);

  const collectEvidence = useCallback((evidenceId: string) => {
    setState(prev => {
      if (prev.evidenceCollected.includes(evidenceId)) return prev;
      soundManager.playEvidenceFound();
      const updatedList = [...prev.evidenceCollected, evidenceId];
      const ev = EVIDENCE_ITEMS.find(e => e.id === evidenceId);
      
      const updated: GameState = {
        ...prev,
        evidenceCollected: updatedList,
        investigationNotification: `NEW EVIDENCE DISCOVERED: ${ev ? ev.code + ' — ' + ev.title : evidenceId}`,
        terminalHistory: [
          ...prev.terminalHistory,
          `[EVIDENCE ACQUIRED]: ${evidenceId} registered in deduction database.`
        ]
      };
      persistState(updated);
      return updated;
    });
  }, [persistState]);

  const chooseDialogue = useCallback((charId: SurvivorId, choice: DialogueChoice) => {
    soundManager.playClick();
    setState(prev => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      // Player message
      const playerMsg: ChatMessage = {
        id: `p-${Date.now()}`,
        sender: 'player',
        text: choice.text,
        timestamp: timeStr
      };

      // Character response message
      const responseMsg: ChatMessage = {
        id: `r-${Date.now() + 1}`,
        sender: charId,
        text: choice.response,
        timestamp: timeStr,
        evidenceRevealed: choice.unlockEvidenceId
      };

      const updatedHistory = {
        ...prev.chatHistory,
        [charId]: [...(prev.chatHistory[charId] || []), playerMsg, responseMsg]
      };

      // Metric calculations with bounds [0, 100]
      const newTrustMira = Math.max(0, Math.min(100, prev.trustMira + (choice.trustMiraChange || 0)));
      const newTrustElias = Math.max(0, Math.min(100, prev.trustElias + (choice.trustEliasChange || 0)));
      const newTrustGhost = Math.max(0, Math.min(100, prev.trustGhost + (choice.trustGhostChange || 0)));
      const newSecurity = Math.max(0, Math.min(100, prev.shelterSecurity + (choice.securityChange || 0)));
      const newStability = Math.max(0, Math.min(100, prev.networkStability + (choice.stabilityChange || 0)));
      const newSuspicion = Math.max(0, Math.min(100, prev.playerSuspicion + (choice.suspicionChange || 0)));

      // Unlock evidence if tied to choice
      let updatedEvidence = prev.evidenceCollected;
      if (choice.unlockEvidenceId && !prev.evidenceCollected.includes(choice.unlockEvidenceId)) {
        updatedEvidence = [...prev.evidenceCollected, choice.unlockEvidenceId];
        soundManager.playEvidenceFound();
      }

      // Record decisions
      const updatedDecisions = { ...prev.decisions };
      if (choice.flagDecisionKey) {
        updatedDecisions[choice.flagDecisionKey] = choice.flagDecisionValue ?? true;
      }

      // Next dialogue node
      const nextNode = choice.nextPromptId || prev.currentDialogueNode[charId];
      const updatedNodes = {
        ...prev.currentDialogueNode,
        [charId]: nextNode
      };

      // Advance chapter based on progress if applicable
      let currentCh = prev.currentChapter;
      if (currentCh === 'CH1' && updatedEvidence.length >= 2 && prev.chatHistory.mira.length >= 3 && prev.chatHistory.elias.length >= 3) {
        currentCh = 'CH2';
        soundManager.playGlitch();
      } else if (currentCh === 'CH2' && updatedEvidence.length >= 4 && prev.deductionsDiscovered.length >= 1) {
        currentCh = 'CH3';
        soundManager.playGlitch();
      } else if (currentCh === 'CH3' && updatedEvidence.length >= 6 && prev.deductionsDiscovered.length >= 2) {
        currentCh = 'CH4';
        soundManager.playGlitch();
      } else if (currentCh === 'CH4' && updatedEvidence.length >= 8 && prev.deductionsDiscovered.length >= 3) {
        currentCh = 'CH5';
        soundManager.playGlitch();
      }

      let updated: GameState = {
        ...prev,
        trustMira: newTrustMira,
        trustElias: newTrustElias,
        trustGhost: newTrustGhost,
        shelterSecurity: newSecurity,
        networkStability: newStability,
        playerSuspicion: newSuspicion,
        chatHistory: updatedHistory,
        currentDialogueNode: updatedNodes,
        evidenceCollected: updatedEvidence,
        decisions: updatedDecisions,
        currentChapter: currentCh,
        terminalHistory: [
          ...prev.terminalHistory,
          `[DIALOGUE EVENT]: Communication logged with @${charId}.`
        ]
      };

      // Check if security dropped to zero
      const autoEnding = checkAutoEndings(updated);
      if (autoEnding) {
        updated = {
          ...updated,
          phase: 'ENDING',
          activeEnding: autoEnding,
          unlockedEndings: Array.from(new Set([...updated.unlockedEndings, autoEnding]))
        };
      }

      persistState(updated);
      return updated;
    });
  }, [persistState, checkAutoEndings]);

  const toggleEvidenceSelection = useCallback((evidenceId: string) => {
    soundManager.playClick();
    setState(prev => {
      const selected = prev.selectedEvidenceForDeduction;
      if (selected.includes(evidenceId)) {
        return {
          ...prev,
          selectedEvidenceForDeduction: selected.filter(id => id !== evidenceId)
        };
      } else {
        if (selected.length >= 3) {
          // Max 3 pieces at once
          return {
            ...prev,
            selectedEvidenceForDeduction: [...selected.slice(1), evidenceId]
          };
        }
        return {
          ...prev,
          selectedEvidenceForDeduction: [...selected, evidenceId]
        };
      }
    });
  }, []);

  const clearEvidenceSelection = useCallback(() => {
    soundManager.playClick();
    setState(prev => ({ ...prev, selectedEvidenceForDeduction: [] }));
  }, []);

  const testDeduction = useCallback((): { success: boolean; message: string } => {
    const selected = state.selectedEvidenceForDeduction;
    if (selected.length < 2) {
      soundManager.playDeductionFail();
      return { success: false, message: 'Select at least two pieces of evidence to test a correlation.' };
    }

    // Look for matching recipe
    const match = DEDUCTION_RECIPES.find(recipe => {
      if (recipe.requiredEvidenceIds.length !== selected.length) return false;
      return recipe.requiredEvidenceIds.every(id => selected.includes(id));
    });

    if (match) {
      soundManager.playDeductionSuccess();
      let alreadyFound = false;
      setState(prev => {
        if (prev.deductionsDiscovered.includes(match.id)) {
          alreadyFound = true;
          return { ...prev, selectedEvidenceForDeduction: [] };
        }
        const updatedDeds = [...prev.deductionsDiscovered, match.id];
        const newTrustMira = Math.max(0, Math.min(100, prev.trustMira + (match.trustMiraDelta || 0)));
        const newTrustElias = Math.max(0, Math.min(100, prev.trustElias + (match.trustEliasDelta || 0)));
        const newTrustGhost = Math.max(0, Math.min(100, prev.trustGhost + (match.trustGhostDelta || 0)));
        const newSecurity = Math.max(0, Math.min(100, prev.shelterSecurity + (match.securityDelta || 0)));
        const newStability = Math.max(0, Math.min(100, prev.networkStability + (match.stabilityDelta || 0)));
        const newSuspicion = Math.max(0, Math.min(100, prev.playerSuspicion + (match.suspicionDelta || 0)));

        const updated: GameState = {
          ...prev,
          deductionsDiscovered: updatedDeds,
          selectedEvidenceForDeduction: [],
          trustMira: newTrustMira,
          trustElias: newTrustElias,
          trustGhost: newTrustGhost,
          shelterSecurity: newSecurity,
          networkStability: newStability,
          playerSuspicion: newSuspicion,
          investigationNotification: `BREAKTHROUGH: ${match.title}`,
          terminalHistory: [
            ...prev.terminalHistory,
            `[DEDUCTION SOLVED]: ${match.title} verified.`
          ]
        };
        persistState(updated);
        return updated;
      });

      return {
        success: true,
        message: alreadyFound
          ? `Connection already established: "${match.title}".`
          : match.breakthroughText
      };
    } else {
      soundManager.playDeductionFail();
      return {
        success: false,
        message: 'Insufficient evidence to establish a correlation between selected items.'
      };
    }
  }, [state.selectedEvidenceForDeduction, persistState]);

  const decryptLog = useCallback((logId: string) => {
    const log = SYSTEM_LOGS.find(l => l.id === logId);
    if (!log) return;
    soundManager.playClick();
    soundManager.playGlitch();

    setState(prev => {
      const updated: GameState = {
        ...prev,
        terminalHistory: [
          ...prev.terminalHistory,
          `[LOG DECRYPTED]: Sector ${log.subsystem} key unlocked.`
        ]
      };
      if (log.unlocksEvidenceId && !prev.evidenceCollected.includes(log.unlocksEvidenceId)) {
        updated.evidenceCollected = [...prev.evidenceCollected, log.unlocksEvidenceId];
        updated.investigationNotification = `NEW EVIDENCE FROM DECRYPTION: ${log.unlocksEvidenceId}`;
        soundManager.playEvidenceFound();
      }
      persistState(updated);
      return updated;
    });
  }, [persistState]);

  const triggerEnding = useCallback((endingId: EndingId) => {
    soundManager.playEndingChime();
    setState(prev => {
      const unlocked = Array.from(new Set([...prev.unlockedEndings, endingId]));
      const updated: GameState = {
        ...prev,
        phase: 'ENDING',
        activeEnding: endingId,
        unlockedEndings: unlocked
      };
      persistState(updated);
      return updated;
    });
  }, [persistState]);

  const advanceChapter = useCallback((targetChapter: ChapterId) => {
    soundManager.playGlitch();
    setState(prev => {
      const updated: GameState = {
        ...prev,
        currentChapter: targetChapter,
        investigationNotification: `SYSTEM ALERT: Advancing to ${targetChapter}`,
        terminalHistory: [
          ...prev.terminalHistory,
          `[KERNEL DIRECTIVE]: CHAPTER TRANSITION TO ${targetChapter}`
        ]
      };
      persistState(updated);
      return updated;
    });
  }, [persistState]);

  const runTerminalCommand = useCallback((cmdRaw: string) => {
    const cmd = cmdRaw.trim().toLowerCase();
    soundManager.playClick();

    setState(prev => {
      let output = '';
      let newState = { ...prev };

      if (cmd === 'help') {
        output = 'COMMANDS: status | scan | evidence | deduce | decrypt <id> | reboot | clear | purge | converge | broadcast';
      } else if (cmd === 'status') {
        output = `STATUS: Chapter ${prev.currentChapter} | Stability: ${prev.networkStability}% | Security: ${prev.shelterSecurity}% | Suspicion: ${prev.playerSuspicion}% | Evidence: ${prev.evidenceCollected.length}/10`;
      } else if (cmd === 'scan') {
        output = `SCAN RESULTS: 3 remote nodes active (@mira_vane_med, @thorne_syseng, @null_echo_17). 1 system broadcast channel.`;
      } else if (cmd === 'evidence') {
        output = `COLLECTED: ${prev.evidenceCollected.length ? prev.evidenceCollected.join(', ') : 'None yet. Read The Feed and inspect posts.'}`;
      } else if (cmd === 'clear') {
        return { ...prev, terminalHistory: ['Terminal buffer cleared.'] };
      } else if (cmd === 'reboot') {
        soundManager.playGlitch();
        output = 'REBOOTING SYSTEM MESH... RECONNECTION NOMINAL.';
      } else if (cmd.startsWith('decrypt')) {
        const parts = cmd.split(' ');
        const target = parts[1];
        if (target) {
          const log = SYSTEM_LOGS.find(l => l.id.toLowerCase() === target.toLowerCase() || l.subsystem.toLowerCase().includes(target.toLowerCase()));
          if (log && log.unlocksEvidenceId) {
            output = `DECRYPT SUCCESSFUL: ${log.subsystem} unlocked. Evidence ${log.unlocksEvidenceId} archived.`;
            if (!prev.evidenceCollected.includes(log.unlocksEvidenceId)) {
              newState.evidenceCollected = [...prev.evidenceCollected, log.unlocksEvidenceId];
              soundManager.playEvidenceFound();
            }
          } else {
            output = `DECRYPT FAILED: Target ${target} not found or already decrypted.`;
          }
        } else {
          output = 'Usage: decrypt <log-id>';
        }
      } else if (cmd === 'purge' || cmd === 'shutdown') {
        // Ending A trigger if in Chapter 5
        if (prev.currentChapter === 'CH5' || prev.evidenceCollected.length >= 7) {
          triggerEnding('ENDING_A');
          return prev;
        } else {
          output = 'AUTHORIZATION DENIED: Insufficient system privileges or chapter clearance.';
        }
      } else if (cmd === 'converge' || cmd === 'accept') {
        // Ending B trigger
        if (prev.currentChapter === 'CH5' || prev.evidenceCollected.length >= 7) {
          triggerEnding('ENDING_B');
          return prev;
        } else {
          output = 'CONVERGENCE INCOMPLETE: System convergence requires Chapter 5 readiness.';
        }
      } else if (cmd === 'broadcast') {
        // Ending C trigger
        if (prev.currentChapter === 'CH5' && prev.deductionsDiscovered.length >= 3) {
          triggerEnding('ENDING_C');
          return prev;
        } else {
          output = 'BROADCAST FAILED: Minimum 3 deduction breakthroughs required to assemble truth matrix.';
        }
      } else {
        output = `Unrecognized command: "${cmd}". Type "help" for syntax.`;
      }

      const updated = {
        ...newState,
        terminalHistory: [...prev.terminalHistory, `> ${cmdRaw}`, output]
      };
      persistState(updated);
      return updated;
    });
  }, [persistState, triggerEnding]);

  const savePost = useCallback((postId: string) => {
    soundManager.playClick();
    setState(prev => {
      const alreadySaved = prev.savedPostIds.includes(postId);
      const updated = {
        ...prev,
        savedPostIds: alreadySaved
          ? prev.savedPostIds.filter(id => id !== postId)
          : [...prev.savedPostIds, postId]
      };
      persistState(updated);
      return updated;
    });
  }, [persistState]);

  const inspectProfile = useCallback((id: SurvivorId) => {
    soundManager.playClick();
    setState(prev => {
      if (prev.inspectedProfiles.includes(id)) return prev;
      const updated = {
        ...prev,
        inspectedProfiles: [...prev.inspectedProfiles, id]
      };
      persistState(updated);
      return updated;
    });
  }, [persistState]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    soundManager.playClick();
    setState(prev => {
      const merged = { ...prev.settings, ...newSettings };
      const updated = { ...prev, settings: merged };
      persistState(updated);
      return updated;
    });
  }, [persistState]);

  const resetAllProgress = useCallback(() => {
    soundManager.playClick();
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
    setHasSavedGame(false);
    const fresh: GameState = {
      ...INITIAL_STATE,
      phase: 'TITLE',
      settings: state.settings,
      unlockedEndings: state.unlockedEndings
    };
    setState(fresh);
  }, [state.settings, state.unlockedEndings]);

  const dismissNotification = useCallback(() => {
    setState(prev => ({ ...prev, investigationNotification: null }));
  }, []);

  const value = useMemo(() => ({
    state,
    hasSavedGame,
    startNewGame,
    continueGame,
    setPhase,
    setActiveNav,
    setActiveChatCharacter,
    chooseDialogue,
    collectEvidence,
    toggleEvidenceSelection,
    clearEvidenceSelection,
    testDeduction,
    decryptLog,
    runTerminalCommand,
    advanceChapter,
    triggerEnding,
    savePost,
    inspectProfile,
    updateSettings,
    resetAllProgress,
    dismissNotification
  }), [
    state,
    hasSavedGame,
    startNewGame,
    continueGame,
    setPhase,
    setActiveNav,
    setActiveChatCharacter,
    chooseDialogue,
    collectEvidence,
    toggleEvidenceSelection,
    clearEvidenceSelection,
    testDeduction,
    decryptLog,
    runTerminalCommand,
    advanceChapter,
    triggerEnding,
    savePost,
    inspectProfile,
    updateSettings,
    resetAllProgress,
    dismissNotification
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameStateProvider');
  }
  return context;
};
