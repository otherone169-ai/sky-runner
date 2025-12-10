'use client';

import { useEffect, useState } from 'react';
import Game from '@/components/Game';
import AdBanner from '@/components/AdBanner';
import { Music } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading Sky Runner...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-20 blur-3xl"></div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4 drop-shadow-lg animate-pulse relative z-10">
            SKY RUNNER
          </h1>
          <p className="text-xl text-cyan-200 font-semibold tracking-wide relative z-10 flex items-center justify-center gap-2">
            <Music className="w-5 h-5 animate-bounce" />
            Jump, Dodge, Collect!
            <Music className="w-5 h-5 animate-bounce" />
          </p>
        </header>

        <AdBanner position="top" />

        <div className="max-w-6xl mx-auto">
          <Game />
        </div>

        <AdBanner position="bottom" />

        <footer className="mt-8 text-center text-cyan-300 text-sm">
          <p className="mb-2">© 2024 Sky Runner. All rights reserved.</p>
          <p className="text-xs text-cyan-400">
            Use arrow keys or A/D to move, Space to jump. Avoid enemies, collect coins!
          </p>
        </footer>
      </div>
    </main>
  );
}
