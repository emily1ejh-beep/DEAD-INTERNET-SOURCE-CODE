import React, { useState } from 'react';
import { useGame } from '../context/GameStateContext';
import { ENDINGS_DATA } from '../data/storyContent';
import { soundManager } from '../audio/soundManager';
import { EndingsArchiveModal } from './EndingsArchiveModal';
import { Terminal, RotateCcw, Trophy, Home, Radio, AlertOctagon } from 'lucide-react';

export const EndingScreen: React.FC = () => {
  const { state, startNewGame, setPhase } = useGame();
  const [showArchive, setShowArchive] = useState(false);

  const activeEndingId = state.activeEnding || 'ENDING_A';
  const endingData = ENDINGS_DATA[activeEndingId] || ENDINGS_DATA.ENDING_A;

  return (
    <div className="min-h-screen w-full bg-[#08090D] text-[#F0F0F2] flex flex-col justify-between p-6 md:p-12 font-terminal select-text overflow-y-auto">
      
      {/* Top Bar */}
      <header className="flex items-center justify-between text-xs text-[#A4A9B5] border-b border-[#1C202B] pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#C52A3A]" />
          <span className="font-bold text-[#F0F0F2]">SESSION TERMINATED // DIRECTIVE CONCLUDED</span>
        </div>
        <span className="text-[#79B9C7]">TIMESTAMP: 2041-11-04 06:15:00</span>
      </header>

      {/* Main Dramatic Ending Card */}
      <main className="max-w-3xl mx-auto w-full my-auto py-8 space-y-6">
        
        {/* Title Lockup */}
        <div className="space-y-2 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C52A3A] font-bold">
            {endingData.subtitle}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-wider text-[#F0F0F2] drop-shadow-[0_0_20px_rgba(197,42,58,0.3)]">
            {endingData.title}
          </h1>
          <p className="text-sm md:text-base text-[#79B9C7] italic font-sans max-w-lg mx-auto">
            "{endingData.tagline}"
          </p>
        </div>

        {/* Narrative Epilogue Prose */}
        <div className="bg-[#11131A] border border-[#1C202B] p-6 md:p-8 space-y-4 text-xs md:text-sm font-sans leading-relaxed text-[#A4A9B5] shadow-2xl">
          {endingData.epilogue.map((paragraph, idx) => (
            <p key={idx} className="text-[#F0F0F2]">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Final Transmission Box */}
        <div className="bg-[#08090D] border-2 border-[#C52A3A] p-5 space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs text-[#C52A3A] font-bold">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>FINAL TRANSMISSION INTERCEPT</span>
            </div>
            <span className="text-[10px] text-[#A4A9B5]">{endingData.finalTransmission.timestamp}</span>
          </div>

          <div className="text-[11px] text-[#79B9C7]">
            FROM: {endingData.finalTransmission.sender}
          </div>

          <div className="text-sm md:text-base text-[#F0F0F2] font-semibold italic pt-1 border-t border-[#1C202B]">
            "{endingData.finalTransmission.text}"
          </div>
        </div>

        {/* Philosophical Verdict */}
        <div className="p-4 bg-[#11131A] border-l-2 border-[#8BAA91] text-xs font-mono text-[#A4A9B5]">
          <span className="font-bold text-[#8BAA91] uppercase mr-2">VERDICT:</span>
          {endingData.themeVerdict}
        </div>

        {/* End Game Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <button
            onClick={startNewGame}
            className="py-3 px-6 bg-[#C52A3A] hover:bg-[#a82230] text-[#F0F0F2] font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again (New Game)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowArchive(true);
            }}
            className="py-3 px-5 bg-[#11131A] hover:bg-[#1C202B] text-[#8BAA91] border border-[#8BAA91]/50 rounded font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Endings Archive ({state.unlockedEndings.length}/4)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setPhase('TITLE');
            }}
            className="py-3 px-5 bg-[#11131A] hover:bg-[#1C202B] text-[#A4A9B5] hover:text-[#F0F0F2] border border-[#1C202B] rounded font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Title Screen</span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-[#A4A9B5] border-t border-[#1C202B] pt-4">
        DEAD INTERNET · Survival Log Archived Locally · Progress Preserved
      </footer>

      {/* Archive Modal */}
      <EndingsArchiveModal isOpen={showArchive} onClose={() => setShowArchive(false)} />

    </div>
  );
};
