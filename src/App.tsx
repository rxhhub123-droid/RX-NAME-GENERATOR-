/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AutoTab } from './components/AutoTab';
import { GeneratorTab } from './components/GeneratorTab';
import { FontTab } from './components/FontTab';
import { SymbolsTab } from './components/SymbolsTab';
import { SpaceTab } from './components/SpaceTab';
import { SocialBar } from './components/SocialBar';
import { BannerAdSlot } from './components/AdBanners';
import { AdminPanel } from './components/AdminPanel';
import { CopyAdModal } from './components/CopyAdModal';
import { Toast } from './components/Toast';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Zap, Shuffle, Grid, Star, Space } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'auto' | 'generator' | 'font' | 'symbols' | 'space'>('auto');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { config } = useAdmin();
  const { t } = useLanguage();

  // Dynamic Adsterra / Social Bar script synchronizer
  useEffect(() => {
    const scriptId = 'adsterra-social-bar';
    const existing = document.getElementById(scriptId);

    if (!config.socialAdEnabled || !config.socialAdScriptUrl || !config.socialAdScriptUrl.trim()) {
      if (existing) existing.remove();
      return;
    }

    let targetSrc = config.socialAdScriptUrl.trim();
    // If user pasted a full <script src="..."> tag, extract only the src
    const match = targetSrc.match(/src=["'](.*?)["']/i);
    if (match && match[1]) {
      targetSrc = match[1];
    }

    // If script is already attached with identical src, keep it
    if (existing) {
      if (existing.getAttribute('src') === targetSrc) return;
      existing.remove();
    }

    try {
      const script = document.createElement('script');
      script.id = scriptId;
      script.setAttribute('data-cfasync', 'false');
      script.src = targetSrc;
      script.async = true;
      document.body.appendChild(script);
    } catch (e) {
      console.warn('Ad script injection notice', e);
    }

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [config.socialAdEnabled, config.socialAdScriptUrl]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const tabs = [
    { id: 'auto', label: t('tabs_auto') || 'Auto', icon: Zap },
    { id: 'generator', label: t('tabs_generator') || 'Generator', icon: Shuffle },
    { id: 'font', label: t('tabs_font') || 'Font', icon: Grid },
    { id: 'symbols', label: t('tabs_icon') || 'Icon', icon: Star },
    { id: 'space', label: t('tabs_space') || 'Space', icon: Space },
  ] as const;

  return (
    <div className="min-h-screen pb-16 flex flex-col justify-between selection:bg-red-500/30 selection:text-white">
      <div className="max-w-[1000px] w-full mx-auto px-3.5 sm:px-4">
        {/* Top Header */}
        <Header onCopyNotice={showToast} />

        {/* Top Header Banner Ad Slot */}
        <BannerAdSlot type="header" />

        {/* Sticky Tab Navigation */}
        <nav className="sticky top-0 z-40 py-2.5 my-2 backdrop-blur-xl bg-[#09090b]/90 border-b border-[#25252d]/80 flex items-center gap-2 overflow-x-auto scrollbar-none px-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-200 active:scale-95 select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff3b53] via-[#e11d2e] to-[#8f0d1c] text-white shadow-lg shadow-red-600/40 border border-red-400/40'
                    : 'bg-[#13131a] text-zinc-400 border border-[#22222d] hover:text-white hover:border-red-500/40 hover:bg-[#1a1a24]'
                }`}
              >
                <Icon className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Main Content Area based on Tab */}
        <main className="mt-4">
          {activeTab === 'auto' && <AutoTab onCopyNotice={showToast} />}
          {activeTab === 'generator' && <GeneratorTab onCopyNotice={showToast} />}
          {activeTab === 'font' && <FontTab onCopyNotice={showToast} />}
          {activeTab === 'symbols' && <SymbolsTab onCopyNotice={showToast} />}
          {activeTab === 'space' && <SpaceTab onCopyNotice={showToast} />}
        </main>

        {/* Mid-feed Banner Ad Slot */}
        <BannerAdSlot type="infeed" />

        {/* Social Bar & Community Links at the bottom (as requested) */}
        <SocialBar onCopyNotice={showToast} />

        {/* Bottom Banner Ad Slot at the very bottom (as requested) */}
        <BannerAdSlot type="footer" />

        {/* Footer info */}
        <footer className="mt-8 pt-6 border-t border-[#1c1c22] text-center text-xs text-zinc-500 space-y-1">
          <p className="font-semibold text-zinc-400">
            {config.brandName} • Free Fire Styles & Gaming Nickname Tool
          </p>
          <p>
            Copy stylish gamer tags, unicode symbols, custom fonts, and invisible space for Garena Free Fire.
          </p>
        </footer>
      </div>

      {/* Secret Admin Panel Modal (Opened only by ROBIXHUNTER + 3x Enter in Generator) */}
      <AdminPanel onNotify={showToast} />

      {/* 5-Second Adsterra Direct Link Verification Modal */}
      <CopyAdModal onNotify={showToast} />

      {/* Instant Toast Notification */}
      <Toast message={toastMessage} submessage={config.brandName} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <MainApp />
      </AdminProvider>
    </LanguageProvider>
  );
}
