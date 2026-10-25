import React, { useState } from 'react';
import { useGame } from '../context/GameStateContext';
import { FEED_POSTS, EVIDENCE_ITEMS } from '../data/storyContent';
import { soundManager } from '../audio/soundManager';
import { 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  Bookmark, 
  MessageSquare, 
  CornerDownRight, 
  Sparkles,
  Info
} from 'lucide-react';
import { SurvivorId } from '../types';

export const FeedView: React.FC = () => {
  const { 
    state, 
    collectEvidence, 
    savePost, 
    setActiveNav, 
    setActiveChatCharacter 
  } = useGame();

  const [filter, setFilter] = useState<'all' | 'verified' | 'anomalous' | 'system' | 'saved'>('all');
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  // Filter posts by current chapter availability
  const chapterOrder = ['CH1', 'CH2', 'CH3', 'CH4', 'CH5'];
  const currentChapterIdx = chapterOrder.indexOf(state.currentChapter);

  const availablePosts = FEED_POSTS.filter(post => {
    const postChIdx = chapterOrder.indexOf(post.chapterAvailable);
    return postChIdx <= currentChapterIdx;
  });

  const filteredPosts = availablePosts.filter(post => {
    if (filter === 'verified') return post.verificationStatus === 'verified';
    if (filter === 'anomalous') return post.verificationStatus === 'anomalous' || post.verificationStatus === 'corrupted';
    if (filter === 'system') return post.verificationStatus === 'system';
    if (filter === 'saved') return state.savedPostIds.includes(post.id);
    return true;
  });

  const toggleReplies = (postId: string) => {
    soundManager.playClick();
    setExpandedReplies(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleInspectClue = (clueId: string) => {
    collectEvidence(clueId);
  };

  const handleOpenDM = (handle: string) => {
    soundManager.playClick();
    let charId: SurvivorId = 'mira';
    if (handle.includes('mira')) charId = 'mira';
    else if (handle.includes('thorne')) charId = 'elias';
    else if (handle.includes('null_echo') || handle.includes('ghost')) charId = 'ghost';
    else if (handle.includes('emergency') || handle.includes('net_root')) charId = 'system';
    
    setActiveChatCharacter(charId);
    setActiveNav('messages');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="text-[#8BAA91] text-[11px] font-mono flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Verified Citizen Node</span>
          </span>
        );
      case 'anomalous':
        return (
          <span className="text-[#C52A3A] text-[11px] font-mono flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Heuristic Anomaly Flagged</span>
          </span>
        );
      case 'corrupted':
        return (
          <span className="text-[#EAB308] text-[11px] font-mono flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Corrupted Memory Signature</span>
          </span>
        );
      case 'system':
        return (
          <span className="text-[#79B9C7] text-[11px] font-mono flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            <span>Civil Defense Broadcast</span>
          </span>
        );
      default:
        return (
          <span className="text-[#A4A9B5] text-[11px] font-mono">
            Unverified Transmission
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090D] overflow-hidden select-text">
      
      {/* Top Filter Bar */}
      <div className="bg-[#11131A] border-b border-[#1C202B] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold font-mono text-[#F0F0F2] tracking-wider uppercase">
            The Feed // Global Mesh Stream
          </h2>
          <span className="text-xs text-[#A4A9B5] font-mono">
            ({filteredPosts.length} transmissions)
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 bg-[#08090D] p-1 rounded border border-[#1C202B] text-xs font-mono">
          {(['all', 'verified', 'anomalous', 'system', 'saved'] as const).map(tabKey => (
            <button
              key={tabKey}
              onClick={() => {
                soundManager.playClick();
                setFilter(tabKey);
              }}
              className={`px-2.5 py-1 rounded capitalize transition-colors ${
                filter === tabKey
                  ? 'bg-[#1C202B] text-[#F0F0F2] font-semibold'
                  : 'text-[#A4A9B5] hover:text-[#F0F0F2]'
              }`}
            >
              {tabKey}
            </button>
          ))}
        </div>
      </div>

      {/* Main Posts Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-3xl mx-auto w-full">
        
        {/* Banner Alert */}
        <div className="p-3 bg-[#11131A] border-l-2 border-[#79B9C7] text-xs font-mono text-[#A4A9B5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#79B9C7] shrink-0" />
            <span>
              Network monitors flag suspicious posts with timestamps and lexical anomalies. Click "Inspect Clue" to log forensic evidence into your notebook.
            </span>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 text-xs font-mono text-[#A4A9B5] space-y-2">
            <p>No transmissions matching filter "{filter}".</p>
            <p className="text-[11px] text-[#A4A9B5]/70">Try viewing "All" to browse all active network traffic.</p>
          </div>
        ) : (
          filteredPosts.map(post => {
            const isSaved = state.savedPostIds.includes(post.id);
            const hasClue = !!post.clueId;
            const clueCollected = hasClue && state.evidenceCollected.includes(post.clueId!);
            const evidenceDef = hasClue ? EVIDENCE_ITEMS.find(e => e.id === post.clueId) : null;

            return (
              <article 
                key={post.id}
                className="bg-[#11131A] border border-[#1C202B] hover:border-[#1C202B]/80 transition-colors p-4 md:p-5 space-y-3"
              >
                {/* Post Author Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded flex items-center justify-center font-mono font-bold text-sm text-[#F0F0F2] shrink-0"
                      style={{ backgroundColor: `${post.avatarColor}33`, border: `1px solid ${post.avatarColor}` }}
                    >
                      {post.avatarInitial}
                    </div>

                    <div className="text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#F0F0F2] font-mono">{post.authorName}</span>
                        <span className="text-[#A4A9B5] font-mono">{post.authorHandle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] mt-0.5 text-[#A4A9B5]">
                        <span className="font-mono tabular-nums">{post.timestamp}</span>
                        <span>·</span>
                        {getStatusBadge(post.verificationStatus)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => savePost(post.id)}
                    className="text-[#A4A9B5] hover:text-[#79B9C7] transition-colors p-1"
                    title={isSaved ? 'Remove Bookmark' : 'Bookmark Post'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#79B9C7] text-[#79B9C7]' : ''}`} />
                  </button>
                </div>

                {/* Message Body */}
                <p className="text-sm md:text-base text-[#F0F0F2] font-sans leading-relaxed">
                  {post.content}
                </p>

                {/* Contradiction Highlight if Clue Present */}
                {post.hasContradiction && (
                  <div className="p-3 bg-[#08090D] border-l-2 border-[#C52A3A] text-xs font-mono space-y-1">
                    <div className="text-[#C52A3A] font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>HEURISTIC CONTRADICTION DETECTED</span>
                    </div>
                    <div className="text-[#A4A9B5]">
                      {post.contradictionNote}
                    </div>
                  </div>
                )}

                {/* Clue Discovery Box */}
                {hasClue && (
                  <div className="p-3 bg-[#08090D] border border-[#79B9C7]/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="space-y-0.5">
                      <div className="text-[#79B9C7] font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#79B9C7]" />
                        <span>Potential Evidence: {evidenceDef?.code} — {evidenceDef?.title}</span>
                      </div>
                      <div className="text-[#A4A9B5] text-[11px]">
                        {post.clueHint}
                      </div>
                    </div>

                    <button
                      onClick={() => handleInspectClue(post.clueId!)}
                      disabled={clueCollected}
                      className={`px-3 py-1.5 rounded font-semibold text-xs tracking-wider uppercase transition-colors ${
                        clueCollected
                          ? 'bg-[#8BAA91]/20 text-[#8BAA91] border border-[#8BAA91]/40 cursor-default'
                          : 'bg-[#C52A3A] hover:bg-[#a82230] text-[#F0F0F2]'
                      }`}
                    >
                      {clueCollected ? '✓ Evidence Logged' : 'Inspect & Collect Clue'}
                    </button>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1C202B] text-xs font-mono text-[#A4A9B5]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleOpenDM(post.authorHandle)}
                      className="hover:text-[#79B9C7] transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Direct Inquire</span>
                    </button>

                    {post.replies && post.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(post.id)}
                        className="hover:text-[#F0F0F2] transition-colors flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>
                          {expandedReplies[post.id] ? 'Hide Replies' : `Replies (${post.replies.length})`}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="text-[11px] text-[#A4A9B5] tabular-nums">
                    {post.likesCount} Re-broadcasts
                  </div>
                </div>

                {/* Replies Thread */}
                {expandedReplies[post.id] && post.replies && (
                  <div className="pt-2 pl-4 border-l border-[#1C202B] space-y-2 mt-2">
                    {post.replies.map((reply, rIdx) => (
                      <div key={rIdx} className="p-2.5 bg-[#08090D] border border-[#1C202B] text-xs font-mono space-y-1">
                        <div className="flex items-center justify-between text-[#A4A9B5]">
                          <span className="font-semibold text-[#F0F0F2]">{reply.author} <span className="text-[#A4A9B5]">{reply.handle}</span></span>
                          <span className="text-[10px] tabular-nums">{reply.timestamp}</span>
                        </div>
                        <p className="text-[#F0F0F2] font-sans text-xs">
                          {reply.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              </article>
            );
          })
        )}

      </div>

    </div>
  );
};
