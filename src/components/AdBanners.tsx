import React, { useState, useEffect, useRef } from 'react';
import { Megaphone, X } from 'lucide-react';
import { useAdmin, CustomAdItem, IN_FEED_AD_1, IN_FEED_AD_2 } from '../context/AdminContext';

interface BannerAdProps {
  type: 'header' | 'infeed' | 'footer';
  className?: string;
}

export const DynamicAdFrame: React.FC<{ ad: CustomAdItem }> = ({ ad }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Extract dimensions if specified in ad code (e.g. 728x90, 300x250, 320x50, 468x60)
  const widthMatch = ad.code.match(/['"]?width['"]?\s*:\s*['"]?(\d+)['"]?/i) || ad.code.match(/width=["']?(\d+)["']?/i);
  const heightMatch = ad.code.match(/['"]?height['"]?\s*:\s*['"]?(\d+)['"]?/i) || ad.code.match(/height=["']?(\d+)["']?/i);
  const adWidth = widthMatch ? parseInt(widthMatch[1], 10) : 728;
  const adHeight = heightMatch ? parseInt(heightMatch[1], 10) : 90;

  // Responsive scaling for mobile devices
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth - 32;
      if (parentWidth < adWidth) {
        setScale(Math.max(0.38, (parentWidth - 10) / adWidth));
      } else {
        setScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [adWidth]);

  const adHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base target="_blank">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      background: transparent;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
  </style>
</head>
<body>
  ${ad.code}
</body>
</html>`;

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Direct document.write write-in ensures same-origin domain attribution for Adsterra impression tracking
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(adHtml);
        doc.close();
      }
    } catch (e) {
      iframe.srcdoc = adHtml;
    }
  }, [adHtml]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col justify-center items-center overflow-hidden my-1 w-full"
      style={{ height: `${Math.ceil(adHeight * scale)}px` }}
    >
      <div
        style={{
          width: `${adWidth}px`,
          height: `${adHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="flex justify-center items-center shrink-0"
      >
        <iframe
          ref={iframeRef}
          title={ad.title || "Advertisement"}
          srcDoc={adHtml}
          width={adWidth}
          height={adHeight}
          scrolling="no"
          className="border-0 overflow-hidden"
        />
      </div>
    </div>
  );
};

export const BannerAdSlot: React.FC<BannerAdProps> = ({ type, className = '' }) => {
  const { config } = useAdmin();

  // Map type to placement
  const targetPlacement = type === 'header' ? 'top' : type === 'infeed' ? 'middle' : 'bottom';

  // Filter matching and enabled ads
  const activeAds = config.adsList.filter(
    ad => ad.placement === targetPlacement && ad.enabled
  );

  if (activeAds.length === 0) return null;

  return (
    <div className={`my-4 flex flex-col items-center justify-center w-full overflow-hidden ${className}`}>
      <div className="w-full max-w-[760px] p-2.5 sm:p-3 rounded-2xl bg-[#121218]/90 border border-[#252533] shadow-xl shadow-black/50 flex flex-col items-center justify-center transition-all hover:border-red-500/30">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-zinc-500 mb-1.5 tracking-wider select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm shadow-red-500 animate-pulse" />
          <span>বিজ্ঞাপন • SPONSORED</span>
        </div>
        {activeAds.map(ad => (
          <div key={ad.id} className="w-full flex justify-center items-center overflow-hidden">
            <DynamicAdFrame ad={ad} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const StickyBottomAd: React.FC = () => {
  const { config } = useAdmin();
  const [dismissed, setDismissed] = useState(false);

  // Find enabled sticky or banner ad
  const stickyAd = config.adsList.find(
    ad => (ad.placement === 'sticky' || ad.placement === 'bottom') && ad.enabled
  );

  if (!stickyAd || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090c]/95 backdrop-blur-xl border-t border-purple-500/30 p-1.5 shadow-[0_-10px_35px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center animate-in slide-in-from-bottom duration-300">
      <div className="relative w-full max-w-[760px] flex flex-col items-center">
        {/* Dismiss / Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-6 right-2 sm:right-0 px-2.5 py-0.5 rounded-t-lg bg-[#181822] border border-[#2d2d3d] border-b-0 text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 shadow-md hover:bg-red-600 transition-colors"
          title="বিজ্ঞাপন বন্ধ করুন"
        >
          <X className="w-3 h-3" />
          <span>Hide</span>
        </button>

        <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-zinc-400 mb-0.5 tracking-wider select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
          <span>স্পন্সরড ব্যানার • SPONSORED</span>
        </div>

        <DynamicAdFrame ad={stickyAd} />
      </div>
    </div>
  );
};

export const InFeedNameAd: React.FC<{ slotIndex: number }> = ({ slotIndex }) => {
  const { config } = useAdmin();

  if (!config.inFeedAdEnabled) return null;

  // Alternating between 2 banner ads:
  // Slot 1 (odd) -> AmanahAds (উপরে)
  // Slot 2 (even) -> Adsterra (নিচে)
  // ... cycles continuously across 100+ slots with identical 728x90 sizing
  const isAmanah = slotIndex % 2 === 1;
  const adCode = isAmanah
    ? (config.inFeedAdCode1 || IN_FEED_AD_2)
    : (config.inFeedAdCode2 || IN_FEED_AD_1);

  if (!adCode || !adCode.trim()) return null;

  const adItem: CustomAdItem = {
    id: `infeed-name-slot-${slotIndex}-${isAmanah ? 'amanah' : 'adsterra'}`,
    title: `In-Feed Banner Slot #${slotIndex} (${isAmanah ? 'AmanahAds 728x90' : 'Adsterra 728x90'})`,
    placement: 'middle',
    code: adCode,
    enabled: true,
    createdAt: Date.now()
  };

  return (
    <div className="col-span-full my-3 w-full flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-[760px] p-2.5 sm:p-3 rounded-2xl bg-[#121218]/90 border border-[#252533] shadow-xl shadow-black/50 flex flex-col items-center justify-center transition-all hover:border-red-500/30">
        <div className="flex items-center justify-between w-full px-2 mb-1.5 text-[10px] uppercase font-bold text-zinc-500 tracking-wider select-none">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isAmanah ? 'bg-emerald-400 shadow-emerald-400' : 'bg-red-500 shadow-red-500'} shadow-sm animate-pulse`} />
            <span>বিজ্ঞাপন • SPONSORED BANNER</span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1b1b26] text-zinc-400 font-mono border border-zinc-800">
            Slot #{slotIndex} • {isAmanah ? 'AmanahAds' : 'Adsterra'}
          </span>
        </div>
        <div className="w-full flex justify-center items-center overflow-hidden">
          <DynamicAdFrame ad={adItem} />
        </div>
      </div>
    </div>
  );
};


