import React, { useState } from 'react';
import { useLanguage, LANGUAGES, LanguageItem } from '../context/LanguageContext';
import { Globe, ChevronDown, Check, Search, X, Sparkles } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredLanguages = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.englishName.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase()) ||
    (l.country && l.country.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (lang: LanguageItem) => {
    setLanguage(lang);
    setIsOpen(false);
    setSearch('');
  };

  // Quick popular languages
  const popularLangs = LANGUAGES.slice(0, 8);

  return (
    <>
      {/* Top-Left Language Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#1c1c26] via-[#14141c] to-[#0d0d12] hover:from-[#252533] hover:to-[#171722] border border-red-500/30 hover:border-red-500/70 text-xs font-bold text-white shadow-lg shadow-black/80 transition-all duration-200 group shrink-0 active:scale-95 hover:shadow-red-500/20"
        title="Select Language / ভাষা পরিবর্তন করুন"
      >
        <span className="w-5 h-5 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-110 group-hover:bg-red-600/30 transition-transform">
          <Globe className="w-3 h-3 text-red-400" />
        </span>
        <span className="text-base leading-none drop-shadow">{currentLanguage.flag}</span>
        <span className="text-xs font-extrabold tracking-wide text-zinc-100 group-hover:text-white">
          {currentLanguage.name}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-400 transition-transform group-hover:translate-y-0.5" />
      </button>

      {/* Language Selection Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#121217] border border-red-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-red-600/30 space-y-4 overflow-hidden animate-in zoom-in-95">
            {/* Background glow */}
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#25252d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff5a6a] to-[#e11d2e] flex items-center justify-center text-white shadow-md shadow-red-600/40">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    {t('select_language')}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Choose your country or language (সব দেশের ভাষা)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white text-zinc-400 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search_language')}
                className="w-full bg-[#181822] border border-[#2a2a35] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Popular Languages Quick Bar */}
            {!search && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-red-400" /> {t('popular_languages')}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {popularLangs.map((lang) => {
                    const isSelected = currentLanguage.code === lang.code;
                    return (
                      <button
                        key={`quick-${lang.code}`}
                        onClick={() => handleSelect(lang)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                          isSelected
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/40 border border-red-400'
                            : 'bg-[#1a1a24] hover:bg-[#242432] border border-[#2b2b3a] hover:border-red-500/50 text-zinc-300 hover:text-white'
                        }`}
                      >
                        <span className="text-sm">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Languages Grid */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                {t('all_languages')} ({filteredLanguages.length})
              </span>
              <div className="max-h-[280px] overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin">
                {filteredLanguages.map((lang) => {
                  const isSelected = currentLanguage.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all duration-150 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-gradient-to-r from-red-600/30 via-rose-600/20 to-transparent border border-red-500/70 text-white shadow-md shadow-red-500/10'
                          : 'bg-[#161620] hover:bg-[#20202c] border border-[#242432] hover:border-red-500/40 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{lang.flag}</span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                            <span>{lang.name}</span>
                            <span className="text-[10px] text-zinc-400 font-normal truncate">
                              ({lang.englishName})
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate">
                            {lang.country}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}

                {filteredLanguages.length === 0 && (
                  <div className="p-8 text-center text-xs text-zinc-500">
                    কোনো ভাষা পাওয়া যায়নি (No language found)
                  </div>
                )}
              </div>
            </div>

            {/* Footer note */}
            <p className="text-[10px] text-center text-zinc-500 pt-1 border-t border-[#25252d]">
              * Switch to your country's language instantly anytime.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
