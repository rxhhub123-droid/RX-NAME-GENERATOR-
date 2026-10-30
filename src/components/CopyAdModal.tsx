import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, CheckCircle2, ShieldAlert, Sparkles, X, Lock, ExternalLink, ArrowRight } from 'lucide-react';

interface CopyAdModalProps {
  onNotify: (msg: string) => void;
}

export const CopyAdModal: React.FC<CopyAdModalProps> = ({ onNotify }) => {
  const {
    config,
    copyModalOpen,
    setCopyModalOpen,
    pendingTextToCopy,
    setPendingTextToCopy
  } = useAdmin();

  const { t } = useLanguage();

  const totalTime = config.countdownSeconds || 5;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isCompleted, setIsCompleted] = useState(false);

  // Keep references to prevent infinite re-render loops
  const onNotifyRef = useRef(onNotify);
  onNotifyRef.current = onNotify;

  const pendingTextRef = useRef(pendingTextToCopy);
  pendingTextRef.current = pendingTextToCopy;

  useEffect(() => {
    // Only run when modal opens
    if (!copyModalOpen) {
      setTimeLeft(totalTime);
      setIsCompleted(false);
      return;
    }

    setTimeLeft(totalTime);
    setIsCompleted(false);

    let current = totalTime;
    const timer = setInterval(() => {
      current -= 1;
      if (current <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        setIsCompleted(true);

        // Copy text to user's clipboard
        const text = pendingTextRef.current;
        if (text) {
          try {
            navigator.clipboard.writeText(text);
          } catch (err) {
            console.error('Clipboard write error', err);
          }
        }

        onNotifyRef.current(t('verification_success_copy'));

        // Automatically close modal after 1.2s and return user to home page!
        setTimeout(() => {
          setCopyModalOpen(false);
          setPendingTextToCopy(null);
        }, 1300);
      } else {
        setTimeLeft(current);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [copyModalOpen, totalTime, setCopyModalOpen, setPendingTextToCopy, t]);

  if (!copyModalOpen || !pendingTextToCopy) return null;

  const handleClose = () => {
    setCopyModalOpen(false);
    setPendingTextToCopy(null);
  };

  const progressPercent = Math.min(100, Math.round(((totalTime - timeLeft) / totalTime) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#121217] border border-red-500/40 rounded-3xl p-6 shadow-2xl shadow-red-600/30 text-center space-y-5 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-16 -top-16 w-40 h-40 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Cancel / Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-red-600 hover:text-white text-zinc-300 transition-all duration-150 active:scale-90 shadow-sm"
          title={t('cancel')}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Security Shield Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff5a6a] via-[#e11d2e] to-[#8f0d1c] flex items-center justify-center text-white shadow-lg shadow-red-600/40 relative">
          {isCompleted ? (
            <CheckCircle2 className="w-9 h-9 stroke-[2.5] text-white animate-in zoom-in" />
          ) : (
            <ShieldCheck className="w-9 h-9 stroke-[2.2] animate-pulse" />
          )}
          <div className="absolute -bottom-1 -right-1 bg-black/90 border border-red-500/40 rounded-full p-1 text-red-400">
            {isCompleted ? <Sparkles className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
          </div>
        </div>

        {/* Heading & Human Verification Badge */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/15 border border-red-500/30 text-red-400">
            <ShieldAlert className="w-3.5 h-3.5" /> {t('human_verification')}
          </div>

          <h3 className="text-lg font-extrabold text-white pt-1">
            {isCompleted ? t('verification_done') : t('verification_title')}
          </h3>

          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            {isCompleted ? (
              <span className="text-emerald-400 font-bold">
                {t('verification_done_desc')}
              </span>
            ) : (
              <span>
                {t('verification_desc')}
              </span>
            )}
          </p>
        </div>

        {/* Countdown Badge */}
        <div className="py-1">
          {!isCompleted ? (
            <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-[#1c1c24] border border-red-500/30 shadow-inner">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {t('verify_time')}
              </span>
              <span className="text-2xl font-black text-red-400 tabular-nums font-mono">
                00:0{timeLeft}s
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-sm font-bold shadow-md">
              <CheckCircle2 className="w-4 h-4" /> {t('verification_100_percent')}
            </div>
          )}
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-[#1c1c24] rounded-full h-2.5 overflow-hidden border border-[#2d2d38]">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-red-600 to-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Selected Name Display */}
        <div className="p-3 rounded-2xl bg-[#181822] border border-[#2a2a35] text-xs">
          <span className="text-zinc-500 block mb-1 font-semibold">{t('your_selected_name')}</span>
          <span className="font-glyph font-bold text-base text-white break-all">
            {pendingTextToCopy}
          </span>
        </div>

        {/* High-Earning Sponsor Ad Button (guaranteed click & impression tracking) */}
        {config.directLinkUrl && config.directLinkUrl.trim() && (
          <div className="pt-1">
            <a
              href={config.directLinkUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (!isCompleted) {
                  setTimeLeft(0);
                  setIsCompleted(true);
                  if (pendingTextRef.current) {
                    try {
                      navigator.clipboard.writeText(pendingTextRef.current);
                    } catch (e) {}
                  }
                  onNotifyRef.current(t('verification_success_copy'));
                  setTimeout(() => {
                    setCopyModalOpen(false);
                    setPendingTextToCopy(null);
                  }, 1200);
                }
              }}
              className="relative overflow-hidden w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-red-600 to-rose-600 hover:from-amber-400 hover:to-red-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 group border border-amber-300/40 select-none animate-pulse"
            >
              <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>👉 স্পন্সর লিংক ওপেন ও দ্রুত আনলক করুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-[10px] text-zinc-500 mt-1.5">
              * নতুন ট্যাবে বিজ্ঞাপন ওপেন না হলে উপরের বাটনে ক্লিক করে আনলক করুন।
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-1">
          {isCompleted ? (
            <div className="text-xs font-semibold text-emerald-400 animate-pulse">
              {t('returning_home')}
            </div>
          ) : (
            <p className="text-[11px] text-zinc-500">
              {t('wait_5s_notice')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
