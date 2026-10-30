import React, { useState } from 'react';
import { SYMBOLS_GROUPS } from '../data/styles';
import { Search, Copy, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SymbolsTabProps {
  onCopyNotice: (sym: string) => void;
}

export const SymbolsTab: React.FC<SymbolsTabProps> = ({ onCopyNotice }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customDraft, setCustomDraft] = useState('');
  const [foldedGroups, setFoldedGroups] = useState<Record<string, boolean>>({});
  const { t } = useLanguage();

  const toggleGroup = (title: string) => {
    setFoldedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleCopySymbol = (sym: string) => {
    navigator.clipboard.writeText(sym);
    onCopyNotice(`Copied: ${sym}`);
  };

  const handleAppendSymbol = (sym: string) => {
    setCustomDraft(prev => prev + sym);
  };

  const filteredGroups = SYMBOLS_GROUPS.map(group => {
    if (!searchQuery.trim()) return group;
    const query = searchQuery.toLowerCase();
    const matchesTitle = group.title.toLowerCase().includes(query);
    const matchingSymbols = group.symbols.filter(s => s.toLowerCase().includes(query));
    if (matchesTitle) return group;
    return { ...group, symbols: matchingSymbols };
  }).filter(group => group.symbols.length > 0);

  return (
    <div className="space-y-4">
      {/* Symbol Builder / Playground Bar */}
      <div className="p-4 rounded-2xl bg-[#141418] border border-[#25252d] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-400" /> {t('symbol_combiner')}:
          </label>
          {customDraft && (
            <button
              onClick={() => setCustomDraft('')}
              className="text-xs text-zinc-400 hover:text-red-400"
            >
              {t('clear')}
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customDraft}
            onChange={(e) => setCustomDraft(e.target.value)}
            placeholder="Click any symbol below or type your name..."
            className="flex-1 bg-[#1c1c22] border border-[#34343e] rounded-xl px-4 py-2.5 text-white font-glyph text-lg focus:border-red-500 focus:outline-none"
          />
          {customDraft && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(customDraft);
                onCopyNotice(customDraft);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3b53] to-[#e11d2e] text-white font-extrabold text-xs shadow-md shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Copy className="w-3.5 h-3.5 stroke-[2.2]" /> {t('copy')}
            </button>
          )}
        </div>
        <p className="text-[11px] text-zinc-500">
          Tip: Tap symbols below to append them into the box, or click directly to copy!
        </p>
      </div>

      {/* Search Input for Symbols */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search symbols (crown, weapon, star, king, cross, heart)..."
          className="w-full bg-[#141418] border border-[#25252d] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
        />
      </div>

      {/* Symbol Groups */}
      <div className="space-y-3">
        {filteredGroups.map(group => {
          const isFolded = foldedGroups[group.title];

          return (
            <div
              key={group.title}
              className="rounded-2xl bg-[#141418] border border-[#25252d] overflow-hidden"
            >
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500 shrink-0" />
                  <span className="text-sm font-bold text-white tracking-wide">
                    {group.title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 font-semibold">
                    {group.symbols.length}
                  </span>
                </div>
                {isFolded ? (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              {!isFolded && (
                <div className="p-4 pt-1 border-t border-[#25252d]/60">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {group.symbols.map((sym, i) => (
                      <div key={i} className="group/sym relative">
                        <button
                          onClick={() => {
                            handleCopySymbol(sym);
                            handleAppendSymbol(sym);
                          }}
                          className="min-w-[42px] h-[42px] px-2.5 rounded-xl bg-gradient-to-b from-[#1c1c24] to-[#14141a] border border-[#262635] hover:border-red-500 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-rose-600/20 hover:text-red-300 active:scale-90 text-white font-glyph text-lg sm:text-xl flex items-center justify-center transition-all duration-100 select-none shadow-sm"
                          title={`Click to copy: ${sym}`}
                        >
                          {sym}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
