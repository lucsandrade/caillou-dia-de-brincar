import React, { useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  BoyCharacter,
  SisterCharacter,
  GrayCatCharacter,
  CartoonHouseIcon,
  CartoonStarIcon,
} from './CartoonArt';

interface CelebrationOverlayProps {
  title?: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  shape: 'rect' | 'circle' | 'star';
}

const COLORS = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#FF70A6', '#FF924C'];

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  title = 'Parabéns!',
  onPlayAgain,
  onGoHome,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: ConfettiParticle[] = [];
    const spawnBurst = (count: number) => {
      for (let i = 0; i < count; i++) {
        const fromLeft = i % 2 === 0;
        particles.push({
          x: fromLeft ? canvas.width * 0.15 : canvas.width * 0.85,
          y: canvas.height * 0.55,
          vx: (fromLeft ? 1 : -1) * (3 + Math.random() * 8) + (Math.random() - 0.5) * 4,
          vy: -(8 + Math.random() * 11),
          size: 10 + Math.random() * 12,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.22,
          shape: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'circle' : 'rect',
        });
      }
    };

    // Initial double cannon burst + gentle falling confetti
    spawnBurst(70);
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height * 0.8,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 2 + Math.random() * 3.5,
        size: 10 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.16,
        shape: i % 2 === 0 ? 'star' : 'rect',
      });
    }

    const drawStar = (x: number, y: number, radius: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const innerAngle = outerAngle + Math.PI / 5;
        const ox = x + Math.cos(outerAngle) * radius;
        const oy = y + Math.sin(outerAngle) * radius;
        const ix = x + Math.cos(innerAngle) * (radius * 0.45);
        const iy = y + Math.sin(innerAngle) * (radius * 0.45);
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.fill();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gentle gravity
        p.vx *= 0.992;
        p.rotation += p.vRot;

        if (p.y > canvas.height + 30) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.vy = 2 + Math.random() * 3;
          p.vx = (Math.random() - 0.5) * 2;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(0, 0, p.size * 0.62);
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3A5F]/45 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Full-screen Confetti & Stars Canvas */}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 w-full h-full" />

      {/* Joyful Storybook Celebration Card */}
      <div className="animate-pop-in relative z-10 w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-[28px] sm:rounded-[36px] bg-[#FFFDF5] border-[5px] sm:border-[6px] border-[#4A2E1B] shadow-[0_14px_0_rgba(74,46,27,0.28)] px-4 py-5 sm:px-10 sm:py-8 text-center">
        {/* Three Big Golden Stars */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 -mt-2 sm:-mt-6 mb-1 sm:mb-2">
          <CartoonStarIcon filled className="w-10 sm:w-14 h-auto -rotate-12 animate-float-slow" />
          <CartoonStarIcon filled className="w-14 sm:w-20 h-auto -translate-y-1 animate-happy-bounce" />
          <CartoonStarIcon filled className="w-10 sm:w-14 h-auto rotate-12 animate-float-slow" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold text-[#E65100] tracking-tight mb-2 sm:mb-4">
          {title}
        </h2>

        {/* Cheering Characters */}
        <div className="flex items-end justify-center gap-2 sm:gap-4 my-1 sm:my-2">
          <BoyCharacter
            mood="cheering"
            className="w-[min(24vw,18dvh)] max-w-[136px] h-auto animate-happy-bounce"
          />
          <GrayCatCharacter
            mood="purring"
            className="w-[min(20vw,15dvh)] max-w-[112px] h-auto animate-float-slow"
          />
          <SisterCharacter
            mood="cheering"
            className="w-[min(24vw,18dvh)] max-w-[136px] h-auto animate-happy-bounce"
          />
        </div>

        {/* Big Chunky Action Buttons */}
        <div className="mt-4 sm:mt-6 flex flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onPlayAgain}
            className="toddler-btn flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 px-4 py-3 sm:px-8 sm:py-4 rounded-2xl sm:rounded-3xl bg-[#22C55E] hover:bg-[#16A34A] text-white border-4 border-[#4A2E1B] border-b-[7px] sm:border-b-[8px] text-lg sm:text-2xl font-bold cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]"
          >
            <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3] shrink-0" />
            <span>Jogar de Novo</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="toddler-btn flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 px-4 py-3 sm:px-8 sm:py-4 rounded-2xl sm:rounded-3xl bg-[#FF7A45] hover:bg-[#FF692E] text-white border-4 border-[#4A2E1B] border-b-[7px] sm:border-b-[8px] text-lg sm:text-2xl font-bold cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]"
          >
            <CartoonHouseIcon className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
            <span>Casa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
