import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameStateContext';
import { soundManager } from '../audio/soundManager';
import { SettingsModal } from './SettingsModal';
import { AboutModal } from './AboutModal';
import { EndingsArchiveModal } from './EndingsArchiveModal';
import { Volume2, VolumeX, ShieldAlert, Terminal, Eye, FileText, Play, RotateCcw } from 'lucide-react';

export const TitleScreen: React.FC = () => {
  const { state, hasSavedGame, startNewGame, continueGame, advanceChapter } = useGame();
  const [bootStep, setBootStep] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showChapterSelect, setShowChapterSelect] = useState(false);

  // Boot sequence animation on cold load
  useEffect(() => {
    if (state.hasSeenPrologue) {
      setBootStep(6);
      return;
    }

    const timers = [
      setTimeout(() => setBootStep(1), 400),
      setTimeout(() => setBootStep(2), 1100),
      setTimeout(() => setBootStep(3), 1800),
      setTimeout(() => setBootStep(4), 2600),
      setTimeout(() => setBootStep(5), 3600),
      setTimeout(() => setBootStep(6), 4800)
    ];

    return () => timers.forEach(clearTimeout);
  }, [state.hasSeenPrologue]);

  const handleSkipBoot = () => {
    soundManager.playClick();
    setBootStep(6);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08090D] text-[#F0F0F2] flex flex-col justify-between p-6 md:p-12 font-terminal select-none overflow-hidden">
      {/* Background terminal grid / scan ambient */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#79B9C7 1px, transparent 1px), linear-gradient(90deg, #79B9C7 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Header Bar */}
      <header className="flex items-center justify-between z-10 text-xs text-[#A4A9B5] tracking-wider border-b border-[#1C202B] pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-[#79B9C7]" />
          <span>TERMINAL UNIT 04 // BUNKER 12</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline">OS: MESH-RT v4.11</span>
          <span className="text-[#8BAA91]">NODE STATUS: ISOLATED</span>
        </div>
      </header>

      {/* Central Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full py-8">
        {bootStep < 6 ? (
          <div 
            onClick={handleSkipBoot}
            className="cursor-pointer space-y-4 max-w-xl mx-auto bg-[#11131A] p-8 border border-[#1C202B] shadow-2xl"
          >
            <div className="text-xs text-[#79B9C7] tracking-widest uppercase">System Initialization</div>
            
            <div className="space-y-2 text-sm md:text-base">
              {bootStep >= 1 && (
                <div className="flex items-center gap-2 text-[#A4A9B5]">
                  <span className="text-[#8BAA91]">&gt;</span> BOOT SEQUENCE INITIATED...
                </div>
              )}
              {bootStep >= 2 && (
                <div className="flex items-center gap-2 text-[#A4A9B5]">
                  <span className="text-[#8BAA91]">&gt;</span> LOCAL TIME: 03:17:08
                </div>
              )}
              {bootStep >= 3 && (
                <div className="flex items-center gap-2 text-[#A4A9B5]">
                  <span className="text-[#C52A3A]">&gt;</span> NETWORK STATUS: UNKNOWN
                </div>
              )}
              {bootStep >= 4 && (
                <div className="flex items-center gap-2 text-[#A4A9B5]">
                  <span className="text-[#C52A3A]">&gt;</span> LAST HUMAN SIGNAL: 6 DAYS AGO
                </div>
              )}
              {bootStep >= 5 && (
                <div className="pt-4 border-t border-[#1C202B] space-y-2 text-[#F0F0F2]">
                  <p className="italic text-[#79B9C7]">"Your connection has been restored."</p>
                  <p className="italic text-[#C52A3A]">"That is strange. You never restored it."</p>
                </div>
              )}
            </div>

            <div className="pt-4 text-[11px] text-[#A4A9B5] flex justify-between items-center">
              <span className="animate-pulse">Loading core heuristics...</span>
              <span className="underline hover:text-[#F0F0F2]">Click to skip sequence</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in duration-500">
            {/* Bespoke Title Lockup SVG */}
            <div className="w-full max-w-xl">
              <svg 
                viewBox="0 0 640 120" 
                className="w-full h-auto drop-shadow-[0_0_20px_rgba(121,185,199,0.15)]"
                aria-label="DEAD INTERNET"
              >
                <defs>
                  <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0F0F2" />
                    <stop offset="70%" stopColor="#79B9C7" />
                    <stop offset="100%" stopColor="#C52A3A" />
                  </linearGradient>
                </defs>
                <text 
                  x="50%" 
                  y="70" 
                  textAnchor="middle" 
                  fill="url(#titleGrad)" 
                  fontSize="56" 
                  fontWeight="800" 
                  letterSpacing="12"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  DEAD INTERNET
                </text>
                <line x1="80" y1="92" x2="560" y2="92" stroke="#1C202B" strokeWidth="2" />
                <line x1="220" y1="92" x2="420" y2="92" stroke="#C52A3A" strokeWidth="2" />
              </svg>
            </div>

            {/* Tagline */}
            <div className="space-y-1">
              <p className="text-sm md:text-base font-medium tracking-[0.2em] text-[#C52A3A] uppercase">
                Everyone online is real. Until they aren't.
              </p>
              <p className="text-xs text-[#A4A9B5] tracking-wide max-w-md mx-auto">
                Year 2041 · Post-Silence Civil Continuity Mesh · Isolated Bunker 12
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="w-full max-w-xs space-y-3 pt-4">
              <button
                onClick={startNewGame}
                className="w-full py-3.5 px-6 bg-[#C52A3A] hover:bg-[#a82230] text-[#F0F0F2] font-semibold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-[#C52A3A]/20 flex items-center justify-center gap-2 border border-[#C52A3A]"
              >
                <Play className="w-4 h-4 fill-current" />
                New Game
              </button>

              {hasSavedGame && (
                <button
                  onClick={continueGame}
                  className="w-full py-3 px-6 bg-[#11131A] hover:bg-[#1C202B] text-[#79B9C7] hover:text-[#F0F0F2] text-sm font-medium tracking-wider uppercase border border-[#79B9C7]/40 hover:border-[#79B9C7] transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Continue ({state.currentChapter})
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowSettings(true);
                  }}
                  className="py-2.5 px-4 bg-[#11131A] hover:bg-[#1C202B] text-[#A4A9B5] hover:text-[#F0F0F2] text-xs tracking-wider uppercase border border-[#1C202B] transition-colors"
                >
                  Settings
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowAbout(true);
                  }}
                  className="py-2.5 px-4 bg-[#11131A] hover:bg-[#1C202B] text-[#A4A9B5] hover:text-[#F0F0F2] text-xs tracking-wider uppercase border border-[#1C202B] transition-colors"
                >
                  About
                </button>
              </div>

              {state.unlockedEndings.length > 0 && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowArchive(true);
                  }}
                  className="w-full py-2 px-4 bg-[#11131A] hover:bg-[#1C202B] text-[#8BAA91] text-xs tracking-wider uppercase border border-[#8BAA91]/40 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Endings Archive ({state.unlockedEndings.length}/4)
                </button>
              )}

              {state.unlockedEndings.length > 0 && (
                <button
                  onClick={() => setShowChapterSelect(!showChapterSelect)}
                  className="w-full py-1.5 px-3 text-[11px] text-[#79B9C7] hover:text-[#F0F0F2] tracking-wider uppercase underline transition-colors"
                >
                  {showChapterSelect ? 'Hide Chapter Jump' : 'Select Chapter (Unlocked)'}
                </button>
              )}

              {showChapterSelect && (
                <div className="p-3 bg-[#11131A] border border-[#1C202B] rounded space-y-1 text-left text-xs">
                  <div className="text-[10px] text-[#A4A9B5] uppercase mb-1">Jump to Chapter:</div>
                  {(['CH1', 'CH2', 'CH3', 'CH4', 'CH5'] as const).map(ch => (
                    <button
                      key={ch}
                      onClick={() => {
                        advanceChapter(ch);
                        continueGame();
                      }}
                      className="block w-full text-left py-1 px-2 hover:bg-[#1C202B] text-[#A4A9B5] hover:text-[#F0F0F2]"
                    >
                      {ch}: {ch === 'CH1' ? 'The Silence' : ch === 'CH2' ? 'The Living' : ch === 'CH3' ? 'The Impostor' : ch === 'CH4' ? 'Your History' : 'The Last User'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Flat Control Hints */}
            <div className="pt-4 text-xs text-[#A4A9B5]">
              <span>Mouse / Touch Interaction</span>
              <span className="mx-2">·</span>
              <span>Audio Enabled via Web Audio API</span>
              <span className="mx-2">·</span>
              <span>Autonomous Local Storage Save</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#A4A9B5] border-t border-[#1C202B] pt-4">
        <div>
          <span>DEAD INTERNET</span>
          <span className="mx-2">·</span>
          <span>A Work of Fictional Psychological Horror</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => soundManager.setAmbient(!state.settings.ambientEnabled)}
            className="hover:text-[#F0F0F2] flex items-center gap-1"
          >
            {state.settings.ambientEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#8BAA91]" /> : <VolumeX className="w-3.5 h-3.5 text-[#C52A3A]" />}
            <span>{state.settings.ambientEnabled ? 'Ambient Hum On' : 'Ambient Hum Muted'}</span>
          </button>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <EndingsArchiveModal isOpen={showArchive} onClose={() => setShowArchive(false)} />
    </div>
  );
};
