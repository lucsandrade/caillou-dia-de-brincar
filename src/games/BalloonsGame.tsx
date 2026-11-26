import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../utils/audio';
import { pickVariedPhrase, PRAISE_SHORT } from '../utils/phrases';

interface BalloonsGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

const TARGET_POPS = 10;

const BALLOON_PALETTE = [
  { name: 'vermelho', fill: '#EF4444', highlight: '#FCA5A5' },
  { name: 'amarelo', fill: '#FACC15', highlight: '#FEF08A' },
  { name: 'azul', fill: '#38BDF8', highlight: '#BAE6FD' },
  { name: 'verde', fill: '#22C55E', highlight: '#86EFAC' },
  { name: 'rosa', fill: '#F472B6', highlight: '#FBCFE8' },
  { name: 'roxo', fill: '#A855F7', highlight: '#E9D5FF' },
] as const;

interface Balloon {
  id: number;
  x: number;
  y: number;
  rx: number;
  ry: number;
  vy: number;
  swayAmp: number;
  swayPhase: number;
  color: (typeof BALLOON_PALETTE)[number];
}

interface PopParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

interface BurstRing {
  x: number;
  y: number;
  r: number;
  color: string;
  life: number;
}

export const BalloonsGame: React.FC<BalloonsGameProps> = ({ onProgress, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [popped, setPopped] = useState(0);
  const poppedRef = useRef(0);
  const completedRef = useRef(false);
  const pointerDownRef = useRef(false);
  const nextIdRef = useRef(1);

  const balloonsRef = useRef<Balloon[]>([]);
  const particlesRef = useRef<PopParticle[]>([]);
  const ringsRef = useRef<BurstRing[]>([]);
  const sizeRef = useRef({ w: 800, h: 520 });

  useEffect(() => {
    onProgress(0, TARGET_POPS);
  }, [onProgress]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spawnBalloon = (fromBottom: boolean): Balloon => {
      const { w, h } = sizeRef.current;
      const baseRadius = Math.max(32, Math.min(54, Math.min(w, h) * 0.11));
      const rx = baseRadius * (0.9 + Math.random() * 0.22);
      const ry = rx * 1.22;
      const color = BALLOON_PALETTE[Math.floor(Math.random() * BALLOON_PALETTE.length)];
      return {
        id: nextIdRef.current++,
        x: rx + 14 + Math.random() * Math.max(40, w - (rx + 14) * 2),
        y: fromBottom ? h + ry + Math.random() * 90 : ry + 20 + Math.random() * Math.max(60, h - ry * 2),
        rx,
        ry,
        vy: 38 + Math.random() * 34,
        swayAmp: 12 + Math.random() * 14,
        swayPhase: Math.random() * Math.PI * 2,
        color,
      };
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { w: Math.max(260, rect.width), h: Math.max(220, rect.height) };
      canvas.width = Math.round(sizeRef.current.w * dpr);
      canvas.height = Math.round(sizeRef.current.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Seed initial balloons nicely across the sky
    balloonsRef.current = Array.from({ length: 7 }, () => spawnBalloon(false));

    let rafId = 0;
    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const { w, h } = sizeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Keep 7 colorful balloons active until complete
      if (!completedRef.current && balloonsRef.current.length < 7) {
        balloonsRef.current.push(spawnBalloon(true));
      }

      // Update & draw balloons
      const nextBalloons: Balloon[] = [];
      for (const b of balloonsRef.current) {
        b.y -= b.vy * dt;
        b.swayPhase += dt * 1.7;
        const drawX = Math.max(b.rx + 8, Math.min(w - b.rx - 8, b.x + Math.sin(b.swayPhase) * b.swayAmp));

        if (b.y + b.ry + 65 < 0) {
          if (!completedRef.current) {
            nextBalloons.push(spawnBalloon(true));
          }
          continue;
        }
        nextBalloons.push(b);

        // Wavy string
        ctx.save();
        ctx.strokeStyle = '#4A2E1B';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(drawX, b.y + b.ry + 5);
        ctx.quadraticCurveTo(
          drawX + Math.sin(b.swayPhase * 1.4) * 10,
          b.y + b.ry + 28,
          drawX - Math.sin(b.swayPhase) * 6,
          b.y + b.ry + 52,
        );
        ctx.stroke();

        // Balloon knot
        ctx.fillStyle = b.color.fill;
        ctx.strokeStyle = '#4A2E1B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(drawX - 6, b.y + b.ry + 6);
        ctx.lineTo(drawX + 6, b.y + b.ry + 6);
        ctx.lineTo(drawX, b.y + b.ry - 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Balloon oval body
        ctx.beginPath();
        ctx.ellipse(drawX, b.y, b.rx, b.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = b.color.fill;
        ctx.fill();
        ctx.lineWidth = 3.8;
        ctx.strokeStyle = '#4A2E1B';
        ctx.stroke();

        // Glossy specular shine
        ctx.beginPath();
        ctx.ellipse(drawX - b.rx * 0.34, b.y - b.ry * 0.3, b.rx * 0.16, b.ry * 0.28, -0.32, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.68)';
        ctx.fill();

        // Cute smiling face on balloon
        ctx.fillStyle = '#4A2E1B';
        ctx.beginPath();
        ctx.arc(drawX - b.rx * 0.22, b.y - b.ry * 0.04, 3.2, 0, Math.PI * 2);
        ctx.arc(drawX + b.rx * 0.22, b.y - b.ry * 0.04, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(drawX, b.y + b.ry * 0.08, b.rx * 0.18, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.lineWidth = 2.6;
        ctx.strokeStyle = '#4A2E1B';
        ctx.stroke();
        ctx.restore();
      }
      balloonsRef.current = nextBalloons;

      // Update & draw pop rings
      const nextRings: BurstRing[] = [];
      for (const ring of ringsRef.current) {
        ring.life -= dt * 2.8;
        ring.r += dt * 150;
        if (ring.life > 0) {
          nextRings.push(ring);
          ctx.save();
          ctx.globalAlpha = Math.max(0, ring.life);
          ctx.strokeStyle = ring.color;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
      ringsRef.current = nextRings;

      // Update & draw confetti particles
      const nextParticles: PopParticle[] = [];
      for (const p of particlesRef.current) {
        p.life -= dt * 1.8;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 220 * dt;
        if (p.life > 0) {
          nextParticles.push(p);
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      particlesRef.current = nextParticles;

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const tryPopAt = (clientX: number, clientY: number) => {
    if (completedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check top-most balloon first with generous toddler hitbox
    for (let i = balloonsRef.current.length - 1; i >= 0; i--) {
      const b = balloonsRef.current[i];
      const drawX = Math.max(
        b.rx + 8,
        Math.min(sizeRef.current.w - b.rx - 8, b.x + Math.sin(b.swayPhase) * b.swayAmp),
      );
      const dx = (x - drawX) / (b.rx * 1.28);
      const dy = (y - b.y) / (b.ry * 1.28);
      if (dx * dx + dy * dy <= 1) {
        balloonsRef.current.splice(i, 1);

        // Spawn burst visuals
        ringsRef.current.push({ x: drawX, y: b.y, r: b.rx * 0.5, color: b.color.fill, life: 1 });
        for (let k = 0; k < 14; k++) {
          const angle = (Math.PI * 2 * k) / 14 + Math.random() * 0.25;
          const speed = 90 + Math.random() * 140;
          particlesRef.current.push({
            x: drawX,
            y: b.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 40,
            size: 5 + Math.random() * 5,
            color: k % 2 === 0 ? b.color.fill : '#FDE047',
            life: 1,
          });
        }

        const nextCount = poppedRef.current + 1;
        poppedRef.current = nextCount;
        setPopped(nextCount);
        onProgress(nextCount, TARGET_POPS);
        soundEngine.playPop(0.85 + (nextCount % 5) * 0.14);

        if (nextCount >= TARGET_POPS) {
          completedRef.current = true;
          soundEngine.playSparkle();
          window.setTimeout(() => onComplete(), 500);
        } else if (nextCount % 2 === 1) {
          soundEngine.speak(`Balão ${b.color.name}!`, 'cheerful');
        } else {
          soundEngine.speak(pickVariedPhrase('balloon-cheer', PRAISE_SHORT), 'cheerful');
        }
        break;
      }
    }
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col overflow-hidden touch-none select-none bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#E0F2FE]">
      {/* Soft Clouds & Hills Backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-between px-6 opacity-80">
        <div className="w-24 sm:w-36 h-10 sm:h-14 rounded-full bg-white/85 blur-[1px]" />
        <div className="w-28 sm:w-44 h-12 sm:h-16 rounded-full bg-white/80 blur-[1px]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 sm:h-20 bg-[#86EFAC] rounded-t-[50%] border-t-4 border-[#4A2E1B]/20" />

      {/* Gentle Banner */}
      <div className="pointer-events-none relative z-10 flex justify-center pt-2 px-3 shrink-0">
        <div className="px-4 py-1.5 rounded-full bg-white/90 border-[3px] border-[#4A2E1B] shadow-sm text-sm sm:text-xl font-bold text-[#3F2617]">
          Estoure os balões! ({popped}/{TARGET_POPS})
        </div>
      </div>

      {/* Interactive Balloon Sky Canvas */}
      <div ref={containerRef} className="relative z-10 flex-1 min-h-0 w-full">
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            pointerDownRef.current = true;
            tryPopAt(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (pointerDownRef.current) {
              tryPopAt(e.clientX, e.clientY);
            }
          }}
          onPointerUp={() => {
            pointerDownRef.current = false;
          }}
          onPointerCancel={() => {
            pointerDownRef.current = false;
          }}
          className="block w-full h-full cursor-pointer touch-none"
          aria-label="Toque nos balões coloridos para estourar"
        />
      </div>
    </main>
  );
};
