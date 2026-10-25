import React from 'react';
import { useGame } from '../context/GameStateContext';
import { soundManager } from '../audio/soundManager';
import { X, Volume2, Monitor, Eye, Trash2 } from 'lucide-react';

export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { state, updateSettings, resetAllProgress } = useGame();

  if (!isOpen) return null;

  const handleResetWithConfirm = () => {
    if (window.confirm('WARNING: This will permanently wipe all local session progress and return to the Title Screen. Continue?')) {
      resetAllProgress();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-mono select-none">
      <div className="w-full max-w-md bg-[#11131A] border border-[#1C202B] p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C202B] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#79B9C7] uppercase">
            <Monitor className="w-4 h-4" />
            <span>System Configuration & Audio</span>
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

        {/* Audio Settings */}
        <div className="space-y-4 text-xs">
          <div className="text-[11px] font-bold text-[#A4A9B5] uppercase">Audio Output</div>

          {/* Master Volume */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#F0F0F2]">
              <span>Master Volume</span>
              <span className="tabular-nums">{Math.round(state.settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.settings.masterVolume}
              onChange={(e) => updateSettings({ masterVolume: parseFloat(e.target.value) })}
              className="w-full accent-[#79B9C7]"
            />
          </div>

          {/* Ambient Sub-drone toggle */}
          <div className="flex items-center justify-between p-2.5 bg-[#08090D] border border-[#1C202B] rounded">
            <div>
              <div className="font-semibold text-[#F0F0F2]">Ambient Subterranean Drone</div>
              <div className="text-[10px] text-[#A4A9B5]">Atmospheric low-frequency synthesizer</div>
            </div>
            <input
              type="checkbox"
              checked={state.settings.ambientEnabled}
              onChange={(e) => updateSettings({ ambientEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#79B9C7]"
            />
          </div>

          {/* Sound Effects toggle */}
          <div className="flex items-center justify-between p-2.5 bg-[#08090D] border border-[#1C202B] rounded">
            <div>
              <div className="font-semibold text-[#F0F0F2]">Telemetry Sound Effects</div>
              <div className="text-[10px] text-[#A4A9B5]">Terminal key clicks, pings, and alerts</div>
            </div>
            <input
              type="checkbox"
              checked={state.settings.sfxEnabled}
              onChange={(e) => updateSettings({ sfxEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#79B9C7]"
            />
          </div>
        </div>

        {/* Visual Settings */}
        <div className="space-y-3 text-xs pt-2 border-t border-[#1C202B]">
          <div className="text-[11px] font-bold text-[#A4A9B5] uppercase">Visual Accessibility</div>

          {/* CRT scan lines */}
          <div className="flex items-center justify-between p-2.5 bg-[#08090D] border border-[#1C202B] rounded">
            <div>
              <div className="font-semibold text-[#F0F0F2]">CRT Scanlines & Flicker</div>
              <div className="text-[10px] text-[#A4A9B5]">Subtle retro monitor scanlines</div>
            </div>
            <input
              type="checkbox"
              checked={state.settings.crtEffects}
              onChange={(e) => updateSettings({ crtEffects: e.target.checked })}
              className="w-4 h-4 accent-[#79B9C7]"
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-2.5 bg-[#08090D] border border-[#1C202B] rounded">
            <div>
              <div className="font-semibold text-[#F0F0F2]">Reduced Motion</div>
              <div className="text-[10px] text-[#A4A9B5]">Disables glitch animations and shaking</div>
            </div>
            <input
              type="checkbox"
              checked={state.settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="w-4 h-4 accent-[#79B9C7]"
            />
          </div>
        </div>

        {/* Reset Session */}
        <div className="pt-2 border-t border-[#1C202B]">
          <button
            onClick={handleResetWithConfirm}
            className="w-full py-2 px-3 bg-[#08090D] hover:bg-[#C52A3A]/20 text-[#C52A3A] border border-[#C52A3A]/40 rounded text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe Save & Reset All Progress</span>
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-full py-2 bg-[#1C202B] hover:bg-[#282F40] text-[#F0F0F2] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
        >
          Confirm & Close
        </button>

      </div>
    </div>
  );
};
