import React, { useState } from 'react';
import { useGame } from '../context/GameStateContext';
import { EVIDENCE_ITEMS, DEDUCTION_RECIPES } from '../data/storyContent';
import { soundManager } from '../audio/soundManager';
import { 
  GitMerge, 
  Sparkles, 
  CheckCircle2, 
  X, 
  HelpCircle, 
  Cpu, 
  Layers, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DeductionView: React.FC = () => {
  const { 
    state, 
    toggleEvidenceSelection, 
    clearEvidenceSelection, 
    testDeduction,
    setActiveNav
  } = useGame();

  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  const selectedPieces = state.selectedEvidenceForDeduction;
  const discoveredRecipes = DEDUCTION_RECIPES.filter(r => state.deductionsDiscovered.includes(r.id));

  const handleSynthesize = () => {
    const res = testDeduction();
    setFeedback({
      isSuccess: res.success,
      text: res.message
    });
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#08090D] overflow-hidden select-text font-mono">
      
      {/* Left: Available Collected Evidence Checklist */}
      <div className="w-full md:w-80 bg-[#11131A] border-r border-[#1C202B] p-4 flex flex-col shrink-0 overflow-y-auto text-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1C202B]">
          <span className="font-semibold text-[#79B9C7] uppercase">Evidence Pool</span>
          <span className="text-[#A4A9B5]">{state.evidenceCollected.length} Collected</span>
        </div>

        <div className="text-[11px] text-[#A4A9B5]">
          Select 2 or 3 items to cross-reference on the deduction matrix.
        </div>

        <div className="space-y-1.5 flex-1">
          {state.evidenceCollected.length === 0 ? (
            <div className="p-4 bg-[#08090D] border border-[#1C202B] text-center text-[#A4A9B5] italic">
              No evidence collected yet. Browse The Feed, inspect posts, and interrogate survivors.
            </div>
          ) : (
            state.evidenceCollected.map(id => {
              const item = EVIDENCE_ITEMS.find(e => e.id === id);
              if (!item) return null;
              const isSelected = selectedPieces.includes(id);

              return (
                <button
                  key={id}
                  onClick={() => toggleEvidenceSelection(id)}
                  className={`w-full p-2.5 rounded text-left transition-colors border flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#1C202B] border-[#79B9C7] text-[#F0F0F2]'
                      : 'bg-[#08090D] border-[#1C202B] text-[#A4A9B5] hover:text-[#F0F0F2]'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-bold text-[#79B9C7] mr-1.5">{item.code}</span>
                    <span className="truncate">{item.title}</span>
                  </div>

                  <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#79B9C7] border-[#79B9C7] text-[#08090D]' : 'border-[#1C202B]'
                  }`}>
                    {isSelected && <span className="font-bold text-[10px]">✓</span>}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {selectedPieces.length > 0 && (
          <button
            onClick={clearEvidenceSelection}
            className="w-full py-1.5 text-[11px] text-[#C52A3A] hover:underline"
          >
            Clear Selected ({selectedPieces.length})
          </button>
        )}
      </div>

      {/* Main Deduction Synthesis Matrix */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 max-w-3xl">
        
        {/* Synthesis Chamber Card */}
        <div className="bg-[#11131A] border border-[#1C202B] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#1C202B] pb-3 text-xs">
            <div className="flex items-center gap-2 text-[#79B9C7] font-bold">
              <Cpu className="w-4 h-4" />
              <span>DEDUCTION SYNTHESIS CHAMBER</span>
            </div>
            <span className="text-[#A4A9B5]">Active Chamber: {selectedPieces.length} / 3 Items</span>
          </div>

          {/* Wire-Connected Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[0, 1, 2].map((slotIdx) => {
              const evidenceId = selectedPieces[slotIdx];
              const item = evidenceId ? EVIDENCE_ITEMS.find(e => e.id === evidenceId) : null;

              return (
                <div 
                  key={slotIdx}
                  className={`p-4 rounded border flex flex-col justify-between min-h-[110px] ${
                    item 
                      ? 'bg-[#08090D] border-[#79B9C7]/50 text-[#F0F0F2]' 
                      : 'bg-[#08090D]/50 border-dashed border-[#1C202B] text-[#A4A9B5]/40 justify-center items-center'
                  }`}
                >
                  {item ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#79B9C7]">{item.code}</span>
                        <button 
                          onClick={() => toggleEvidenceSelection(item.id)}
                          className="text-[#A4A9B5] hover:text-[#C52A3A]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-semibold truncate mt-1">{item.title}</div>
                      <div className="text-[10px] text-[#A4A9B5] truncate mt-1">{item.category}</div>
                    </>
                  ) : (
                    <span className="text-[11px] italic">Slot {slotIdx + 1} Empty</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-[#A4A9B5]">
              Select pieces that share an underlying contradiction or hidden author.
            </div>

            <button
              onClick={handleSynthesize}
              disabled={selectedPieces.length < 2}
              className={`w-full sm:w-auto py-2.5 px-6 rounded text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
                selectedPieces.length >= 2
                  ? 'bg-[#C52A3A] hover:bg-[#a82230] text-[#F0F0F2]'
                  : 'bg-[#1C202B] text-[#A4A9B5]/40 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize Correlation</span>
            </button>
          </div>

          {/* Feedback Display */}
          {feedback && (
            <div className={`p-4 rounded border text-xs leading-relaxed animate-in fade-in ${
              feedback.isSuccess 
                ? 'bg-[#8BAA91]/10 border-[#8BAA91] text-[#8BAA91]' 
                : 'bg-[#08090D] border-[#1C202B] text-[#A4A9B5]'
            }`}>
              <div className="font-bold uppercase tracking-wider mb-1">
                {feedback.isSuccess ? '✓ Correlation Verified' : 'Correlation Negative'}
              </div>
              <p className="font-sans text-xs md:text-sm text-[#F0F0F2]">
                {feedback.text}
              </p>
            </div>
          )}

        </div>

        {/* Breakthrough Archive */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C202B] pb-2 text-xs">
            <span className="font-bold text-[#8BAA91] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Deduction Breakthroughs ({discoveredRecipes.length} / 5)</span>
            </span>
          </div>

          {discoveredRecipes.length === 0 ? (
            <div className="p-6 bg-[#11131A] border border-[#1C202B] text-center text-xs text-[#A4A9B5] italic">
              No breakthroughs assembled yet. Experiment freely—invalid combinations carry zero penalty.
            </div>
          ) : (
            <div className="space-y-3">
              {discoveredRecipes.map(recipe => (
                <div key={recipe.id} className="p-4 bg-[#11131A] border border-[#8BAA91]/40 rounded space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#8BAA91] font-bold">
                    <span>{recipe.title}</span>
                    <span className="text-[10px] text-[#A4A9B5]">Verified via {recipe.requiredEvidenceIds.join(' + ')}</span>
                  </div>
                  <p className="font-sans text-xs md:text-sm text-[#F0F0F2]">
                    {recipe.breakthroughText}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
