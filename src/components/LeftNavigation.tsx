import React from 'react';
import { useGame } from '../context/GameStateContext';
import { ActiveNavSection } from '../types';
import { 
  Radio, 
  MessageSquare, 
  Users, 
  FolderSearch, 
  GitMerge, 
  TerminalSquare, 
  SlidersHorizontal,
  LogOut
} from 'lucide-react';

export const LeftNavigation: React.FC<{ onOpenSettings: () => void; onReturnTitle: () => void }> = ({
  onOpenSettings,
  onReturnTitle
}) => {
  const { state, setActiveNav } = useGame();

  const navItems: {
    id: ActiveNavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: 'feed',
      label: 'The Feed',
      icon: Radio
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare
    },
    {
      id: 'profiles',
      label: 'Profiles',
      icon: Users
    },
    {
      id: 'evidence',
      label: 'Evidence',
      icon: FolderSearch,
      badge: `${state.evidenceCollected.length}/10`
    },
    {
      id: 'investigation',
      label: 'Deduction Board',
      icon: GitMerge,
      badge: `${state.deductionsDiscovered.length}/5`
    },
    {
      id: 'logs',
      label: 'System Logs',
      icon: TerminalSquare
    }
  ];

  return (
    <aside className="w-full md:w-56 bg-[#11131A] border-r border-[#1C202B] flex flex-col justify-between shrink-0 select-none">
      
      {/* Brand & Terminal Header */}
      <div className="p-4 border-b border-[#1C202B]">
        <div className="text-[11px] font-mono tracking-widest text-[#79B9C7] uppercase">The Feed Mesh</div>
        <div className="text-base font-bold font-mono tracking-wider text-[#F0F0F2] mt-0.5">DEAD INTERNET</div>
        <div className="text-[10px] text-[#A4A9B5] font-mono mt-1">OPERATOR // SUBJECT 00</div>
      </div>

      {/* Primary Navigation List */}
      <nav className="p-2 space-y-1 flex-1 font-mono text-xs">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = state.activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors text-left ${
                isActive 
                  ? 'bg-[#1C202B] text-[#F0F0F2] font-semibold border-l-2 border-[#C52A3A]' 
                  : 'text-[#A4A9B5] hover:text-[#F0F0F2] hover:bg-[#1C202B]/50'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#79B9C7]' : 'text-[#A4A9B5]'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-[#08090D] text-[#79B9C7]' : 'bg-[#08090D] text-[#A4A9B5]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="p-3 border-t border-[#1C202B] space-y-1 font-mono text-xs">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[#A4A9B5] hover:text-[#F0F0F2] hover:bg-[#1C202B]/50 rounded transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#A4A9B5]" />
          <span>Settings</span>
        </button>

        <button
          onClick={onReturnTitle}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[#A4A9B5] hover:text-[#C52A3A] hover:bg-[#1C202B]/50 rounded transition-colors"
        >
          <LogOut className="w-4 h-4 text-[#A4A9B5]" />
          <span>Main Menu</span>
        </button>
      </div>

    </aside>
  );
};
