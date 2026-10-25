export type GamePhase = 'BOOT' | 'TITLE' | 'PROLOGUE' | 'PLAYING' | 'ENDING';

export type ActiveNavSection = 
  | 'feed' 
  | 'messages' 
  | 'profiles' 
  | 'evidence' 
  | 'investigation' 
  | 'logs' 
  | 'settings';

export type ChapterId = 'CH1' | 'CH2' | 'CH3' | 'CH4' | 'CH5';

export type EndingId = 'ENDING_A' | 'ENDING_B' | 'ENDING_C' | 'ENDING_D';

export type SurvivorId = 'mira' | 'elias' | 'ghost' | 'system';

export type VerificationStatus = 'verified' | 'unverified' | 'anomalous' | 'corrupted' | 'system';

export interface FeedReply {
  author: string;
  handle: string;
  text: string;
  timestamp: string;
}

export interface FeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  avatarInitial: string;
  avatarColor: string;
  timestamp: string;
  content: string;
  verificationStatus: VerificationStatus;
  chapterAvailable: ChapterId;
  clueId?: string;
  linkedEvidenceId?: string;
  clueHint?: string;
  likesCount: number;
  replies?: FeedReply[];
  hasContradiction?: boolean;
  contradictionNote?: string;
}

export interface EvidenceItem {
  id: string; // E01 to E10
  code: string; // e.g. "E01"
  title: string;
  shortDesc: string;
  fullDesc: string;
  discovered: boolean;
  discoveredAt?: string;
  linkedCharacters: SurvivorId[];
  source: string;
  category: 'TIMESTAMPS' | 'BIOMETRICS' | 'COMMUNICATIONS' | 'ARCHITECTURE' | 'MEMORY';
  audioTranscript?: string;
  suspicionWeight: number;
}

export interface DeductionRecipe {
  id: string;
  requiredEvidenceIds: string[]; // exactly 2 or 3 IDs
  title: string;
  hypothesis: string;
  breakthroughText: string;
  discovered: boolean;
  unlockedDialogueId?: string;
  trustMiraDelta?: number;
  trustEliasDelta?: number;
  trustGhostDelta?: number;
  securityDelta?: number;
  stabilityDelta?: number;
  suspicionDelta?: number;
}

export interface DialogueChoice {
  id: string;
  text: string;
  type: 'clarification' | 'contradiction' | 'share' | 'withhold' | 'trust' | 'end';
  requiredEvidenceId?: string;
  minTrustRequired?: number;
  response: string;
  trustMiraChange?: number;
  trustEliasChange?: number;
  trustGhostChange?: number;
  securityChange?: number;
  stabilityChange?: number;
  suspicionChange?: number;
  unlockEvidenceId?: string;
  nextPromptId?: string;
  flagDecisionKey?: string;
  flagDecisionValue?: string | boolean;
}

export interface DialoguePrompt {
  id: string;
  characterId: SurvivorId;
  characterMessage: string;
  chapter: ChapterId;
  choices: DialogueChoice[];
}

export interface ChatMessage {
  id: string;
  sender: SurvivorId | 'player';
  text: string;
  timestamp: string;
  evidenceRevealed?: string;
  isSystemAlert?: boolean;
}

export interface SurvivorProfile {
  id: SurvivorId;
  name: string;
  handle: string;
  role: string;
  avatarBg: string;
  publicClaim: string;
  personality: string;
  writingStyle: string;
  systemFlag: string;
  status: string;
  locationClaim: string;
  hiddenIntel: string;
  anomalyPoints: string[];
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRIT' | 'SYS' | 'ANOMALY';
  subsystem: string;
  content: string;
  decryptable?: boolean;
  isDecrypted?: boolean;
  decryptKey?: string;
  unlocksEvidenceId?: string;
}

export interface EndingDetail {
  id: EndingId;
  title: string;
  subtitle: string;
  tagline: string;
  epilogue: string[];
  finalTransmission: {
    sender: string;
    text: string;
    timestamp: string;
  };
  themeVerdict: string;
}

export interface GameSettings {
  masterVolume: number;
  ambientEnabled: boolean;
  sfxEnabled: boolean;
  crtEffects: boolean;
  reducedMotion: boolean;
}

export interface GameState {
  phase: GamePhase;
  currentChapter: ChapterId;
  inGameTime: string;
  
  // Core survival & deduction metrics (0-100)
  trustMira: number;
  trustElias: number;
  trustGhost: number;
  networkStability: number;
  shelterSecurity: number;
  playerSuspicion: number;

  // Collections & progress
  evidenceCollected: string[];
  deductionsDiscovered: string[];
  decisions: Record<string, string | boolean>;
  
  // Chat state
  activeChatCharacter: SurvivorId;
  chatHistory: Record<SurvivorId, ChatMessage[]>;
  currentDialogueNode: Record<SurvivorId, string>;
  
  // Navigation & UI
  activeNav: ActiveNavSection;
  readPosts: string[];
  savedPostIds: string[];
  inspectedProfiles: SurvivorId[];
  
  // Endings
  unlockedEndings: EndingId[];
  activeEnding: EndingId | null;
  
  // Settings & meta
  settings: GameSettings;
  lastSavedTime: string | null;
  terminalHistory: string[];
  hasSeenPrologue: boolean;
  selectedEvidenceForDeduction: string[];
  investigationNotification: string | null;
}
