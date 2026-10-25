import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameStateContext';
import { SYSTEM_LOGS } from '../data/storyContent';
import { soundManager } from '../audio/soundManager';
import { 
  Terminal, 
  Unlock, 
  Lock, 
  AlertTriangle, 
  FileCode, 
  Cpu, 
  Send,
  HelpCircle
} from 'lucide-react';

export const SystemLogsView: React.FC = () => {
  const { state, decryptLog, runTerminalCommand } = useGame();
  const [inputCmd, setInputCmd] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCmd.trim()) return;
    runTerminalCommand(inputCmd);
    setInputCmd('');
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.terminalHistory.length]);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'CRIT':
        return <span className="text-[#C52A3A] font-bold">[CRIT]</span>;
      case 'ANOMALY':
        return <span className="text-[#C52A3A] font-bold">[ANOMALY]</span>;
      case 'WARN':
        return <span className="text-[#EAB308] font-bold">[WARN]</span>;
      case 'SYS':
        return <span className="text-[#79B9C7] font-bold">[SYS]</span>;
      default:
        return <span className="text-[#8BAA91] font-bold">[INFO]</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090D] overflow-hidden select-text font-mono text-xs">
      
      {/* Header bar */}
      <div className="bg-[#11131A] border-b border-[#1C202B] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#79B9C7]" />
          <h2 className="font-bold text-[#F0F0F2] tracking-wider uppercase">
            System Kernel Logs & Diagnostic Shell
          </h2>
        </div>
        <span className="text-[11px] text-[#A4A9B5]">NVRAM Buffer: /dev/syslog_core</span>
      </div>

      {/* Main split: Logs view top, interactive terminal bottom */}
      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        
        {/* Left: Raw System Logs list */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 border-b lg:border-b-0 lg:border-r border-[#1C202B]">
          <div className="text-[11px] text-[#A4A9B5] flex items-center justify-between pb-1 border-b border-[#1C202B]">
            <span>Archived Network Logs</span>
            <span>Click Decrypt on locked sectors to extract forensic clues</span>
          </div>

          <div className="space-y-2.5">
            {SYSTEM_LOGS.map(log => {
              const isEvidenceUnlocked = log.unlocksEvidenceId 
                ? state.evidenceCollected.includes(log.unlocksEvidenceId)
                : false;

              return (
                <div 
                  key={log.id}
                  className="p-3 bg-[#11131A] border border-[#1C202B] rounded space-y-2 hover:border-[#1C202B]/80 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      {getLevelBadge(log.level)}
                      <span className="text-[#F0F0F2] font-semibold">{log.subsystem}</span>
                    </div>
                    <span className="text-[#A4A9B5] tabular-nums">{log.timestamp}</span>
                  </div>

                  <p className="text-[#A4A9B5] text-xs leading-relaxed font-sans">
                    {log.content}
                  </p>

                  {log.decryptable && (
                    <div className="pt-2 border-t border-[#1C202B] flex items-center justify-between">
                      <span className="text-[10px] text-[#79B9C7]">
                        Sector Auth: {log.decryptKey}
                      </span>

                      <button
                        onClick={() => decryptLog(log.id)}
                        disabled={isEvidenceUnlocked}
                        className={`py-1 px-2.5 rounded text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 ${
                          isEvidenceUnlocked
                            ? 'bg-[#8BAA91]/20 text-[#8BAA91] border border-[#8BAA91]/40'
                            : 'bg-[#C52A3A] hover:bg-[#a82230] text-[#F0F0F2]'
                        }`}
                      >
                        {isEvidenceUnlocked ? (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>Sector Decrypted</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Decrypt Sector</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Terminal Shell */}
        <div className="w-full lg:w-96 bg-[#08090D] flex flex-col shrink-0 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1C202B] text-[11px] text-[#79B9C7]">
            <span className="font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>TERMINAL INTERACTIVE SHELL</span>
            </span>
            <span className="text-[10px] text-[#A4A9B5]">Type "help"</span>
          </div>

          {/* Terminal Console Output */}
          <div className="flex-1 overflow-y-auto py-3 space-y-1.5 text-xs text-[#A4A9B5] select-text">
            {state.terminalHistory.map((line, idx) => (
              <div 
                key={idx}
                className={
                  line.startsWith('>') 
                    ? 'text-[#79B9C7] font-bold' 
                    : line.includes('EVIDENCE') || line.includes('DECRYPT SUCCESSFUL')
                      ? 'text-[#8BAA91] font-bold'
                      : line.includes('CRIT') || line.includes('FAILED') || line.includes('AUTHORIZATION')
                        ? 'text-[#C52A3A]'
                        : 'text-[#A4A9B5]'
                }
              >
                {line}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Command Prompt Input */}
          <form onSubmit={handleCommandSubmit} className="pt-2 border-t border-[#1C202B] flex items-center gap-2">
            <span className="text-[#8BAA91] font-bold">&gt;</span>
            <input
              type="text"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              placeholder="Enter command (e.g. status, scan, decrypt log-04)..."
              className="flex-1 bg-[#11131A] border border-[#1C202B] px-3 py-1.5 rounded text-xs text-[#F0F0F2] focus:outline-none focus:border-[#79B9C7]"
            />
            <button
              type="submit"
              className="p-1.5 bg-[#1C202B] hover:bg-[#282F40] text-[#79B9C7] rounded"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick command buttons */}
          <div className="flex items-center gap-1 pt-2 text-[10px] text-[#A4A9B5]">
            <span className="shrink-0">Quick:</span>
            {['help', 'status', 'scan', 'evidence'].map(cmd => (
              <button
                key={cmd}
                onClick={() => runTerminalCommand(cmd)}
                className="px-1.5 py-0.5 bg-[#11131A] hover:bg-[#1C202B] rounded text-[#79B9C7] border border-[#1C202B]"
              >
                {cmd}
              </button>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
