import React, { useEffect, useRef, useState } from 'react';
import { BoyCharacter, CartoonStarIcon } from '../components/CartoonArt';
import { soundEngine } from '../utils/audio';

interface CountStarsGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

interface StarSlot {
  id: number;
  leftPct: number;
  topPct: number;
}

const STAR_SLOTS: readonly StarSlot[] = [
  { id: 0, leftPct: 18, topPct: 24 },
  { id: 1, leftPct: 45, topPct: 15 },
  { id: 2, leftPct: 76, topPct: 24 },
  { id: 3, leftPct: 30, topPct: 50 },
  { id: 4, leftPct: 68, topPct: 52 },
];

const NUMBER_SPEECHES: Record<number, string> = {
  1: 'Um! Uma estrelinha!',
  2: 'Dois! Duas estrelinhas!',
  3: 'Três! Três estrelinhas!',
  4: 'Quatro! Quatro estrelinhas!',
  5: 'Cinco! Cinco estrelinhas brilhantes!',
};

export const CountStarsGame: React.FC<CountStarsGameProps> = ({ onProgress, onComplete }) => {
  // Maps star slot id -> assigned count number (1..5)
  const [countedMap, setCountedMap] = useState<Record<number, number>>({});
  const [cheering, setCheering] = useState(false);
  const completedRef = useRef(false);

  const count = Object.keys(countedMap).length;

  useEffect(() => {
    onProgress(0, STAR_SLOTS.length);
  }, [onProgress]);

  const handleTapStar = (slotId: number) => {
    if (completedRef.current) return;
    if (countedMap[slotId] !== undefined) {
      soundEngine.playSparkle();
      soundEngine.speak(`Número ${countedMap[slotId]}!`, 'cheerful');
      return;
    }

    const nextNum = count + 1;
    setCountedMap((prev) => ({ ...prev, [slotId]: nextNum }));
    onProgress(nextNum, STAR_SLOTS.length);
    soundEngine.playChime(nextNum);
    setCheering(true);
    window.setTimeout(() => setCheering(false), 650);

    soundEngine.speak(NUMBER_SPEECHES[nextNum] || `${nextNum}!`, 'cheerful');

    if (nextNum >= STAR_SLOTS.length) {
      completedRef.current = true;
      window.setTimeout(() => {
        soundEngine.playSparkle();
        onComplete();
      }, 950);
    }
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col justify-between overflow-hidden touch-none select-none px-3 pb-3 pt-1.5 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#1E1B4B] via-[#312E81] to-[#4338CA]">
      {/* Tiny Twinkling Background Dust */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[
          { left: '10%', top: '12%' },
          { left: '34%', top: '34%' },
          { left: '62%', top: '14%' },
          { left: '88%', top: '36%' },
          { left: '16%', top: '66%' },
          { left: '84%', top: '64%' },
        ].map((dot, idx) => (
          <span
            key={idx}
            style={{ left: dot.left, top: dot.top }}
            className="absolute w-2 h-2 rounded-full bg-[#FEF08A]/70 animate-pulse"
          />
        ))}
      </div>

      {/* Smiling Crescent Moon */}
      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute right-4 sm:right-10 top-3 w-12 sm:w-20 h-auto opacity-95"
        aria-hidden="true"
      >
        <path
          d="M58 14C34 16 16 36 18 60C20 82 40 94 62 88C46 84 38 68 42 50C44 36 52 24 66 18C64 15 61 14 58 14Z"
          fill="#FDE047"
          stroke="#4A2E1B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Top Instruction */}
      <div className="relative z-10 flex justify-center shrink-0">
        <div className="px-4 py-1.5 rounded-full bg-white/95 border-[3px] border-[#4A2E1B] shadow-md text-sm sm:text-xl font-bold text-[#3F2617]">
          Toque nas estrelinhas para contar! ({count}/{STAR_SLOTS.length})
        </div>
      </div>

      {/* Interactive Starry Sky */}
      <section className="relative z-10 flex-1 min-h-0 w-full max-w-4xl mx-auto">
        {STAR_SLOTS.map((slot) => {
          const num = countedMap[slot.id];
          const isLit = num !== undefined;

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => handleTapStar(slot.id)}
              aria-label={isLit ? `Estrela número ${num}` : 'Tocar na estrelinha'}
              style={{ left: `${slot.leftPct}%`, top: `${slot.topPct}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-[min(22vw,16dvh)] max-w-[116px] aspect-square flex items-center justify-center cursor-pointer transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] rounded-full ${
                isLit ? 'scale-110 animate-pop-in' : 'hover:scale-110 animate-float-slow'
              }`}
            >
              <CartoonStarIcon
                filled={isLit}
                className={`w-full h-auto max-w-full ${
                  isLit
                    ? 'drop-shadow-[0_0_20px_rgba(250,204,21,0.95)]'
                    : 'opacity-85 drop-shadow-[0_0_10px_rgba(255,255,255,0.65)]'
                }`}
              />
              {isLit && (
                <span className="absolute inset-0 flex items-center justify-center text-2xl sm:text-4xl font-extrabold text-[#4A2E1B] pt-1">
                  {num}
                </span>
              )}
            </button>
          );
        })}
      </section>

      {/* Hill & Caillou Watching the Stars */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-[#15803D] border-t-4 border-[#4A2E1B]/40 rounded-t-[45%]"
        aria-hidden="true"
      />
      <div className="relative z-10 flex items-end justify-center gap-3 shrink-0">
        <div
          className={`w-[min(20vw,14dvh)] max-w-[106px] transition-transform ${
            cheering ? 'animate-happy-bounce' : ''
          }`}
        >
          <BoyCharacter mood={cheering ? 'cheering' : 'happy'} className="w-full h-auto max-w-full" />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 pb-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full border-[3px] border-[#4A2E1B] flex items-center justify-center text-base sm:text-2xl font-extrabold shadow-sm transition-all ${
                n <= count
                  ? 'bg-[#FACC15] text-[#4A2E1B] scale-105'
                  : 'bg-white/25 text-white/75'
              }`}
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
};
