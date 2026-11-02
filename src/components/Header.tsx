import React from 'react';
import { Flame, Sparkles, Bell } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
  onCopyNotice: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onCopyNotice }) => {
  const { config } = useAdmin();
  const { t } = useLanguage();

  const handleCopyBrand = () => {
    navigator.clipboard.writeText(config.brandName || '亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗');
    onCopyNotice(t('brand_copied'));
  };

  return (
    <>
      {/* Top Utility Bar with Language Selector at Top-Left & Notification at Top-Right */}
      <div className="flex items-center justify-between pt-3 pb-1 px-1">
        <LanguageSelector />

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500 animate-pulse" />
            <span className="text-zinc-400">{t('pro_names_badge')}</span>
          </div>

          <NotificationCenter />
        </div>
      </div>

      {/* Top Announcement Bar if enabled by Admin */}
      {config.showAnnouncement && config.announcement && (
        <div className="my-2 p-2.5 rounded-2xl bg-gradient-to-r from-red-950/80 via-zinc-900 to-red-950/80 border border-red-500/40 text-center flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white shadow-md animate-in fade-in">
          <Bell className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
          <span>{config.announcement}</span>
        </div>
      )}

      <header className="relative overflow-hidden rounded-3xl my-3 sm:my-4 p-5 sm:p-6 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-[#e11d2e]/10 border border-white/10 shadow-2xl shadow-black/80">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3 py-1">
          {/* 1. Logo Avatar (Centered at Top) */}
          {config.showLogo && (
            <div 
              onClick={handleCopyBrand}
              title="Click to copy brand name"
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-br from-[#a855f7] via-[#ef4444] to-[#eab308] shadow-xl shadow-purple-600/40 cursor-pointer group transition-transform hover:scale-105 active:scale-95"
            >
              <img
                src={config.brandLogo || '/logo.png'}
                alt={config.brandName}
                className="w-full h-full object-cover rounded-[20px]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-black/85 border border-purple-500/50 rounded-full p-1.5 text-amber-400 group-hover:scale-110 transition-transform shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* 2. Brand Name (Right Below Logo) */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-100 to-purple-200 bg-clip-text text-transparent drop-shadow-md">
            {config.brandName || '✦ 𝑹𝑿 𝑵𝑨𝑴𝑬 𝑮𝑬𝑵𝑬𝑹𝑨𝑻𝑶𝑹 ✦'}
          </h1>

          {/* 3. PRIME RXH Badge (Right Below Name) */}
          {config.showBadge && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-purple-500/25 via-amber-500/20 to-purple-500/25 border border-amber-400/40 text-amber-300 shadow-sm shadow-amber-500/20 tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{config.brandBadge || 'PRIME RXH'}</span>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
