import React, { useState, useMemo, useRef } from 'react';
import { NameCard } from './NameCard';
import {
  BASE_STYLES,
  EXTRA_STYLES,
  FRAMES,
  TAGS_L,
  TAGS_R,
  applyStyle,
  isNameAllowed,
  A
} from '../data/styles';
import { Search, X, Sparkles, Plus, Flame } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

interface GeneratorTabProps {
  onCopyNotice: (name: string) => void;
}

export const GeneratorTab: React.FC<GeneratorTabProps> = ({ onCopyNotice }) => {
  const [keyword, setKeyword] = useState<string>('');
  const [displayCount, setDisplayCount] = useState<number>(36);
  const { setIsAdminOpen } = useAdmin();
  const { t } = useLanguage();

  // Secret trigger counter for ROBIXHUNTER + 3x Enter
  const enterPressCountRef = useRef<number>(0);

  const cleanKeyword = keyword.trim();
  const charCount = Math.min(12, A(cleanKeyword).length);

  // Handle secret trigger keydown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const normalized = keyword.trim().toUpperCase();
      if (normalized === 'ROBIXHUNTER') {
        enterPressCountRef.current += 1;
        if (enterPressCountRef.current >= 3) {
          setIsAdminOpen(true);
          enterPressCountRef.current = 0;
          onCopyNotice('এডমিন মোড সক্রিয় হয়েছে!');
        }
      } else {
        enterPressCountRef.current = 0;
      }
    }
  };

  // Generate EXCLUSIVELY the user's typed name with best stylish designs
  const generatedNames = useMemo(() => {
    if (!cleanKeyword) return [];

    const results: { id: string; name: string; style: string }[] = [];
    const seen = new Set<string>();

    const addVariation = (formattedName: string, styleLabel: string) => {
      if (isNameAllowed(formattedName, 14) && !seen.has(formattedName)) {
        seen.add(formattedName);
        results.push({
          id: `item-${seen.size}-${formattedName}`,
          name: formattedName,
          style: styleLabel
        });
      }
    };

    // 1. Prime VIP Free Fire Framed Styles (Using user's exact name)
    const topFrames = [
      ['亗', '亗', 'VIP Boss'],
      ['亗『', '』亗', 'VIP Master'],
      ['『亗', '亗』', 'VIP Crown'],
      ['꧁', '꧂', 'Angel Wings'],
      ['꧁༒', '༒꧂', 'Ghost Clan'],
      ['꧁༒☬', '☬༒꧂', 'Legendary Clan'],
      ['꧁༺', '༻꧂', 'Royal Wings'],
      ['『', '』', 'Japanese Brackets'],
      ['【', '】', 'Heavy Brackets'],
      ['「', '」', 'Corner Brackets'],
      ['〆', '々', 'Samurai Slash'],
      ['〆', '〆', 'Double Slash'],
      ['々', '々', 'Twin Blade'],
      ['メ', 'メ', 'Katana'],
      ['乂', '乂', 'Cross Blade'],
      ['乡', '乡', 'Ninja Clan'],
      ['★彡', '彡★', 'Shooting Star'],
      ['☆彡', '彡☆', 'Open Star'],
      ['♛', '♛', 'Royal King'],
      ['♚', '♚', 'Grand King'],
      ['☬', '☬', 'Holy Warrior'],
      ['༒', '༒', 'Devil God'],
      ['✦', '✦', 'Sparkle'],
      ['❖', '❖', 'Diamond Gem'],
      ['✿', '✿', 'Rose Petal'],
      ['×͜×', '', 'Smiley Devil'],
      ['', '•㉿', 'Tokyo Ghoul'],
      ['', 'ツ', 'Smile Face'],
      ['ツ', '', 'Tsu Head'],
      ['▄︻┻┳═一', '', 'Sniper AWM'],
      ['', '▄︻┻┳═一', 'Sniper Barrett'],
      ['⚡', '⚡', 'Thunderbolt'],
      ['👑', '👑', 'Crown Gold'],
      ['🔥', '🔥', 'Flame Fire'],
      ['💀', '💀', 'Skull Reaper']
    ];

    topFrames.forEach(([left, right, label]) => {
      addVariation(`${left}${cleanKeyword}${right}`, label);
    });

    // 2. Pure Font Styles Applied STRICTLY to typed name
    const allStyles = [...BASE_STYLES, ...EXTRA_STYLES];
    allStyles.forEach(style => {
      const styledCore = applyStyle(cleanKeyword, style);
      addVariation(styledCore, style.n);
    });

    // 3. Gamer Tags (PRO, OP, KING, BD, etc.) Applied to typed name
    TAGS_L.forEach(tagL => {
      addVariation(`${tagL}${cleanKeyword}`, `Badge • ${tagL}`);
    });

    TAGS_R.forEach(tagR => {
      addVariation(`${cleanKeyword}${tagR}`, `Badge • ${tagR}`);
    });

    // 4. Combined Best Designs: Stylized Font + Top Frames
    const bestFonts = [
      allStyles.find(s => s.n === 'Bold') || BASE_STYLES[0],
      allStyles.find(s => s.n === 'Small Caps') || BASE_STYLES[0],
      allStyles.find(s => s.n === 'Mixed Small Caps') || BASE_STYLES[0],
      allStyles.find(s => s.n === 'Sans Bold') || BASE_STYLES[0],
      allStyles.find(s => s.n === 'Italic') || BASE_STYLES[0],
      allStyles.find(s => s.n === 'Script') || BASE_STYLES[0],
      allStyles.find(s => s.n === 'Double') || BASE_STYLES[0],
      allStyles.find(s => s.n === 'Circled') || BASE_STYLES[0]
    ];

    bestFonts.forEach(font => {
      const styled = applyStyle(cleanKeyword, font);
      topFrames.slice(0, 18).forEach(([left, right]) => {
        addVariation(`${left}${styled}${right}`, `VIP • ${font.n}`);
      });
    });

    return results;
  }, [cleanKeyword]);

  const visibleNames = generatedNames.slice(0, displayCount);

  return (
    <div className="space-y-4">
      {/* Search Bar with Conic Gradient Border */}
      <div className="relative rounded-[26px] p-[2px] bg-gradient-to-r from-red-500 via-rose-600 to-amber-500 shadow-xl shadow-red-600/20">
        <div className="relative flex items-center bg-[#0f0f13] rounded-[24px] px-4 py-3 sm:py-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#ff5a6a] via-[#e11d2e] to-[#8f0d1c] text-white shadow-md shadow-red-600/50 shrink-0">
            <Search className="w-5 h-5 stroke-[2.2]" />
          </div>

          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              const val = A(e.target.value).slice(0, 12).join('');
              setKeyword(val);
              setDisplayCount(36);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t('type_name_placeholder')}
            maxLength={12}
            className="flex-1 min-w-0 bg-transparent border-0 px-3 sm:px-4 text-white text-base sm:text-lg font-bold placeholder-zinc-500 focus:outline-none"
          />

          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              charCount >= 12
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-white/5 text-zinc-400 border-white/10'
            }`}>
              {charCount}/12
            </span>

            {cleanKeyword && (
              <button
                onClick={() => setKeyword('')}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-red-600 text-zinc-300 hover:text-white transition-all duration-150 active:scale-90 shadow-sm"
                title={t('clear')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header when user types a name */}
      {cleanKeyword ? (
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span>
            {t('generated_for')} "<strong>{cleanKeyword}</strong>" (<strong className="text-white">{generatedNames.length}</strong>)
          </span>
          <span className="text-red-400 font-semibold">{t('choose_and_copy')}</span>
        </div>
      ) : null}

      {/* Grid of Results strictly for typed name */}
      {cleanKeyword && visibleNames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleNames.map(item => (
            <NameCard
              key={item.id}
              name={item.name}
              label={item.style}
              onCopy={onCopyNotice}
            />
          ))}
        </div>
      ) : (
        /* Empty state: clear, professional prompt asking for the user's name */
        <div className="p-10 sm:p-14 text-center rounded-3xl bg-[#141418] border border-[#25252d] space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t('type_name_instruction')}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md mx-auto leading-relaxed">
              {t('type_name_desc')}
            </p>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {cleanKeyword && visibleNames.length < generatedNames.length && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setDisplayCount(prev => prev + 36)}
            className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-extrabold tracking-wide bg-gradient-to-r from-[#ff3b53] via-[#e11d2e] to-[#8f0d1c] text-white shadow-xl shadow-red-600/35 border border-red-400/30 hover:brightness-110 active:scale-95 transition-all duration-200 group"
          >
            <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
            <span>
              {t('load_more_designs')} ({generatedNames.length - visibleNames.length} {t('remaining')})
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
