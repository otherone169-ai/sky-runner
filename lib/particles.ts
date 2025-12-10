export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  alpha: number;
}

export function createExplosion(x: number, y: number, color: string): Particle[] {
  const particles: Particle[] = [];
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = 2 + Math.random() * 3;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 3,
      color,
      life: 30 + Math.random() * 20,
      alpha: 1,
    });
  }

  return particles;
}

export function createCoinEffect(x: number, y: number): Particle[] {
  const particles: Particle[] = [];
  const colors = ['#fef3c7', '#fbbf24', '#f59e0b', '#ffffff'];

  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12;
    const speed = 1 + Math.random() * 2;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 25 + Math.random() * 15,
      alpha: 1,
    });
  }

  return particles;
}

export function createTrail(x: number, y: number, color: string): Particle {
  return {
    x: x + (Math.random() - 0.5) * 10,
    y: y + (Math.random() - 0.5) * 10,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: 2 + Math.random() * 2,
    color,
    life: 20 + Math.random() * 10,
    alpha: 0.8,
  };
}
