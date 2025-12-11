'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  position: 'top' | 'bottom';
}

export default function AdBanner({ position }: AdBannerProps) {
  const adRef = useRef<HTMLInsElement>(null);

  useEffect(() => {
    if (adRef.current && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <div className={`${position === 'top' ? 'mb-6' : 'mt-6'} flex justify-center`}>
      <div className="bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 w-full max-w-4xl">
        <div className="text-center text-xs text-cyan-400/50 mb-2">Advertisement</div>

        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px' }}
             data-ad-client="ca-pub-5194295653001385"
             data-ad-slot="2321686202"
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />

        <div className="mt-2 text-center text-cyan-300/30 text-sm p-8 border-2 border-dashed border-cyan-500/20 rounded">
          <p className="font-mono">Google AdSense Display Ad</p>
          <p className="text-xs mt-1">Replace data-ad-client and data-ad-slot with your AdSense IDs</p>
        </div>
      </div>
    </div>
  );
}
