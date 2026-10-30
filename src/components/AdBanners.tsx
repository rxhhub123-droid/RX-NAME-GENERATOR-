import React, { useState, useEffect, useRef } from 'react';
import { Megaphone, X } from 'lucide-react';
import { useAdmin, CustomAdItem } from '../context/AdminContext';

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
    <div className={`my-3.5 flex flex-col items-center justify-center w-full overflow-hidden ${className}`}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-zinc-500 mb-1 tracking-wider select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
        <span>বিজ্ঞাপন • SPONSORED</span>
      </div>
      {activeAds.map(ad => (
        <div key={ad.id} className="w-full flex justify-center items-center overflow-hidden">
          <DynamicAdFrame ad={ad} />
        </div>
      ))}
    </div>
  );
};
