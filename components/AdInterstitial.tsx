'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface AdInterstitialProps {
  onClose: () => void;
}

export default function AdInterstitial({ onClose }: AdInterstitialProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (adRef.current && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative bg-slate-800 rounded-xl p-8 max-w-2xl w-full mx-4 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20">
        <button
          onClick={onClose}
          disabled={countdown > 0}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
            countdown > 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
          title={countdown > 0 ? `Wait ${countdown}s` : 'Close'}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">
            {countdown > 0 ? `Please wait ${countdown}s...` : 'Continue Playing'}
          </h3>
          <p className="text-cyan-200 text-sm">Support us by viewing this ad</p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-cyan-500/20">
          <div className="text-center text-xs text-cyan-400/50 mb-2">Advertisement</div>

          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', minHeight: '250px' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="rectangle"
            data-full-width-responsive="true"
          />

          <div className="mt-4 text-center text-cyan-300/30 text-sm p-12 border-2 border-dashed border-cyan-500/20 rounded">
            <p className="font-mono text-lg mb-2">Google AdSense Interstitial Ad</p>
            <p className="text-xs">Replace data-ad-client and data-ad-slot with your AdSense IDs</p>
            <p className="text-xs mt-2">This overlay appears at game over</p>
          </div>
        </div>

        {countdown === 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all shadow-lg shadow-cyan-500/50"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
