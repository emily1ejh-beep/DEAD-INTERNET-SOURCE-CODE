import React from 'react';
import { useGame } from '../context/GameStateContext';
import { SURVIVOR_PROFILES, EVIDENCE_ITEMS } from '../data/storyContent';
import { ShieldAlert, Crosshair, HelpCircle, Check, ChevronRight } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { state, setActiveNav, setActiveChatCharacter } = useGame();

  const survivors = [
    { id: 'mira' as const, name: 'Mira Vane', trust: state.trustMira, color: '#8BAA91', role: 'Medical Resident' },
    { id: 'elias' as const, name: 'Elias Thorne', trust: state.trustElias, color: '#79B9C7', role: 'Core Architect' },
    { id: 'ghost' as const, name: 'GHOST_17', trust: state.trustGhost, color: '#C52A3A', role: 'Shadow Thread' }
  ];

  // Threat level calculated from suspicion and low security
  const threatLevel = Math.min(100, Math.max(10, Math.round((100 - state.shelterSecurity) * 0.7 + state.playerSuspicion * 0.3)));

  const getThreatLabel = (threat: number) => {
    if (threat < 35) return { label: 'PASSIVE TRACE', color: 'text-[#8BAA91]' };
    if (threat < 70) return { label: 'PROBING SECTOR', color: 'text-[#EAB308]' };
    return { label: 'COORDINATES PINPOINTING', color: 'text-[#C52A3A]' };
  };

  const threatInfo = getThreatLabel(threatLevel);

  return (
    <aside className="w-full lg:w-72 bg-[#11131A] border-l border-[#1C202B] p-4 flex flex-col gap-5 text-xs font-mono select-none overflow-y-auto">
      
      {/* Known Survivors & Trust Meters */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-wider text-[#79B9C7] flex items-center justify-between border-b border-[#1C202B] pb-1.5">
          <span>Surviving Contacts</span>
          <span className="text-[10px] text-[#A4A9B5]">TRUST INDEX</span>
        </div>

        <div className="space-y-2.5">
          {survivors.map(s => (
            <div 
              key={s.id}
              onClick={() => {
                setActiveChatCharacter(s.id);
                setActiveNav('messages');
              }}
              className="p-2.5 bg-[#08090D] border border-[#1C202B] hover:border-[#79B9C7]/50 rounded cursor-pointer transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#F0F0F2]">{s.name}</span>
                <span className="tabular-nums font-bold" style={{ color: s.color }}>
                  {s.trust}%
                </span>
              </div>

              {/* Progress meter bar */}
              <div className="w-full h-1.5 bg-[#1C202B] rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-300"
                  style={{ width: `${s.trust}%`, backgroundColor: s.color }}
                />
              </div>

              <div className="text-[10px] text-[#A4A9B5] flex justify-between items-center pt-0.5">
                <span>{s.role}</span>
                <span className="text-[#79B9C7] flex items-center">Open Chat <ChevronRight className="w-3 h-3" /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Level & Triangulation Meter */}
      <div className="p-3 bg-[#08090D] border border-[#1C202B] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#C52A3A]">
            <Crosshair className="w-3.5 h-3.5" />
            <span className="font-bold text-[11px] uppercase">Threat Tracker</span>
          </div>
          <span className={`text-[10px] font-bold ${threatInfo.color}`}>
            {threatInfo.label}
          </span>
        </div>

        <div className="space-y-1">
          <div className="w-full h-2 bg-[#1C202B] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#8BAA91] via-[#EAB308] to-[#C52A3A] transition-all duration-300"
              style={{ width: `${threatLevel}%` }}
            />
          </div>
          <div className="text-[10px] text-[#A4A9B5] flex justify-between">
            <span>Bunker 12 Obfuscation</span>
            <span className="tabular-nums font-semibold">{100 - threatLevel}% Hidden</span>
          </div>
        </div>
      </div>

      {/* Unresolved Questions & Directives */}
      <div className="space-y-2.5">
        <div className="text-[11px] uppercase tracking-wider text-[#79B9C7] border-b border-[#1C202B] pb-1.5 flex items-center justify-between">
          <span>Active Directives</span>
          <HelpCircle className="w-3 h-3 text-[#A4A9B5]" />
        </div>

        <div className="space-y-2 text-[11px]">
          <div className="p-2 bg-[#08090D] border border-[#1C202B] space-y-1">
            <div className="text-[#F0F0F2] font-semibold flex items-center gap-1.5">
              <span className="text-[#8BAA91]">01.</span> Medical Anomaly
            </div>
            <p className="text-[#A4A9B5]">
              Verify why Mira is reporting from demolished Ward 9 West.
            </p>
          </div>

          <div className="p-2 bg-[#08090D] border border-[#1C202B] space-y-1">
            <div className="text-[#F0F0F2] font-semibold flex items-center gap-1.5">
              <span className="text-[#79B9C7]">02.</span> Architect Credentials
            </div>
            <p className="text-[#A4A9B5]">
              Compare Elias's relay handshake token with root system blueprints.
            </p>
          </div>

          <div className="p-2 bg-[#08090D] border border-[#1C202B] space-y-1">
            <div className="text-[#F0F0F2] font-semibold flex items-center gap-1.5">
              <span className="text-[#C52A3A]">03.</span> Missing 6 Days
            </div>
            <p className="text-[#A4A9B5]">
              Recover your amnesiac transmission to Core Root.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Discovered Evidence */}
      <div className="space-y-2 mt-auto">
        <div className="text-[11px] uppercase tracking-wider text-[#79B9C7] border-b border-[#1C202B] pb-1.5 flex items-center justify-between">
          <span>Intel Logged</span>
          <span className="text-[10px] text-[#A4A9B5]">{state.evidenceCollected.length} Pieces</span>
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1 text-[10px]">
          {state.evidenceCollected.length === 0 ? (
            <div className="text-[#A4A9B5] italic p-1">No forensic clues collected yet. Inspect feed posts & logs.</div>
          ) : (
            state.evidenceCollected.slice(-4).map(id => {
              const item = EVIDENCE_ITEMS.find(e => e.id === id);
              return (
                <div 
                  key={id}
                  onClick={() => setActiveNav('evidence')}
                  className="p-1.5 bg-[#08090D] border border-[#1C202B] hover:border-[#79B9C7]/50 rounded cursor-pointer text-[#F0F0F2] truncate flex items-center justify-between"
                >
                  <span className="truncate">{item?.code}: {item?.title}</span>
                  <Check className="w-3 h-3 text-[#8BAA91] shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>

    </aside>
  );
};
