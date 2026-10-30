import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NameCard } from './NameCard';
import {
  STYLES,
  FRAMES,
  TAGS_L,
  TAGS_R,
  WORDS_DICT,
  SUFFIXES,
  ALL_WORDS,
  applyStyle,
  pick,
  rnd,
  isNameAllowed,
  shuf
} from '../data/styles';
import { RefreshCw, Plus, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AutoTabProps {
  onCopyNotice: (name: string) => void;
}

export const AutoTab: React.FC<AutoTabProps> = ({ onCopyNotice }) => {
  const [category, setCategory] = useState<string>('all');
  const [names, setNames] = useState<{ id: string; name: string; style: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const generateSingleName = useCallback((cat: string) => {
    const pool = cat === 'all' ? ALL_WORDS : (WORDS_DICT[cat] || ALL_WORDS);
    const validStyles = STYLES.filter(s => !s.n.includes('Leet') && !s.n.includes('Random Mix'));
    
    for (let tries = 0; tries < 80; tries++) {
      const style = pick(validStyles);
      const frame = pick(FRAMES);
      const hasLTag = rnd(10) < 3;
      const hasRTag = rnd(10) < 3;
      const tagL = hasLTag ? pick(TAGS_L) : '';
      const tagR = hasRTag ? pick(TAGS_R) : '';
      const word = pick(pool);
      const mode = rnd(3);

      let core = word;
      if (mode === 1) {
        const suf = pick(SUFFIXES);
        core = `${word}${suf}`;
      } else if (mode === 2) {
        const w2 = pick(pool);
        if (word.length + w2.length <= 10) {
          core = `${word}${w2}`;
        }
      }

      const styledCore = applyStyle(core, style);
      const finalName = `${frame[0]}${tagL}${styledCore}${tagR}${frame[1]}`;

      if (isNameAllowed(finalName, 12)) {
        return {
          id: `auto-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`,
          name: finalName,
          style: style.n
        };
      }
    }
    return null;
  }, []);

  const generateBatch = useCallback((count = 24, cat = category, reset = false) => {
    setLoading(true);
    const results: { id: string; name: string; style: string }[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < count; i++) {
      const item = generateSingleName(cat);
      if (item && !seen.has(item.name)) {
        seen.add(item.name);
        results.push(item);
      }
    }

    setNames(prev => reset ? results : [...prev, ...results]);
    setLoading(false);
  }, [category, generateSingleName]);

  useEffect(() => {
    generateBatch(24, category, true);
  }, [category]);

  return (
    <div className="space-y-4">
      {/* Category Pills & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-[#141418] border border-[#25252d]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <span className="text-xs font-bold text-zinc-400 flex items-center gap-1 shrink-0 px-1">
            <Filter className="w-3.5 h-3.5" /> {t('category_label')}
          </span>
          {[
            { id: 'all', label: t('cat_all') },
            { id: 'bd', label: t('cat_bd') },
            { id: 'king', label: t('cat_king') },
            { id: 'dark', label: t('cat_dark') },
            { id: 'pro', label: t('cat_pro') },
            { id: 'cool', label: t('cat_cool') },
            { id: 'love', label: t('cat_love') }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                category === c.id
                  ? 'bg-gradient-to-r from-[#ff3b53] to-[#e11d2e] text-white shadow-md shadow-red-600/40 border border-red-400/40'
                  : 'bg-[#181822] text-zinc-300 border border-[#262635] hover:text-white hover:border-red-500/50 hover:bg-[#20202e]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => generateBatch(24, category, true)}
          disabled={loading}
          className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-b from-[#1e1e28] to-[#121218] border border-[#2f2f40] text-zinc-200 hover:text-white hover:border-red-500/70 hover:shadow-red-500/20 hover:shadow-md transition-all duration-150 active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-red-400 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
          {t('refresh_names')}
        </button>
      </div>

      {/* Grid of Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {names.map(item => (
          <NameCard
            key={item.id}
            name={item.name}
            label={item.style}
            onCopy={onCopyNotice}
          />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => generateBatch(18, category, false)}
          disabled={loading}
          className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-extrabold tracking-wide bg-gradient-to-r from-[#ff3b53] via-[#e11d2e] to-[#8f0d1c] text-white shadow-xl shadow-red-600/35 border border-red-400/30 hover:brightness-110 active:scale-95 transition-all duration-200 group"
        >
          <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
          <span>{t('load_more_names')}</span>
        </button>
      </div>
    </div>
  );
};
