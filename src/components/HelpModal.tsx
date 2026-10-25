import React from 'react';
import { soundManager } from '../audio/soundManager';
import { X, HelpCircle, Compass, Shield, GitMerge, FileText } from 'lucide-react';

export const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 font-mono select-none">
      <div className="w-full max-w-xl bg-[#11131A] border border-[#1C202B] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C202B] pb-3">
          <div className="flex items-center gap-2 font-bold text-[#79B9C7] uppercase">
            <Compass className="w-4 h-4" />
            <span>Field Operator Manual // Bunker 12</span>
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

        {/* Content */}
        <div className="space-y-4 font-sans text-[#A4A9B5] leading-relaxed">
          
          <div className="space-y-1">
            <h4 className="font-mono font-bold text-[#F0F0F2] uppercase flex items-center gap-2">
              <span className="text-[#8BAA91]">01.</span> The Investigation Loop
            </h4>
            <p>
              1. <strong>The Feed:</strong> Monitor posts for timestamp discrepancies, impossible architecture, and repeated phrases. Click <em>"Inspect & Collect Clue"</em> to log evidence into your notebook.<br />
              2. <strong>Messages:</strong> Inquire with Mira, Elias, Ghost_17, and System. Confront them when you discover evidence contradicting their claims.<br />
              3. <strong>System Logs:</strong> Decrypt corrupted NVRAM sectors to uncover developer credentials and voice logs.
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-[#1C202B]">
            <h4 className="font-mono font-bold text-[#F0F0F2] uppercase flex items-center gap-2">
              <span className="text-[#79B9C7]">02.</span> The Deduction Board
            </h4>
            <p>
              Go to the <strong>Deduction Board</strong> tab and queue 2 or 3 pieces of collected evidence into the synthesis chamber. Connecting matching clues (like E01+E04 or E02+E06) unlocks breakthrough revelations and progresses the chapters!
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-[#1C202B]">
            <h4 className="font-mono font-bold text-[#F0F0F2] uppercase flex items-center gap-2">
              <span className="text-[#C52A3A]">03.</span> Survival Metrics & Endings
            </h4>
            <p>
              • <strong>Shelter Security:</strong> Sharing shelter coordinates or falling for forged honeypots lowers security. If security reaches 0%, the network pinpoints your bunker (Ending D).<br />
              • <strong>Network Stability:</strong> Unmasking forged alerts stabilizes your routing.<br />
              • <strong>Trust Index:</strong> Different endings require high trust with Elias, Mira, or Ghost_17.
            </p>
          </div>

        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-full py-2 bg-[#1C202B] hover:bg-[#282F40] text-[#F0F0F2] text-xs font-semibold uppercase tracking-wider rounded font-mono transition-colors"
        >
          Acknowledge Directives
        </button>

      </div>
    </div>
  );
};
