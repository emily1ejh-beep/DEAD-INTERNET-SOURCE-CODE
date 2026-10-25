import React from 'react';
import { useGame } from '../context/GameStateContext';
import { soundManager } from '../audio/soundManager';
import { 
  Wifi, 
  Shield, 
  Clock, 
  Bell, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertOctagon,
  HelpCircle
} from 'lucide-react';

export const TopStatusBar: React.FC<{ onOpenSettings: () => void; onOpenHelp: () => void }> = ({ onOpenSettings, onOpenHelp }) => {
  const { state, updateSettings, dismissNotification } = useGame();

  const getStabilityColor = (val: number) => {
    if (val > 60) return 'text-[#8BAA91]';
    if (val > 30) return 'text-[#EAB308]';
    return 'text-[#C52A3A]';
  };

  const getSecurityColor = (val: number) => {
    if (val > 60) return 'text-[#8BAA91]';
    if (val > 25) return 'text-[#EAB308]';
    return 'text-[#C52A3A]';
  };

  const toggleSound = () => {
    const isAnyActive = state.settings.sfxEnabled || state.settings.ambientEnabled;
    if (isAnyActive) {
      updateSettings({ sfxEnabled: false, ambientEnabled: false });
    } else {
      updateSettings({ sfxEnabled: true, ambientEnabled: true });
    }
  };

  const chapterNames: Record<string, string> = {
    CH1: 'CH 1: THE SILENCE',
    CH2: 'CH 2: THE LIVING',
    CH3: 'CH 3: THE IMPOSTOR',
    CH4: 'CH 4: YOUR HISTORY',
    CH5: 'CH 5: THE LAST USER'
  };

  return (
    <div className="w-full bg-[#11131A] border-b border-[#1C202B] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-terminal select-none z-20">
      
      {/* Left: Chapter & Timestamp */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C52A3A] animate-pulse" />
          <span className="font-bold tracking-wider text-[#F0F0F2]">
            {chapterNames[state.currentChapter] || state.currentChapter}
          </span>
        </div>

        <span className="text-[#1C202B]">|</span>

        <div className="flex items-center gap-1.5 text-[#A4A9B5]">
          <Clock className="w-3.5 h-3.5 text-[#79B9C7]" />
          <span className="tabular-nums tracking-wide">{state.inGameTime}</span>
        </div>
      </div>

      {/* Center: Live Telemetry Clusters */}
      <div className="flex items-center gap-6">
        {/* Network Stability */}
        <div className="flex items-center gap-2" title="Network Mesh Stability">
          <Wifi className={`w-3.5 h-3.5 ${getStabilityColor(state.networkStability)}`} />
          <span className="text-[#A4A9B5] hidden sm:inline">Mesh Stability:</span>
          <span className={`font-semibold tabular-nums ${getStabilityColor(state.networkStability)}`}>
            {state.networkStability}%
          </span>
        </div>

        {/* Shelter Security */}
        <div className="flex items-center gap-2" title="Shelter Location Obfuscation & Security">
          <Shield className={`w-3.5 h-3.5 ${getSecurityColor(state.shelterSecurity)}`} />
          <span className="text-[#A4A9B5] hidden sm:inline">Shelter Security:</span>
          <span className={`font-semibold tabular-nums ${getSecurityColor(state.shelterSecurity)}`}>
            {state.shelterSecurity}%
          </span>
        </div>

        {/* Player Suspicion */}
        <div className="hidden md:flex items-center gap-2" title="Network Behavioral Suspicion Rating">
          <AlertOctagon className="w-3.5 h-3.5 text-[#79B9C7]" />
          <span className="text-[#A4A9B5]">Suspicion:</span>
          <span className="font-semibold tabular-nums text-[#79B9C7]">
            {state.playerSuspicion}%
          </span>
        </div>
      </div>

      {/* Right: Quick actions & notification */}
      <div className="flex items-center gap-3">
        {state.investigationNotification && (
          <div 
            onClick={dismissNotification}
            className="cursor-pointer max-w-[200px] truncate bg-[#C52A3A]/20 border border-[#C52A3A] px-2 py-0.5 text-[11px] text-[#F0F0F2] flex items-center gap-1.5 animate-pulse"
            title="Click to dismiss alert"
          >
            <Bell className="w-3 h-3 text-[#C52A3A]" />
            <span className="truncate">{state.investigationNotification}</span>
          </div>
        )}

        <div className="text-[10px] text-[#8BAA91] hidden lg:flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>SYNCED</span>
        </div>

        <button
          onClick={toggleSound}
          className="p-1.5 hover:bg-[#1C202B] rounded text-[#A4A9B5] hover:text-[#F0F0F2] transition-colors"
          title={state.settings.sfxEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {state.settings.sfxEnabled ? (
            <Volume2 className="w-4 h-4 text-[#8BAA91]" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#C52A3A]" />
          )}
        </button>

        <button
          onClick={onOpenHelp}
          className="p-1.5 hover:bg-[#1C202B] rounded text-[#A4A9B5] hover:text-[#F0F0F2] transition-colors"
          title="Investigation Guide & Objectives"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
