import React, { useState } from 'react';
import { Copy, Check, Info, Sparkles, Wand2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

interface SpaceTabProps {
  onCopyNotice: (msg: string) => void;
}

export const SpaceTab: React.FC<SpaceTabProps> = ({ onCopyNotice }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customName, setCustomName] = useState('BOSS');
  const { startCopyFlow } = useAdmin();
  const { t } = useLanguage();

  // Hangul Filler \u3164
  const INVISIBLE_SPACE = '\u3164';

  const handleCopy = (val: string, key: string, label: string) => {
    startCopyFlow(val, () => {
      setCopiedKey(key);
      onCopyNotice(`Copied ${label}!`);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  };

  const spacedName = customName.split('').join(INVISIBLE_SPACE);

  return (
    <div className="space-y-4">
      {/* Primary Big Invisible Space Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.045] to-white/[0.01] bg-[#141418] border border-[#25252d] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            {/* Visual dashed box representation */}
            <div 
              onClick={() => handleCopy(INVISIBLE_SPACE, 'single-main', 'Invisible Space')}
              className="w-16 h-16 rounded-2xl border-2 border-dashed border-red-500/60 bg-[#1c1c22] flex items-center justify-center text-red-400 cursor-pointer hover:border-red-400 hover:bg-red-500/10 transition-all group shrink-0"
              title="Click to copy blank space"
            >
              <span className="font-mono text-xs font-bold text-red-300 group-hover:scale-110 transition-transform">
                [ㅤ]
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                {t('space_title')}
              </h2>
              <p className="text-xs sm:text-sm text-[#9494a0] mt-0.5">
                {t('space_desc')}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCopy(INVISIBLE_SPACE, 'single-main', 'Invisible Space')}
            className={`relative overflow-hidden w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-200 shadow-xl active:scale-95 ${
              copiedKey === 'single-main'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/50 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-[#ff3b53] via-[#e11d2e] to-[#8f0d1c] text-white shadow-red-600/40 border border-red-400/30 hover:brightness-110'
            }`}
          >
            <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            {copiedKey === 'single-main' ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                {t('copied')}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.2]" />
                {t('space_copy_btn')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Multi-Space Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { key: 'sp-1', label: '1x Invisible Space', val: INVISIBLE_SPACE, desc: 'Single gap for nickname' },
          { key: 'sp-2', label: '2x Double Space', val: `${INVISIBLE_SPACE}${INVISIBLE_SPACE}`, desc: 'Wide gap between words' },
          { key: 'sp-3', label: '3x Triple Space', val: `${INVISIBLE_SPACE}${INVISIBLE_SPACE}${INVISIBLE_SPACE}`, desc: 'Maximum spacing for FF' },
        ].map((item) => (
          <div
            key={item.key}
            className="p-4 rounded-2xl bg-[#141418] border border-[#25252d] flex flex-col justify-between gap-3 hover:border-red-500/40 transition-all shadow-md"
          >
            <div>
              <h3 className="text-sm font-bold text-white">{item.label}</h3>
              <p className="text-xs text-[#9494a0] mt-1">{item.desc}</p>
            </div>

            <button
              onClick={() => handleCopy(item.val, item.key, item.label)}
              className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 shadow-sm ${
                copiedKey === item.key
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/40 shadow-emerald-500/20'
                  : 'bg-gradient-to-b from-[#1e1e28] to-[#14141c] hover:bg-gradient-to-r hover:from-[#ff3b53] hover:to-[#e11d2e] text-zinc-200 hover:text-white border border-[#2f2f40] hover:border-transparent'
              }`}
            >
              {copiedKey === item.key ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 stroke-[2]" /> Copy
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Generate Spaced Nickname Generator */}
      <div className="p-5 rounded-2xl bg-[#141418] border border-[#25252d] space-y-3">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-red-400" /> Auto-Insert Invisible Spaces In Your Name:
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value.replace(/\s+/g, ''))}
            placeholder="Enter word e.g. BOSS"
            className="flex-1 bg-[#1c1c22] border border-[#34343e] rounded-xl px-4 py-2.5 text-white font-bold text-base focus:border-red-500 focus:outline-none"
          />

          <button
            onClick={() => handleCopy(spacedName, 'custom-spaced', `"${spacedName}"`)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5a6a] to-[#e11d2e] text-white font-bold text-xs shadow-md shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            {copiedKey === 'custom-spaced' ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied Spaced Name!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Spaced Name
              </>
            )}
          </button>
        </div>

        <div className="text-xs text-zinc-400 flex items-center gap-2 bg-[#1c1c22] p-2.5 rounded-xl border border-[#2a2a35]">
          <span className="text-zinc-500 font-medium">Result:</span>
          <span className="font-bold text-white tracking-widest">{spacedName}</span>
        </div>
      </div>

      {/* How to use Guide */}
      <div className="p-4 rounded-2xl bg-[#141418]/60 border border-[#25252d] space-y-2 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5 text-white font-bold text-sm">
          <Info className="w-4 h-4 text-red-400" /> How to use Free Fire Blank Space:
        </div>
        <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed text-zinc-300">
          <li>Click the <strong>Copy Invisible Space</strong> button above.</li>
          <li>Open Garena Free Fire or Free Fire MAX and go to your profile.</li>
          <li>Tap the nickname edit icon (pen icon beside your name).</li>
          <li>Paste the copied blank space between words, or paste it alone to make a completely invisible hidden nickname!</li>
          <li>Confirm with 390 Diamonds or a Name Change Card.</li>
        </ol>
      </div>
    </div>
  );
};
