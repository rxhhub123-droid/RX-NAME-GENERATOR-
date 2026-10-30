import React, { useState } from 'react';
import {
  Share2,
  Check,
  ExternalLink,
  Youtube,
  Send
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

interface SocialBarProps {
  onCopyNotice: (msg: string) => void;
}

export const SocialBar: React.FC<SocialBarProps> = ({ onCopyNotice }) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const { config } = useAdmin();
  const { t } = useLanguage();

  const socials = [
    {
      id: 'youtube',
      name: 'YouTube',
      desc: '@mrrxh • Official Channel',
      icon: Youtube,
      color: 'from-red-600 to-rose-700',
      url: config.youtubeUrl
    },
    {
      id: 'telegram',
      name: 'Telegram',
      desc: 'RXH Official Clan',
      icon: Send,
      color: 'from-sky-500 to-blue-600',
      url: config.telegramUrl
    }
  ];

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: config.brandName,
      text: 'Check out the best Free Fire stylish name generator, symbols and blank space tool!',
      url: url
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        onCopyNotice(t('link_copied'));
        return;
      } catch (err) {
        // Fallback to copy link
      }
    }

    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    onCopyNotice(t('link_copied'));
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="mt-10 pt-6 border-t border-[#25252d] space-y-5">
      {/* Social Bar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-md shadow-red-500" />
            {t('community_title')}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t('community_subtitle')}
          </p>
        </div>

        <button
          onClick={handleShare}
          className="relative overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff3b53] to-[#e11d2e] text-white text-xs font-extrabold shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-95 flex items-center gap-1.5 transition-all duration-150 border border-red-400/30 select-none group"
        >
          <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" /> {t('link_copied')}
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 stroke-[2.2] group-hover:rotate-12 transition-transform" /> {t('share_site')}
            </>
          )}
        </button>
      </div>

      {/* Social Links Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socials.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden p-3.5 rounded-2xl bg-[#141418] border border-[#25252d] hover:border-red-500/50 hover:bg-[#181820] transition-all flex flex-col justify-between gap-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${item.color} shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>

              <div>
                <p className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  {item.name}
                </p>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
