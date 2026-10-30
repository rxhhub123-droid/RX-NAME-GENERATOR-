import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin, NotificationItem } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';
import { resolveNoticeInLanguage, playNotificationChime, vibrateDevice } from '../utils/notificationTranslator';
import {
  Bell,
  X,
  CheckCheck,
  ExternalLink,
  Sparkles,
  Flame,
  Radio,
  Clock,
  ShieldAlert,
  Smartphone,
  Volume2
} from 'lucide-react';

const SEEN_STORAGE_KEY = 'rx_ff_seen_notifs_v3';

export const NotificationCenter: React.FC = () => {
  const { config } = useAdmin();
  const { currentLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [incomingNoticeAlert, setIncomingNoticeAlert] = useState<NotificationItem | null>(null);

  // Track seen notification IDs in localStorage
  const [seenIds, setSeenIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SEEN_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const notifications = config.notificationsList || [];

  // Calculate unseen count (only count notices whose IDs are NOT in seenIds)
  const unseenCount = notifications.filter(n => !seenIds.includes(n.id)).length;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    } else {
      setPushStatus('unsupported');
    }
  }, []);

  // Listen for real-time broadcasts from Admin (cross-tab storage and window events)
  useEffect(() => {
    const handleNewBroadcast = (event: Event) => {
      const customEvt = event as CustomEvent<NotificationItem>;
      if (customEvt.detail) {
        setIncomingNoticeAlert(customEvt.detail);
        playNotificationChime();
        vibrateDevice([200, 100, 200]);
        // Auto dismiss banner after 6 seconds
        setTimeout(() => {
          setIncomingNoticeAlert(prev => prev?.id === customEvt.detail?.id ? null : prev);
        }, 6000);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SEEN_STORAGE_KEY && e.newValue) {
        try {
          setSeenIds(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    window.addEventListener('rx_new_notification', handleNewBroadcast);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('rx_new_notification', handleNewBroadcast);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Mark all notifications as seen when user opens the notification panel
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIncomingNoticeAlert(null); // dismiss any floating banner
    if (notifications.length > 0) {
      const allIds = notifications.map(n => n.id);
      const newSeen = Array.from(new Set([...seenIds, ...allIds]));
      setSeenIds(newSeen);
      try {
        localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(newSeen));
      } catch (e) {}
    }
  }, [notifications, seenIds]);

  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setSeenIds(allIds);
    try {
      localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(allIds));
    } catch (e) {}
  };

  const handleRequestPush = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushStatus(perm);
        if (perm === 'granted') {
          playNotificationChime();
          vibrateDevice([150, 100, 200]);
          new Notification(config.brandName || '亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗', {
            body: 'মোবাইল নোটিফিকেশন সফলভাবে চালু হয়েছে! নতুন ভিআইপি নাম ও আপডেট এলে নোটিফিকেশন পাবেন।',
            icon: config.brandLogo || 'https://i.postimg.cc/6q0XrBKv/file-00000000228082118a51e116fc12be7f.png'
          });
        }
      } catch (e) {
        console.warn('Notification permission request error', e);
      }
    }
  };

  // Helper to format relative time
  const formatTime = (timestamp: number) => {
    const diff = Math.max(0, Date.now() - timestamp);
    const mins = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (mins < 3) return t('just_now') || 'এইমাত্র';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      {/* Top-Right Notification Bell Button */}
      <button
        onClick={handleOpen}
        className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#1c1c26] via-[#14141c] to-[#0d0d12] hover:from-[#252533] hover:to-[#171722] border border-white/10 hover:border-red-500/60 text-xs font-bold text-zinc-300 hover:text-white shadow-lg shadow-black/80 transition-all duration-200 group shrink-0 active:scale-95 hover:shadow-red-500/20"
        title="Notifications / নোটিফিকেশন"
      >
        <div className="relative">
          <Bell className="w-4 h-4 text-zinc-300 group-hover:text-red-400 group-hover:rotate-12 transition-all duration-200" />

          {/* Unread Indicator Pulse Dot (Only shown when unseenCount > 0) */}
          {unseenCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-sm shadow-red-500" />
            </span>
          )}
        </div>

        <span className="hidden sm:inline text-xs font-bold text-zinc-200 group-hover:text-white">
          {(t('notifications') || 'নোটিফিকেশন').split(' ')[0]}
        </span>

        {/* Unseen Count Badge (ONLY shown when there are unseen notices; once seen, disappears cleanly) */}
        {unseenCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-gradient-to-r from-[#ff5a6a] via-[#e11d2e] to-[#8f0d1c] text-white shadow-md shadow-red-600/50 animate-in zoom-in border border-red-400/30">
            {unseenCount}
          </span>
        )}
      </button>

      {/* Floating Real-time In-App Notification Toast Alert when admin broadcasts */}
      {incomingNoticeAlert && !isOpen && (
        <div 
          onClick={handleOpen}
          className="fixed top-4 right-4 z-50 max-w-sm w-full bg-[#161622]/95 border-2 border-red-500 rounded-2xl p-4 shadow-2xl shadow-red-600/40 backdrop-blur-xl cursor-pointer animate-in slide-in-from-top-4 duration-300 flex items-start gap-3 hover:scale-102 transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-red-600/30">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                🔔 নতুন নোটিশ
              </span>
              <span className="text-[10px] text-zinc-400">এখনই</span>
            </div>
            <h4 className="text-xs font-bold text-white mt-1 truncate">
              {resolveNoticeInLanguage(incomingNoticeAlert, currentLanguage.code).title}
            </h4>
            <p className="text-[11px] text-zinc-300 line-clamp-2 mt-0.5">
              {resolveNoticeInLanguage(incomingNoticeAlert, currentLanguage.code).message}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIncomingNoticeAlert(null);
            }}
            className="text-zinc-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Full Notification Center Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#121217] border border-red-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-red-600/30 space-y-4 overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Background ambient glow */}
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#25252d] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff5a6a] to-[#e11d2e] flex items-center justify-center text-white shadow-md shadow-red-600/40 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#121217]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    {t('notifications') || 'নোটিফিকেশন সেন্টার'}
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                      {currentLanguage.flag} {currentLanguage.name}
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {t('official_notice') || 'অফিসিয়াল নোটিশ'} • {config.brandName || '亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Audio sound tester button */}
                <button
                  onClick={() => {
                    playNotificationChime();
                    vibrateDevice([100, 50, 100]);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                  title="Play Notification Sound"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={handleMarkAllRead}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                  title={t('mark_all_read') || 'সব পড়া হয়েছে'}
                >
                  <CheckCheck className="w-4 h-4 text-emerald-400" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white text-zinc-400 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Push Notification Opt-in Prompt */}
            {pushStatus === 'default' && (
              <div className="shrink-0 p-3 rounded-2xl bg-gradient-to-r from-red-950/40 to-zinc-900 border border-red-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Smartphone className="w-5 h-5 text-red-400 shrink-0" />
                  <div className="text-xs text-zinc-200 truncate">
                    <span className="font-bold text-white block truncate">
                      {t('enable_push_alert') || 'ফোনে নোটিফিকেশন অ্যালার্ট চালু করুন'}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      সবার আগে নতুন স্টাইলিশ নাম ফোনে নোটিফিকেশন পান
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRequestPush}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff5a6a] to-[#e11d2e] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  অন করুন
                </button>
              </div>
            )}

            {/* Language info notice */}
            <div className="px-3 py-2 rounded-xl bg-[#161622] border border-[#262635] flex items-center justify-between text-xs text-zinc-400 shrink-0">
              <span className="flex items-center gap-1.5">
                🌐 নোটিশের ভাষা: <strong className="text-white">{currentLanguage.name} ({currentLanguage.englishName})</strong>
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                অটো ট্রান্সলেট সক্রিয়
              </span>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto space-y-3 pr-1 scrollbar-thin flex-1 min-h-[220px]">
              {notifications.map((item) => {
                // Dynamically resolve the notice content in the user's currently selected language!
                const { title, message } = resolveNoticeInLanguage(item, currentLanguage.code);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border transition-all bg-[#161620]/90 hover:bg-[#1a1a26] border-[#252533]"
                  >
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.type === 'vip' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400">
                            <Sparkles className="w-3 h-3" /> VIP
                          </span>
                        )}
                        {item.type === 'update' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 border border-blue-500/30 text-blue-400">
                            <Flame className="w-3 h-3" /> Update
                          </span>
                        )}
                        {item.type === 'reward' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                            <Radio className="w-3 h-3" /> Reward
                          </span>
                        )}
                        {item.type === 'announcement' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/15 border border-purple-500/30 text-purple-400">
                            <ShieldAlert className="w-3 h-3" /> Notice
                          </span>
                        )}

                        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTime(item.createdAt)}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5 text-zinc-500" /> Seen
                      </span>
                    </div>

                    {/* Notice Title translated in user's selected language */}
                    <h4 className="text-sm font-bold text-white mt-2 leading-snug">
                      {title}
                    </h4>

                    {/* Notice Body translated in user's selected language */}
                    <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                      {message}
                    </p>

                    {/* Optional Link button */}
                    {item.link && (
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-end">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                        >
                          {t('view_link') || 'লিংক ওপেন করুন'} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}

              {notifications.length === 0 && (
                <div className="py-12 text-center text-zinc-500 space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-zinc-600 opacity-60" />
                  <p className="text-xs font-semibold">
                    {t('no_notifications') || 'কোনো নতুন নোটিফিকেশন নেই'}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-[#25252d] text-center text-[11px] text-zinc-500 shrink-0">
              * নোটিশগুলো অ্যাডমিন প্যানেল থেকে সার্বক্ষণিক আপডেট করা হয়।
            </div>
          </div>
        </div>
      )}
    </>
  );
};
