import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { calcNameLen } from '../data/styles';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

interface NameCardProps {
  name: string;
  label?: string;
  onCopy: (name: string) => void;
}

export const NameCard: React.FC<NameCardProps> = ({ name, label, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const { startCopyFlow } = useAdmin();
  const { t } = useLanguage();
  const length = calcNameLen(name);

  const handleCopy = () => {
    startCopyFlow(name, () => {
      setCopied(true);
      onCopy(name);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="group relative overflow-hidden flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-white/[0.045] to-white/[0.01] bg-[#141418] border border-[#25252d] shadow-lg shadow-black/60 hover:border-red-500/50 hover:shadow-red-500/10 hover:-translate-y-0.5 transition-all duration-200">
      {/* Left indicator accent line */}
      <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r bg-gradient-to-b from-[#ff5a6a] via-[#e11d2e] to-[#8f0d1c] opacity-60 group-hover:opacity-100 group-hover:top-[10%] group-hover:bottom-[10%] transition-all" />

      {/* Subtle hover background radial glow */}
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-red-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="min-w-0 flex-1 pl-2">
        <div className="font-glyph text-lg sm:text-xl font-medium tracking-wide text-white break-all select-all">
          {name}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-[#9494a0] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm shadow-red-500 shrink-0" />
          {label && <span className="truncate max-w-[140px] text-zinc-300">{label}</span>}
          <span>•</span>
          <span className={length > 12 ? 'text-amber-400 font-bold' : ''}>
            {length}/12 chars
          </span>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className={`group/btn relative shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 h-12 sm:h-13 rounded-2xl text-[11px] font-extrabold tracking-wide transition-all duration-200 active:scale-95 shadow-md overflow-hidden ${
          copied
            ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-emerald-600/40 border border-emerald-400/50'
            : 'bg-gradient-to-b from-[#1e1e28] via-[#161620] to-[#101015] text-red-400 border border-red-500/30 hover:border-red-500 hover:from-[#ff3b53] hover:via-[#e11d2e] hover:to-[#9f0e1f] hover:text-white hover:shadow-red-600/40 hover:shadow-lg'
        }`}
        title={t('copy')}
      >
        {/* Subtle button glossy top highlight */}
        <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {copied ? (
          <span className="flex flex-col items-center justify-center gap-0.5 animate-in zoom-in-75 duration-150">
            <Check className="w-4 h-4 stroke-[3] text-white drop-shadow" />
            <span className="text-[10px] uppercase font-black tracking-wider leading-none">{t('copied')}</span>
          </span>
        ) : (
          <span className="flex flex-col items-center justify-center gap-0.5 group-hover/btn:scale-105 transition-transform duration-150">
            <Copy className="w-4 h-4 stroke-[2.2] group-hover/btn:rotate-[-4deg] transition-transform" />
            <span className="text-[10px] uppercase font-black tracking-wider leading-none text-zinc-300 group-hover/btn:text-white">
              {t('copy')}
            </span>
          </span>
        )}
      </button>
    </div>
  );
};
