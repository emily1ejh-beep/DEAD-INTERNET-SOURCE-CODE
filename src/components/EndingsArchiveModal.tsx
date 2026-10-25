import React from 'react';
import { useGame } from '../context/GameStateContext';
import { ENDINGS_DATA } from '../data/storyContent';
import { soundManager } from '../audio/soundManager';
import { X, Trophy, Lock, CheckCircle, Radio } from 'lucide-react';
import { EndingId } from '../types';

export const EndingsArchiveModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { state } = useGame();

  if (!isOpen) return null;

  const endingsList: EndingId[] = ['ENDING_A', 'ENDING_B', 'ENDING_C', 'ENDING_D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 font-mono select-none">
      <div className="w-full max-w-2xl bg-[#11131A] border border-[#1C202B] p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C202B] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8BAA91] uppercase">
            <Trophy className="w-4 h-4" />
            <span>Endings Archive ({state.unlockedEndings.length} / 4 Discovered)</span>
          </div>
          <button 
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="text-[#A4A9B5] hover:text-[#F0F0F2]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Endings Grid */}
        <div className="space-y-4 text-xs">
          {endingsList.map(endingId => {
            const data = ENDINGS_DATA[endingId];
            const isUnlocked = state.unlockedEndings.includes(endingId);

            return (
              <div
                key={endingId}
                className={`p-4 rounded border transition-colors space-y-2.5 ${
                  isUnlocked
                    ? 'bg-[#08090D] border-[#8BAA91]/50'
                    : 'bg-[#08090D]/50 border-[#1C202B] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <CheckCircle className="w-4 h-4 text-[#8BAA91]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#A4A9B5]" />
                    )}
                    <span className="font-bold text-sm text-[#F0F0F2]">
                      {isUnlocked ? data.title : `${endingId.replace('_', ' ')} — [LOCKED]`}
                    </span>
                  </div>

                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                    isUnlocked ? 'bg-[#8BAA91]/20 text-[#8BAA91]' : 'bg-[#1C202B] text-[#A4A9B5]'
                  }`}>
                    {isUnlocked ? 'ARCHIVED' : 'UNDISCOVERED'}
                  </span>
                </div>

                {isUnlocked ? (
                  <div className="space-y-2">
                    <div className="text-[#79B9C7] font-semibold text-xs">
                      {data.subtitle}
                    </div>
                    <p className="text-[#A4A9B5] font-sans leading-relaxed text-xs">
                      {data.tagline}
                    </p>
                    <div className="p-2.5 bg-[#11131A] border-l-2 border-[#79B9C7] text-[11px] text-[#F0F0F2] italic">
                      "{data.themeVerdict}"
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#A4A9B5] italic">
                    Reach this conclusion by navigating survival metrics, investigation deductions, and Chapter 5 resolutions.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-full py-2 bg-[#1C202B] hover:bg-[#282F40] text-[#F0F0F2] text-xs font-semibold uppercase tracking-wider rounded font-mono transition-colors"
        >
          Close Archive
        </button>

      </div>
    </div>
  );
};
