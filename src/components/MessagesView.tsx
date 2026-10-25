import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameStateContext';
import { SURVIVOR_PROFILES, DIALOGUE_PROMPTS, EVIDENCE_ITEMS } from '../data/storyContent';
import { soundManager } from '../audio/soundManager';
import { SurvivorId, DialogueChoice } from '../types';
import { 
  Send, 
  ShieldAlert, 
  HelpCircle, 
  AlertTriangle, 
  Share2, 
  EyeOff, 
  Heart, 
  Clock, 
  Check, 
  Terminal,
  Lock
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { 
    state, 
    chooseDialogue, 
    setActiveChatCharacter, 
    setActiveNav 
  } = useGame();

  const activeCharId = state.activeChatCharacter;
  const profile = SURVIVOR_PROFILES[activeCharId] || SURVIVOR_PROFILES.mira;
  const history = state.chatHistory[activeCharId] || [];
  const currentNodeId = state.currentDialogueNode[activeCharId];
  const currentPrompt = DIALOGUE_PROMPTS[currentNodeId];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history.length]);

  const handleSelectChoice = (choice: DialogueChoice) => {
    chooseDialogue(activeCharId, choice);
  };

  const getChoiceBadge = (type: DialogueChoice['type']) => {
    switch (type) {
      case 'clarification':
        return <span className="text-[#79B9C7] flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Clarify</span>;
      case 'contradiction':
        return <span className="text-[#C52A3A] flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Challenge</span>;
      case 'share':
        return <span className="text-[#8BAA91] flex items-center gap-1"><Share2 className="w-3 h-3" /> Share Intel</span>;
      case 'withhold':
        return <span className="text-[#A4A9B5] flex items-center gap-1"><EyeOff className="w-3 h-3" /> Guard Info</span>;
      case 'trust':
        return <span className="text-[#F43F5E] flex items-center gap-1"><Heart className="w-3 h-3" /> Express Trust</span>;
      default:
        return <span className="text-[#A4A9B5] flex items-center gap-1"><Clock className="w-3 h-3" /> Standby</span>;
    }
  };

  const survivorTabs: { id: SurvivorId; name: string; handle: string; color: string }[] = [
    { id: 'mira', name: 'Mira Vane', handle: '@mira_vane_med', color: '#8BAA91' },
    { id: 'elias', name: 'Elias Thorne', handle: '@thorne_syseng', color: '#79B9C7' },
    { id: 'ghost', name: 'GHOST_17', handle: '@null_echo_17', color: '#C52A3A' },
    { id: 'system', name: 'CORE MESH', handle: '@net_root_daemon', color: '#A4A9B5' }
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#08090D] overflow-hidden">
      
      {/* Left List of Active Direct Conversations */}
      <div className="w-full md:w-64 bg-[#11131A] border-r border-[#1C202B] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#1C202B] text-xs font-mono font-semibold tracking-wider text-[#A4A9B5] uppercase">
          Direct Transmissions
        </div>

        <div className="p-2 space-y-1 font-mono text-xs flex-1 overflow-y-auto">
          {survivorTabs.map(tab => {
            const isActive = activeCharId === tab.id;
            const tabHistory = state.chatHistory[tab.id] || [];
            const lastMsg = tabHistory[tabHistory.length - 1];

            return (
              <button
                key={tab.id}
                onClick={() => setActiveChatCharacter(tab.id)}
                className={`w-full p-2.5 rounded text-left transition-colors space-y-1 ${
                  isActive
                    ? 'bg-[#1C202B] text-[#F0F0F2] border-l-2'
                    : 'text-[#A4A9B5] hover:text-[#F0F0F2] hover:bg-[#1C202B]/40'
                }`}
                style={{ borderLeftColor: isActive ? tab.color : 'transparent' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F0F0F2]">{tab.name}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tab.color }} />
                </div>
                <div className="text-[10px] text-[#A4A9B5] truncate">
                  {tab.handle}
                </div>
                {lastMsg && (
                  <div className="text-[10px] text-[#A4A9B5]/70 truncate italic">
                    {lastMsg.sender === 'player' ? 'You: ' : ''}{lastMsg.text}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Conversation Thread */}
      <div className="flex-1 flex flex-col h-full bg-[#08090D] overflow-hidden">
        
        {/* Active Character Header */}
        <div className="p-3.5 bg-[#11131A] border-b border-[#1C202B] flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm text-[#F0F0F2]"
              style={{ backgroundColor: `${profile.avatarBg}33`, border: `1px solid ${profile.avatarBg}` }}
            >
              {profile.name[0]}
            </div>
            <div>
              <div className="font-semibold text-[#F0F0F2] flex items-center gap-2">
                <span>{profile.name}</span>
                <span className="text-[#A4A9B5] font-normal">{profile.handle}</span>
              </div>
              <div className="text-[10px] text-[#8BAA91] flex items-center gap-2">
                <span>{profile.status}</span>
                <span>·</span>
                <span className="text-[#A4A9B5]">{profile.locationClaim}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveNav('profiles')}
            className="px-2.5 py-1 bg-[#08090D] hover:bg-[#1C202B] text-[#79B9C7] border border-[#1C202B] rounded text-[11px] transition-colors"
          >
            View Dossier
          </button>
        </div>

        {/* Message Bubble History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {history.map((msg) => {
            const isPlayer = msg.sender === 'player';
            const evidence = msg.evidenceRevealed ? EVIDENCE_ITEMS.find(e => e.id === msg.evidenceRevealed) : null;

            return (
              <div 
                key={msg.id}
                className={`flex flex-col ${isPlayer ? 'items-end' : 'items-start'} max-w-2xl ${isPlayer ? 'ml-auto' : 'mr-auto'} space-y-1`}
              >
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#A4A9B5] px-1">
                  <span>{isPlayer ? 'You (Bunker 12)' : profile.name}</span>
                  <span>·</span>
                  <span className="tabular-nums">{msg.timestamp}</span>
                </div>

                <div 
                  className={`p-3.5 rounded-lg text-sm md:text-base leading-relaxed ${
                    isPlayer 
                      ? 'bg-[#1C202B] text-[#F0F0F2] border border-[#79B9C7]/30' 
                      : msg.isSystemAlert
                        ? 'bg-[#08090D] text-[#C52A3A] border border-[#C52A3A]/40 font-mono text-xs'
                        : 'bg-[#11131A] text-[#F0F0F2] border border-[#1C202B]'
                  }`}
                >
                  <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                  
                  {evidence && (
                    <div className="mt-2.5 pt-2 border-t border-[#1C202B] text-xs font-mono text-[#8BAA91] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Evidence Unlocked: {evidence.code} — {evidence.title}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Branching Dialogue Options Input Bar */}
        <div className="p-4 bg-[#11131A] border-t border-[#1C202B] space-y-2.5">
          <div className="text-[11px] font-mono text-[#79B9C7] flex items-center justify-between">
            <span>Available Responses ({currentPrompt?.choices?.length || 0})</span>
            <span className="text-[#A4A9B5]">Choose your transmission:</span>
          </div>

          <div className="space-y-2">
            {!currentPrompt || currentPrompt.choices.length === 0 ? (
              <div className="p-3 bg-[#08090D] border border-[#1C202B] text-xs font-mono text-[#A4A9B5] text-center italic">
                Channel currently quiescent. Inspect The Feed or System Logs to unlock new conversational avenues.
              </div>
            ) : (
              currentPrompt.choices.map((choice) => {
                // Check if evidence requirement is met
                const hasRequiredEvidence = !choice.requiredEvidenceId || state.evidenceCollected.includes(choice.requiredEvidenceId);
                const reqEvidenceItem = choice.requiredEvidenceId ? EVIDENCE_ITEMS.find(e => e.id === choice.requiredEvidenceId) : null;

                return (
                  <button
                    key={choice.id}
                    disabled={!hasRequiredEvidence}
                    onClick={() => handleSelectChoice(choice)}
                    className={`w-full p-3 rounded text-left transition-colors font-mono text-xs border flex items-start justify-between gap-3 ${
                      !hasRequiredEvidence
                        ? 'bg-[#08090D] text-[#A4A9B5]/40 border-[#1C202B] cursor-not-allowed'
                        : 'bg-[#08090D] hover:bg-[#1C202B] text-[#F0F0F2] border-[#1C202B] hover:border-[#79B9C7]/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getChoiceBadge(choice.type)}
                        {!hasRequiredEvidence && (
                          <span className="text-[#C52A3A] text-[10px] flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Requires Clue {reqEvidenceItem?.code || choice.requiredEvidenceId}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs md:text-sm text-[#F0F0F2]">
                        "{choice.text}"
                      </p>
                    </div>

                    <Send className="w-4 h-4 text-[#A4A9B5] shrink-0 mt-1" />
                  </button>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
