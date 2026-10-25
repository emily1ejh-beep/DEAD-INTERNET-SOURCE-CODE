import React, { useState } from 'react';
import { useGame } from '../context/GameStateContext';
import { SURVIVOR_PROFILES } from '../data/storyContent';
import { soundManager } from '../audio/soundManager';
import { SurvivorId } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  MessageSquare, 
  Activity, 
  FileText, 
  Terminal, 
  User, 
  MapPin, 
  Cpu
} from 'lucide-react';

export const ProfilesView: React.FC = () => {
  const { state, setActiveChatCharacter, setActiveNav, inspectProfile } = useGame();
  const [selectedId, setSelectedId] = useState<SurvivorId>('mira');

  const profile = SURVIVOR_PROFILES[selectedId] || SURVIVOR_PROFILES.mira;

  const handleSelect = (id: SurvivorId) => {
    soundManager.playClick();
    setSelectedId(id);
    inspectProfile(id);
  };

  const handleOpenChat = (id: SurvivorId) => {
    soundManager.playClick();
    setActiveChatCharacter(id);
    setActiveNav('messages');
  };

  const profilesList: { id: SurvivorId; name: string; role: string; color: string }[] = [
    { id: 'mira', name: 'Mira Vane', role: 'Trauma Resident', color: '#8BAA91' },
    { id: 'elias', name: 'Elias Thorne', role: 'Infrastructure Architect', color: '#79B9C7' },
    { id: 'ghost', name: 'GHOST_17', role: 'Shadow Thread', color: '#C52A3A' },
    { id: 'system', name: 'THE FEED // CORE', role: 'Civil Continuity Mesh', color: '#A4A9B5' }
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#08090D] overflow-hidden select-text">
      
      {/* Character Dossier Selector */}
      <div className="w-full md:w-64 bg-[#11131A] border-r border-[#1C202B] p-3 space-y-1 font-mono text-xs shrink-0 overflow-y-auto">
        <div className="text-[11px] font-semibold text-[#A4A9B5] uppercase pb-2 mb-2 border-b border-[#1C202B]">
          Survivor Dossiers
        </div>

        {profilesList.map(item => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full p-3 rounded text-left transition-colors flex items-center justify-between ${
                isSelected 
                  ? 'bg-[#1C202B] text-[#F0F0F2] border-l-2' 
                  : 'text-[#A4A9B5] hover:text-[#F0F0F2] hover:bg-[#1C202B]/40'
              }`}
              style={{ borderLeftColor: isSelected ? item.color : 'transparent' }}
            >
              <div>
                <div className="font-semibold text-[#F0F0F2]">{item.name}</div>
                <div className="text-[10px] text-[#A4A9B5]">{item.role}</div>
              </div>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            </button>
          );
        })}

        {/* Player Profile (Subject 00) */}
        <div className="pt-4 border-t border-[#1C202B] mt-4">
          <div className="text-[10px] text-[#A4A9B5] uppercase mb-1">Local Workstation:</div>
          <div className="p-2.5 bg-[#08090D] border border-[#1C202B] rounded text-xs space-y-1">
            <div className="text-[#79B9C7] font-semibold">SUBJECT 00 // OPERATOR</div>
            <div className="text-[10px] text-[#A4A9B5]">Bunker 12 · Terminal Unit 04</div>
            <div className="text-[10px] text-[#8BAA91]">Status: Memory Reconstruction in Progress</div>
          </div>
        </div>
      </div>

      {/* Main Dossier Content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto font-mono space-y-6 max-w-4xl">
        
        {/* Profile Card Header */}
        <div className="bg-[#11131A] border border-[#1C202B] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded flex items-center justify-center font-bold text-xl text-[#F0F0F2]"
                style={{ backgroundColor: `${profile.avatarBg}33`, border: `2px solid ${profile.avatarBg}` }}
              >
                {profile.name[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#F0F0F2]">{profile.name}</h2>
                <div className="text-xs text-[#79B9C7]">{profile.handle} · {profile.role}</div>
                <div className="text-xs text-[#8BAA91] mt-1 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{profile.status}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenChat(profile.id)}
              className="py-2 px-4 bg-[#C52A3A] hover:bg-[#a82230] text-[#F0F0F2] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Initiate Chat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#1C202B] text-xs">
            <div className="flex items-center gap-2 text-[#A4A9B5]">
              <MapPin className="w-3.5 h-3.5 text-[#79B9C7]" />
              <span>Reported Location: <strong className="text-[#F0F0F2]">{profile.locationClaim}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#A4A9B5]">
              <Cpu className="w-3.5 h-3.5 text-[#C52A3A]" />
              <span>Heuristic Flag: <strong className="text-[#C52A3A]">{profile.systemFlag}</strong></span>
            </div>
          </div>
        </div>

        {/* Claims vs Hidden Intel Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Public Claim */}
          <div className="bg-[#11131A] border border-[#1C202B] p-5 space-y-2">
            <div className="text-xs text-[#8BAA91] font-semibold uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Claim & Testimony</span>
            </div>
            <p className="text-xs md:text-sm text-[#F0F0F2] font-sans leading-relaxed">
              "{profile.publicClaim}"
            </p>
            <div className="pt-2 text-[11px] text-[#A4A9B5] space-y-1">
              <div><strong>Personality:</strong> {profile.personality}</div>
              <div><strong>Writing Cadence:</strong> {profile.writingStyle}</div>
            </div>
          </div>

          {/* Hidden Intelligence & Anomalies */}
          <div className="bg-[#11131A] border border-[#C52A3A]/40 p-5 space-y-2">
            <div className="text-xs text-[#C52A3A] font-semibold uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Forensic Discrepancies</span>
            </div>
            <p className="text-xs md:text-sm text-[#F0F0F2] font-sans leading-relaxed">
              {profile.hiddenIntel}
            </p>
            <div className="pt-2 space-y-1 text-[11px]">
              <div className="font-semibold text-[#A4A9B5]">Flagged Inconsistencies:</div>
              <ul className="list-disc pl-4 text-[#A4A9B5] space-y-0.5">
                {profile.anomalyPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
