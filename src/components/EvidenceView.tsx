import React, { useState } from 'react';
import { useGame } from '../context/GameStateContext';
import { EVIDENCE_ITEMS } from '../data/storyContent';
import { soundManager } from '../audio/soundManager';
import { 
  FolderSearch, 
  Lock, 
  Check, 
  Mic, 
  ArrowRight, 
  Tag, 
  FileText, 
  Layers,
  Sparkles
} from 'lucide-react';

export const EvidenceView: React.FC = () => {
  const { state, toggleEvidenceSelection, setActiveNav } = useGame();
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('E01');

  const selectedItem = EVIDENCE_ITEMS.find(e => e.id === selectedEvidenceId) || EVIDENCE_ITEMS[0];
  const isSelectedDiscovered = state.evidenceCollected.includes(selectedItem.id);
  const isInDeductionQueue = state.selectedEvidenceForDeduction.includes(selectedItem.id);

  const handleSelectItem = (id: string) => {
    soundManager.playClick();
    setSelectedEvidenceId(id);
  };

  const handleSendToDeduction = (id: string) => {
    toggleEvidenceSelection(id);
    setActiveNav('investigation');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#08090D] overflow-hidden select-text font-mono">
      
      {/* Evidence Notebook Index (E01 - E10) */}
      <div className="w-full md:w-72 bg-[#11131A] border-r border-[#1C202B] p-3 space-y-2 flex flex-col shrink-0 overflow-y-auto text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#1C202B]">
          <span className="font-semibold text-[#79B9C7] uppercase">Evidence Registry</span>
          <span className="text-[#A4A9B5]">{state.evidenceCollected.length} / 10 Discovered</span>
        </div>

        <div className="space-y-1.5 flex-1">
          {EVIDENCE_ITEMS.map((item) => {
            const isDiscovered = state.evidenceCollected.includes(item.id);
            const isCurrent = selectedEvidenceId === item.id;
            const isQueued = state.selectedEvidenceForDeduction.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={`w-full p-2.5 rounded text-left transition-colors flex items-center justify-between gap-2 border ${
                  isCurrent
                    ? 'bg-[#1C202B] border-[#79B9C7] text-[#F0F0F2]'
                    : 'bg-[#08090D] border-[#1C202B] text-[#A4A9B5] hover:text-[#F0F0F2]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {isDiscovered ? (
                    <Check className="w-3.5 h-3.5 text-[#8BAA91] shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#A4A9B5]/40 shrink-0" />
                  )}
                  <div className="truncate">
                    <span className="font-bold text-[#F0F0F2] mr-1.5">{item.code}</span>
                    <span className="truncate">{isDiscovered ? item.title : 'Unrecovered Dossier'}</span>
                  </div>
                </div>

                {isQueued && (
                  <span className="text-[10px] bg-[#79B9C7] text-[#08090D] px-1 font-bold rounded">
                    QUEUED
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Deduction Shortcut */}
        <div className="pt-3 border-t border-[#1C202B]">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveNav('investigation');
            }}
            className="w-full py-2 px-3 bg-[#1C202B] hover:bg-[#282F40] text-[#79B9C7] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Deduction Board</span>
          </button>
        </div>
      </div>

      {/* Main Evidence Dossier Inspector */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 max-w-3xl">
        
        {isSelectedDiscovered ? (
          <div className="bg-[#11131A] border border-[#1C202B] p-6 space-y-5 animate-in fade-in">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C202B] pb-4">
              <div className="space-y-1">
                <div className="text-xs text-[#79B9C7] uppercase font-bold flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category: {selectedItem.category} · Code: {selectedItem.code}</span>
                </div>
                <h2 className="text-xl font-bold text-[#F0F0F2]">
                  {selectedItem.title}
                </h2>
              </div>

              <button
                onClick={() => handleSendToDeduction(selectedItem.id)}
                className={`py-2 px-4 rounded text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 ${
                  isInDeductionQueue
                    ? 'bg-[#8BAA91] text-[#08090D]'
                    : 'bg-[#C52A3A] hover:bg-[#a82230] text-[#F0F0F2]'
                }`}
              >
                <span>{isInDeductionQueue ? 'In Deduction Board ✓' : 'Add to Deduction Board'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Short Desc */}
            <div className="p-3 bg-[#08090D] border-l-2 border-[#79B9C7] text-xs text-[#F0F0F2]">
              {selectedItem.shortDesc}
            </div>

            {/* Full Detailed Description */}
            <div className="space-y-2 text-xs md:text-sm text-[#A4A9B5] font-sans leading-relaxed">
              <div className="font-mono text-xs text-[#F0F0F2] font-semibold uppercase">Forensic Analysis:</div>
              <p className="text-[#F0F0F2] bg-[#08090D] p-4 border border-[#1C202B] rounded">
                {selectedItem.fullDesc}
              </p>
            </div>

            {/* Simulated Audio Memo if available */}
            {selectedItem.audioTranscript && (
              <div className="p-4 bg-[#08090D] border border-[#79B9C7]/40 rounded space-y-3">
                <div className="flex items-center justify-between text-xs text-[#79B9C7]">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#C52A3A] animate-pulse" />
                    <span className="font-bold">AUDIO CACHE EXTRACT: /dev/audio_cache_41.raw</span>
                  </div>
                  <span className="text-[10px] text-[#A4A9B5]">VOICE MATCH: SUBJECT 00</span>
                </div>

                {/* Simulated Audio Waveform Visual */}
                <div className="flex items-center gap-1 h-8 px-2 bg-[#11131A] rounded">
                  {[20, 45, 80, 60, 30, 95, 70, 40, 85, 90, 50, 30, 75, 80, 40, 60, 85, 30, 20].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-[#79B9C7]" 
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <div className="text-xs italic font-sans text-[#F0F0F2] p-2 border-l border-[#79B9C7]">
                  "{selectedItem.audioTranscript}"
                </div>
              </div>
            )}

            {/* Provenance Metadata */}
            <div className="pt-3 border-t border-[#1C202B] text-xs text-[#A4A9B5] flex flex-wrap justify-between gap-2">
              <div>Source: <span className="text-[#F0F0F2]">{selectedItem.source}</span></div>
              <div>Linked: <span className="text-[#79B9C7]">{selectedItem.linkedCharacters.join(', ')}</span></div>
            </div>

          </div>
        ) : (
          <div className="bg-[#11131A] border border-[#1C202B] p-12 text-center space-y-4">
            <Lock className="w-10 h-10 text-[#C52A3A] mx-auto opacity-70" />
            <h3 className="text-lg font-bold text-[#F0F0F2]">{selectedItem.code} — Undiscovered Forensic Record</h3>
            <p className="text-xs text-[#A4A9B5] max-w-md mx-auto">
              This evidence piece has not been decrypted or located yet. Read The Feed posts carefully, examine system broadcasts, and interrogate survivors to uncover it.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
