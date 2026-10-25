import React, { useState } from 'react';
import { GameStateProvider, useGame } from './context/GameStateContext';
import { TitleScreen } from './components/TitleScreen';
import { PrologueScreen } from './components/PrologueScreen';
import { TopStatusBar } from './components/TopStatusBar';
import { LeftNavigation } from './components/LeftNavigation';
import { RightSidebar } from './components/RightSidebar';
import { FeedView } from './components/FeedView';
import { MessagesView } from './components/MessagesView';
import { ProfilesView } from './components/ProfilesView';
import { EvidenceView } from './components/EvidenceView';
import { DeductionView } from './components/DeductionView';
import { SystemLogsView } from './components/SystemLogsView';
import { EndingScreen } from './components/EndingScreen';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';

const GameShell: React.FC = () => {
  const { state, setPhase } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // CRT visual overlay classes
  const crtActive = state.settings.crtEffects;

  if (state.phase === 'BOOT' || state.phase === 'TITLE') {
    return (
      <div className="relative min-h-screen w-full bg-[#08090D]">
        {crtActive && <div className="crt-overlay" />}
        {crtActive && <div className="crt-vignette" />}
        <TitleScreen />
      </div>
    );
  }

  if (state.phase === 'PROLOGUE') {
    return (
      <div className="relative min-h-screen w-full bg-[#08090D]">
        {crtActive && <div className="crt-overlay" />}
        {crtActive && <div className="crt-vignette" />}
        <PrologueScreen />
      </div>
    );
  }

  if (state.phase === 'ENDING') {
    return (
      <div className="relative min-h-screen w-full bg-[#08090D]">
        {crtActive && <div className="crt-overlay" />}
        {crtActive && <div className="crt-vignette" />}
        <EndingScreen />
      </div>
    );
  }

  // Active Playfield Layout: Top Status Bar, Left Nav, Center Playfield, Right Sidebar
  return (
    <div className="relative h-screen w-full bg-[#08090D] text-[#F0F0F2] flex flex-col overflow-hidden font-terminal">
      {/* Optional CRT scan lines overlay */}
      {crtActive && <div className="crt-overlay" />}
      {crtActive && <div className="crt-vignette" />}

      {/* Top Status Bar */}
      <TopStatusBar 
        onOpenSettings={() => setShowSettings(true)}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Center 3-Column Playfield */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Navigation */}
        <LeftNavigation 
          onOpenSettings={() => setShowSettings(true)}
          onReturnTitle={() => setPhase('TITLE')}
        />

        {/* Center Active Section */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#08090D]">
          {state.activeNav === 'feed' && <FeedView />}
          {state.activeNav === 'messages' && <MessagesView />}
          {state.activeNav === 'profiles' && <ProfilesView />}
          {state.activeNav === 'evidence' && <EvidenceView />}
          {state.activeNav === 'investigation' && <DeductionView />}
          {state.activeNav === 'logs' && <SystemLogsView />}
          {state.activeNav === 'settings' && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="p-8 bg-[#11131A] border border-[#1C202B] rounded max-w-md w-full text-center space-y-4">
                <h3 className="font-bold text-sm text-[#F0F0F2] uppercase">System Preferences</h3>
                <p className="text-xs text-[#A4A9B5]">Configure telemetry audio, CRT screen effects, and save progress options.</p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="py-2.5 px-6 bg-[#C52A3A] hover:bg-[#a82230] text-[#F0F0F2] text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Open Settings Dialog
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar (Survivor Trust & Threat Tracker) */}
        <RightSidebar />

      </div>

      {/* Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

    </div>
  );
};

export default function App() {
  return (
    <GameStateProvider>
      <GameShell />
    </GameStateProvider>
  );
}
