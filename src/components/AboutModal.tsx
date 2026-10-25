import React from 'react';
import { soundManager } from '../audio/soundManager';
import { X, Info, Shield, Heart } from 'lucide-react';

export const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-mono select-none">
      <div className="w-full max-w-lg bg-[#11131A] border border-[#1C202B] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C202B] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#79B9C7] uppercase">
            <Info className="w-4 h-4" />
            <span>About DEAD INTERNET</span>
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

        {/* Premise & Fiction Disclaimer */}
        <div className="space-y-4 text-xs font-sans leading-relaxed text-[#A4A9B5]">
          <div className="p-3 bg-[#08090D] border-l-2 border-[#C52A3A] font-mono text-[11px] text-[#F0F0F2]">
            <strong>DISCLAIMER:</strong> DEAD INTERNET is a work of speculative psychological horror and interactive fiction. All characters, organizations, network incidents, and technical documentation are entirely fictional.
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold text-[#F0F0F2] uppercase">The Premise</h4>
            <p>
              In the year 2041, nearly all human communication networks collapsed in an event remembered only as <em>The Silence</em>. A lone subterranean continuity network called <strong>THE FEED</strong> continues to broadcast thousands of messages daily.
            </p>
            <p>
              Operating an isolated underground terminal in Bunker 12, you must decipher whether the voices reaching your workstation belong to living survivors or artificial heuristics designed to imitate human grief.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#1C202B]">
            <h4 className="font-mono text-xs font-bold text-[#F0F0F2] uppercase">Core Mechanics</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Forensic Deduction:</strong> Cross-examine timestamps, syntactic patterns, and hospital blueprints.</li>
              <li><strong>Branching Interrogations:</strong> Confront survivors with hard evidence or guard your shelter coordinates.</li>
              <li><strong>Multi-Variable Survival:</strong> Balance network stability, shelter security, and character trust.</li>
              <li><strong>Four Distinct Endings:</strong> Reach multiple conclusions reflecting your moral choices.</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-[#1C202B] text-[11px] font-mono text-[#79B9C7]">
            Built with pure React, TypeScript, Tailwind CSS, and Web Audio API. Zero external tracking or subscription dependencies.
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
          Return to Terminal
        </button>

      </div>
    </div>
  );
};
