'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Gamepad2, Trophy, Coins, Heart, Volume2, VolumeX } from 'lucide-react';
import AdInterstitial from './AdInterstitial';
import { SoundSystem } from '@/lib/sound';
import { Particle, createExplosion, createCoinEffect } from '@/lib/particles';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  vx?: number;
  vy?: number;
}

interface Enemy extends GameObject {
  type: 'spike' | 'fireball' | 'ghost';
  color: string;
}

interface Coin extends GameObject {
  value: number;
  collected: boolean;
  rotation: number;
  pulseScale: number;
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundSystemRef = useRef<SoundSystem | null>(null);

  const gameStateRef = useRef({
    player: { x: 400, y: 450, width: 40, height: 40, vx: 0, vy: 0, jumping: false },
    enemies: [] as Enemy[],
    coins: [] as Coin[],
    particles: [] as Particle[],
    keys: { left: false, right: false, space: false },
    lastEnemySpawn: 0,
    lastCoinSpawn: 0,
    animationFrame: 0,
  });

  useEffect(() => {
    soundSystemRef.current = new SoundSystem();
    const saved = localStorage.getItem('skyRunnerHighScore');
    if (saved) setHighScore(parseInt(saved));

    return () => {
      soundSystemRef.current?.cleanup();
    };
  }, []);

  useEffect(() => {
    if (soundSystemRef.current) {
      soundSystemRef.current.setEnabled(soundEnabled);
    }
  }, [soundEnabled]);

  const spawnEnemy = useCallback(() => {
    const types: Enemy['type'][] = ['spike', 'fireball', 'ghost'];
    const type = types[Math.floor(Math.random() * types.length)];
    const colors = {
      spike: '#ef4444',
      fireball: '#f97316',
      ghost: '#a855f7',
    };

    const enemy: Enemy = {
      x: Math.random() * 750,
      y: 600,
      width: type === 'ghost' ? 35 : 30,
      height: type === 'ghost' ? 35 : 30,
      vy: -(2 + Math.random() * 3),
      type,
      color: colors[type],
    };

    gameStateRef.current.enemies.push(enemy);
  }, []);

  const spawnCoin = useCallback(() => {
    const coin: Coin = {
      x: 50 + Math.random() * 700,
      y: 100 + Math.random() * 300,
      width: 25,
      height: 25,
      value: 10,
      collected: false,
      rotation: 0,
      pulseScale: 1,
    };
    gameStateRef.current.coins.push(coin);
  }, []);

  const checkCollision = (obj1: GameObject, obj2: GameObject): boolean => {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  };

  const handlePlayerHit = useCallback(() => {
    const newLives = lives - 1;
    setLives(newLives);
    soundSystemRef.current?.play('hit');

    const player = gameStateRef.current.player;
    gameStateRef.current.particles.push(
      ...createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ef4444')
    );

    if (newLives <= 0) {
      setGameOver(true);
      setShowInterstitial(true);
      soundSystemRef.current?.play('gameOver');

      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('skyRunnerHighScore', score.toString());
      }
    }
  }, [lives, score, highScore]);

  const collectCoin = useCallback((coin: Coin) => {
    coin.collected = true;
    setScore((prev) => prev + coin.value);
    soundSystemRef.current?.play('coin');
    gameStateRef.current.particles.push(
      ...createCoinEffect(coin.x + coin.width / 2, coin.y + coin.height / 2)
    );
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameOver || !gameStarted) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    const { player, enemies, coins, keys, particles } = state;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(0.5, '#0c4a6e');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 50; i++) {
      const x = (i * 157) % canvas.width;
      const y = (i * 211 + state.animationFrame * 0.5) % canvas.height;
      ctx.fillStyle = `rgba(147, 197, 253, ${0.1 + Math.random() * 0.2})`;
      ctx.fillRect(x, y, 2, 2);
    }

    if (keys.left && player.x > 0) {
      player.vx = -6;
    } else if (keys.right && player.x < canvas.width - player.width) {
      player.vx = 6;
    } else {
      player.vx *= 0.8;
    }

    if (keys.space && !player.jumping) {
      player.vy = -15;
      player.jumping = true;
      soundSystemRef.current?.play('jump');
    }

    player.vy += 0.8;
    player.x += player.vx;
    player.y += player.vy;

    if (player.y >= 450) {
      player.y = 450;
      player.vy = 0;
      player.jumping = false;
    }

    ctx.save();
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(player.x + 5, player.y + 5, player.width - 10, player.height - 10);

    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(player.x + 12, player.y + 12, 8, 8);
    ctx.fillRect(player.x + player.width - 20, player.y + 12, 8, 8);
    ctx.restore();

    const now = state.animationFrame;
    if (now - state.lastEnemySpawn > 80) {
      spawnEnemy();
      state.lastEnemySpawn = now;
    }

    if (now - state.lastCoinSpawn > 120) {
      spawnCoin();
      state.lastCoinSpawn = now;
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.y += enemy.vy!;

      if (enemy.y < -50) {
        enemies.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.shadowColor = enemy.color;
      ctx.shadowBlur = 15;

      if (enemy.type === 'spike') {
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.width / 2, enemy.y);
        ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height);
        ctx.lineTo(enemy.x, enemy.y + enemy.height);
        ctx.closePath();
        ctx.fill();
      } else if (enemy.type === 'fireball') {
        const gradient = ctx.createRadialGradient(
          enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 0,
          enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2
        );
        gradient.addColorStop(0, '#fef3c7');
        gradient.addColorStop(0.5, enemy.color);
        gradient.addColorStop(1, '#7c2d12');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (enemy.type === 'ghost') {
        ctx.fillStyle = enemy.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 3, enemy.width / 3, Math.PI, 0);
        ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height);
        ctx.lineTo(enemy.x, enemy.y + enemy.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1f2937';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(enemy.x + 10, enemy.y + 12, 3, 0, Math.PI * 2);
        ctx.arc(enemy.x + 22, enemy.y + 12, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (checkCollision(player, enemy)) {
        enemies.splice(i, 1);
        handlePlayerHit();
      }
    }

    for (let i = coins.length - 1; i >= 0; i--) {
      const coin = coins[i];

      if (coin.collected) {
        coins.splice(i, 1);
        continue;
      }

      coin.rotation += 0.1;
      coin.pulseScale = 1 + Math.sin(state.animationFrame * 0.1) * 0.1;

      ctx.save();
      ctx.translate(coin.x + coin.width / 2, coin.y + coin.height / 2);
      ctx.rotate(coin.rotation);
      ctx.scale(coin.pulseScale, coin.pulseScale);

      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 20;

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coin.width / 2);
      gradient.addColorStop(0, '#fef3c7');
      gradient.addColorStop(0.5, '#fbbf24');
      gradient.addColorStop(1, '#b45309');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, coin.width / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 0);

      ctx.restore();

      if (checkCollision(player, coin)) {
        collectCoin(coin);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3;
      p.life--;
      p.alpha = p.life / 30;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.restore();

      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    state.animationFrame++;
  }, [gameOver, gameStarted, spawnEnemy, spawnCoin, handlePlayerHit, collectCoin]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(interval);
  }, [gameLoop, gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        state.keys.left = true;
        e.preventDefault();
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        state.keys.right = true;
        e.preventDefault();
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        state.keys.space = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        state.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        state.keys.right = false;
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        state.keys.space = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setShowInterstitial(false);
    gameStateRef.current.enemies = [];
    gameStateRef.current.coins = [];
    gameStateRef.current.particles = [];
    gameStateRef.current.player = { x: 400, y: 450, width: 40, height: 40, vx: 0, vy: 0, jumping: false };
    soundSystemRef.current?.play('start');
  };

  const restartGame = () => {
    startGame();
  };

  return (
    <div className="relative">
      <div className="mb-4 flex justify-between items-center bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-semibold text-purple-400">{highScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
              />
            ))}
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-cyan-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-cyan-500/50">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-auto bg-slate-900"
        />

        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="text-center">
              <Gamepad2 className="w-20 h-20 text-cyan-400 mx-auto mb-6 animate-bounce" />
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Play?</h2>
              <p className="text-cyan-200 mb-8 text-lg">
                Dodge enemies, collect coins, survive!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xl rounded-lg hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all shadow-lg shadow-cyan-500/50"
              >
                START GAME
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-red-500 mb-4 animate-pulse">GAME OVER</h2>
              <p className="text-3xl text-yellow-400 mb-2">Score: {score}</p>
              <p className="text-xl text-purple-400 mb-8">High Score: {highScore}</p>
              <button
                onClick={restartGame}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all shadow-lg shadow-green-500/50"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {showInterstitial && (
        <AdInterstitial onClose={() => setShowInterstitial(false)} />
      )}
    </div>
  );
}
