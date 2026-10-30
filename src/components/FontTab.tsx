import React, { useState } from 'react';
import {
  BASE_STYLES,
  EXTRA_STYLES,
  applyStyle,
  UP,
  LO,
  DG,
  A
} from '../data/styles';
import { Copy, Sparkles, Check, Type } from 'lucide-react';

import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

interface FontTabProps {
  onCopyNotice: (text: string) => void;
}

export const FontTab: React.FC<FontTabProps> = ({ onCopyNotice }) => {
  const [inputText, setInputText] = useState('FF VIP');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { startCopyFlow } = useAdmin();
  const { t } = useLanguage();

  const allFontStyles = [...BASE_STYLES, ...EXTRA_STYLES].filter(
    s => !s.n.includes('Random Mix') && !s.n.includes('Leet') && !s.sep
  );

  const handleCopyRow = (styledText: string, id: string) => {
    startCopyFlow(styledText, () => {
      setCopiedId(id);
      onCopyNotice(styledText);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const handleCopyChar = (char: string) => {
    navigator.clipboard.writeText(char);
    onCopyNotice(`Copied: ${char}`);
  };

  const sampleChars = A(UP + DG);

  return (
    <div className="space-y-4">
      {/* Interactive Text Preview Input */}
      <div className="p-4 rounded-2xl bg-[#141418] border border-[#25252d] space-y-3">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-red-400" /> {t('test_fonts')}:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type text to preview..."
            className="flex-1 bg-[#1c1c22] border border-[#34343e] rounded-xl px-4 py-2.5 text-white font-bold text-base focus:border-red-500 focus:outline-none"
          />
          {inputText && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(inputText);
                onCopyNotice('Copied input text!');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3b53] to-[#e11d2e] text-white font-extrabold text-xs shadow-md shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Copy className="w-3.5 h-3.5 stroke-[2.2]" /> {t('copy')}
            </button>
          )}
        </div>
      </div>

      {/* Font Categories */}
      <div className="space-y-4">
        {allFontStyles.map((style) => {
          const styledPreview = inputText ? applyStyle(inputText, style) : '';
          
          // Generate alphabet preview
          const styledChars = sampleChars.map((c, i) => style.f(c, i, sampleChars));
          const uniqueChars = [...new Set(styledChars)];

          return (
            <div
              key={style.n}
              className="p-4 rounded-2xl bg-[#141418] border border-[#25252d] space-y-3 shadow-md"
            >
              {/* Header with Title & Full-Text Copy */}
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#25252d]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500 shrink-0" />
                  <h3 className="text-sm font-bold text-white tracking-wide truncate">
                    {style.n}
                  </h3>
                  {style.test && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      Special
                    </span>
                  )}
                </div>

                {inputText && (
                  <button
                    onClick={() => handleCopyRow(styledPreview, style.n)}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-b from-[#1e1e28] to-[#14141c] hover:bg-gradient-to-r hover:from-[#ff3b53] hover:to-[#e11d2e] border border-[#2f2f40] hover:border-transparent text-zinc-200 hover:text-white active:scale-95 transition-all duration-150 shadow-sm"
                  >
                    {copiedId === style.n ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 stroke-[2]" />
                        <span>Copy "{styledPreview}"</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Styled Preview Banner */}
              {inputText && (
                <div 
                  onClick={() => handleCopyRow(styledPreview, style.n)}
                  className="p-3 rounded-xl bg-[#1c1c22]/80 border border-[#2a2a35] hover:border-red-500/50 hover:bg-[#20202c] cursor-pointer group flex items-center justify-between transition-all duration-150 active:scale-[0.99]"
                  title="Click to copy"
                >
                  <span className="font-glyph text-lg sm:text-xl font-bold text-white tracking-wide break-all">
                    {styledPreview}
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-red-400 shrink-0 ml-2">
                    Click to copy
                  </span>
                </div>
              )}

              {/* Character Palette (Click any character to copy) */}
              <div>
                <p className="text-[11px] font-semibold text-zinc-500 mb-2">
                  Click any letter/number to copy individually:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueChars.slice(0, 36).map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopyChar(ch)}
                      className="min-w-[34px] h-[34px] px-2 rounded-xl bg-gradient-to-b from-[#1c1c24] to-[#14141a] border border-[#262635] hover:border-red-500 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-rose-600/20 hover:text-red-300 active:scale-90 text-white font-glyph text-base flex items-center justify-center transition-all duration-100 shadow-sm select-none"
                      title={`Copy ${ch}`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
