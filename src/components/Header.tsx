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

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5">
          {/* Logo Avatar (Boy's Gamer Photo or Custom/Fallback) */}
          {config.showLogo && (
            <div 
              onClick={handleCopyBrand}
              title="Click to copy brand name"
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl shrink-0 p-1 bg-gradient-to-br from-[#ff5a6a] via-[#e11d2e] to-[#8f0d1c] shadow-lg shadow-red-600/50 cursor-pointer group transition-transform hover:scale-105"
            >
              {config.brandLogo ? (
                <img
                  src={config.brandLogo}
                  alt={config.brandName}
                  className="w-full h-full object-cover rounded-[14px] sm:rounded-[20px]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // fallback if link broken
                    (e.target as HTMLImageElement).src = 'https://i.postimg.cc/6q0XrBKv/file-00000000228082118a51e116fc12be7f.png';
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-[14px] sm:rounded-[20px] bg-zinc-900 flex items-center justify-center text-red-500">
                  <Flame className="w-8 h-8" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-black/80 border border-red-500/40 rounded-full p-1 text-red-400 group-hover:scale-110 transition-transform">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Text Info */}
          <div className="text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white via-white to-red-200 bg-clip-text text-transparent drop-shadow-md">
                {config.brandName || '亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗'}
              </h1>
              {config.showBadge && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/15 border border-red-500/30 text-red-400">
                  <Sparkles className="w-3 h-3" /> {config.brandBadge || 'FF PRO'}
                </span>
              )}
            </div>
            {config.brandSubtitle && (
              <p className="mt-1 text-xs sm:text-sm font-semibold tracking-wide bg-gradient-to-r from-red-300 via-rose-200 to-zinc-400 bg-clip-text text-transparent">
                {config.brandSubtitle}
              </p>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
