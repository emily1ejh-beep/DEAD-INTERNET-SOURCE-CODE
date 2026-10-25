import React, { useState } from 'react';
import { useGame } from '../context/GameStateContext';
import { soundManager } from '../audio/soundManager';
import { Terminal, AlertTriangle, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export const PrologueScreen: React.FC = () => {
  const { setPhase, collectEvidence } = useGame();
  const [step, setStep] = useState<number>(0);

  const handleNext = () => {
    soundManager.playClick();
    if (step < 3) {
      setStep(step + 1);
    } else {
      soundManager.playNotification();
      setPhase('PLAYING');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#08090D] text-[#F0F0F2] flex items-center justify-center p-4 md:p-8 font-terminal">
      <div className="w-full max-w-2xl bg-[#11131A] border border-[#1C202B] p-6 md:p-10 shadow-2xl relative space-y-8 animate-in fade-in duration-300">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#1C202B] pb-3 text-xs text-[#A4A9B5]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C52A3A] inline-block animate-pulse" />
            <span className="text-[#F0F0F2] font-semibold">SHELTER REBOOT // LOG #0041</span>
          </div>
          <span>BUNKER 12 · SUB-LEVEL 3</span>
        </div>

        {/* Step 0: Awakening & Damaged Broadcast */}
        {step === 0 && (
          <div className="space-y-5 text-sm md:text-base leading-relaxed animate-in fade-in">
            <div className="text-xs uppercase tracking-widest text-[#79B9C7]">Day 07 Post-Silence · 03:17:08</div>
            <p className="text-[#F0F0F2]">
              You open your eyes in the dim red emergency glow of Underground Shelter 12.
            </p>
            <p className="text-[#A4A9B5]">
              The air in the concrete chamber is dry and smells of burnt ozone. Your workstation—silent for what felt like years—has just restarted itself with a harsh, high-pitched fan whine.
            </p>
            <div className="p-4 bg-[#08090D] border-l-2 border-[#C52A3A] text-xs font-mono text-[#A4A9B5] space-y-1">
              <div className="text-[#C52A3A] font-bold">[CIVIL DEFENSE RELAY // CORRUPTED]</div>
              <div>&gt; ALL EXTERNAL CIVILIAN TRANSPORT SUSPENDED.</div>
              <div>&gt; TERRESTRIAL BROADCAST TOWERS NON-RESPONSIVE.</div>
              <div>&gt; CORE CONTINUITY MESH: RECONNECTED VIA AUXILIARY FIBER.</div>
            </div>
            <p className="text-[#F0F0F2]">
              You check your wrist and your logbook. Six full days are completely missing from your memory.
            </p>
          </div>
        )}

        {/* Step 1: Anonymous Warning */}
        {step === 1 && (
          <div className="space-y-5 text-sm md:text-base leading-relaxed animate-in fade-in">
            <div className="text-xs uppercase tracking-widest text-[#C52A3A]">Incoming Buffer Intercept</div>
            <p className="text-[#A4A9B5]">
              As the operating system compiles its network directory, an unaddressed packet drops directly onto your desktop buffer:
            </p>

            <div className="p-6 bg-[#08090D] border border-[#C52A3A]/40 text-[#F0F0F2] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#C52A3A]">
                <span className="font-bold">UNKNOWN USER — 03:17:09</span>
                <span>ORIGIN: UNMAPPED ROUTE</span>
              </div>
              <p className="text-base md:text-lg italic font-sans text-[#F0F0F2]">
                "If you're reading this, don't trust the accounts that remember you."
              </p>
              <div className="text-xs text-[#A4A9B5]">
                [PACKET SIGNATURE DESTROYED UPON RECEIPT]
              </div>
            </div>

            <p className="text-[#A4A9B5]">
              Who sent it? And why would accounts on an emergency mesh remember someone who has been sealed underground?
            </p>
          </div>
        )}

        {/* Step 2: The Three Surviving Contacts */}
        {step === 2 && (
          <div className="space-y-5 text-sm md:text-base leading-relaxed animate-in fade-in">
            <div className="text-xs uppercase tracking-widest text-[#79B9C7]">Mesh Directory Handshake</div>
            <p className="text-[#F0F0F2]">
              Your terminal lists three primary external contacts active on the local fiber loop:
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-[#08090D] border border-[#1C202B] flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-[#8BAA91]/20 text-[#8BAA91] font-bold flex items-center justify-center shrink-0">M</div>
                <div className="text-xs space-y-1">
                  <div className="text-[#F0F0F2] font-semibold">MIRA VANE (@mira_vane_med)</div>
                  <div className="text-[#A4A9B5]">Claims to be a medical triage resident trapped on Level 4 of St. Jude Hospital caring for wounded survivors.</div>
                </div>
              </div>

              <div className="p-3 bg-[#08090D] border border-[#1C202B] flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-[#79B9C7]/20 text-[#79B9C7] font-bold flex items-center justify-center shrink-0">E</div>
                <div className="text-xs space-y-1">
                  <div className="text-[#F0F0F2] font-semibold">ELIAS THORNE (@thorne_syseng)</div>
                  <div className="text-[#A4A9B5]">Claims to be an infrastructure telecom engineer at Substation 08 trying to stabilize network routing.</div>
                </div>
              </div>

              <div className="p-3 bg-[#08090D] border border-[#1C202B] flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-[#C52A3A]/20 text-[#C52A3A] font-bold flex items-center justify-center shrink-0">G</div>
                <div className="text-xs space-y-1">
                  <div className="text-[#F0F0F2] font-semibold">GHOST_17 (@null_echo_17)</div>
                  <div className="text-[#A4A9B5]">Sends short, cryptic fragments. Refuses identity disclosure. Appears to have access to deleted system buffers.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Directive Objectives */}
        {step === 3 && (
          <div className="space-y-5 text-sm md:text-base leading-relaxed animate-in fade-in">
            <div className="text-xs uppercase tracking-widest text-[#8BAA91]">Directives Logged</div>
            
            <div className="space-y-3">
              <div className="p-4 bg-[#08090D] border border-[#79B9C7]/30 space-y-1">
                <div className="text-xs font-bold text-[#79B9C7] flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  OBJECTIVE 01: IDENTIFY A TRUSTWORTHY SURVIVOR
                </div>
                <p className="text-xs text-[#A4A9B5]">
                  Cross-reference claims, investigate post contradictions, and determine who is genuinely alive.
                </p>
              </div>

              <div className="p-4 bg-[#08090D] border border-[#C52A3A]/30 space-y-1">
                <div className="text-xs font-bold text-[#C52A3A] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  OBJECTIVE 02: DETERMINE WHY YOUR ACCOUNT WAS ACTIVE DURING THE SILENCE
                </div>
                <p className="text-xs text-[#A4A9B5]">
                  Audit terminal logs, recover your erased memory files, and prevent the network from pinpointing your shelter.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#A4A9B5] italic">
              "The feed is waiting. Thousands of messages are moving through the fiber lines. You must decide who to answer."
            </p>
          </div>
        )}

        {/* Navigation Action */}
        <div className="flex items-center justify-between border-t border-[#1C202B] pt-4">
          <div className="text-xs text-[#A4A9B5]">
            Sequence {step + 1} of 4
          </div>
          <button
            onClick={handleNext}
            className="py-2.5 px-6 bg-[#C52A3A] hover:bg-[#a82230] text-[#F0F0F2] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2"
          >
            <span>{step === 3 ? 'Initialize The Feed' : 'Next Transmission'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
