import React, { useEffect, useRef, useState } from 'react';
import { BoyCharacter, CartoonStarIcon } from '../components/CartoonArt';
import { soundEngine } from '../utils/audio';
import { pickVariedPhrase, PRAISE_SHORT } from '../utils/phrases';

interface XylophoneGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

const KEYS = [
  { id: 0, note: 'Dó', freq: 523.25, bg: 'bg-[#EF4444]', heightPct: 'h-[98%]' },
  { id: 1, note: 'Ré', freq: 587.33, bg: 'bg-[#F97316]', heightPct: 'h-[91%]' },
  { id: 2, note: 'Mi', freq: 659.25, bg: 'bg-[#FACC15]', heightPct: 'h-[84%]' },
  { id: 3, note: 'Fá', freq: 698.46, bg: 'bg-[#22C55E]', heightPct: 'h-[77%]' },
  { id: 4, note: 'Sol', freq: 783.99, bg: 'bg-[#38BDF8]', heightPct: 'h-[70%]' },
  { id: 5, note: 'Lá', freq: 880.0, bg: 'bg-[#A855F7]', heightPct: 'h-[63%]' },
] as const;

// Cheerful 5-note melody sequence
const MELODY_STEPS = [0, 2, 4, 5, 4] as const;

export const XylophoneGame: React.FC<XylophoneGameProps> = ({ onProgress, onComplete }) => {
  const [step, setStep] = useState(0);
  const [pressedKey, setPressedKey] = useState<number | null>(null);
  const [dancing, setDancing] = useState(false);
  const finishedRef = useRef(false);

  const targetKeyIndex = step < MELODY_STEPS.length ? MELODY_STEPS[step] : -1;

  useEffect(() => {
    onProgress(0, MELODY_STEPS.length);
  }, [onProgress]);

  const handlePressKey = (keyIdx: number) => {
    const key = KEYS[keyIdx];
    soundEngine.playXylophoneNote(key.freq);
    setPressedKey(keyIdx);
    setDancing(true);
    window.setTimeout(() => setPressedKey((prev) => (prev === keyIdx ? null : prev)), 220);
    window.setTimeout(() => setDancing(false), 450);

    if (finishedRef.current) return;

    if (keyIdx === targetKeyIndex) {
      const nextStep = step + 1;
      setStep(nextStep);
      onProgress(nextStep, MELODY_STEPS.length);

      if (nextStep >= MELODY_STEPS.length) {
        finishedRef.current = true;
        window.setTimeout(() => {
          soundEngine.playSparkle();
          onComplete();
        }, 550);
      } else if (nextStep === 2 || nextStep === 4) {
        soundEngine.speak(pickVariedPhrase('xylo-ok', PRAISE_SHORT), 'cheerful');
      }
    }
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col justify-between overflow-hidden touch-none select-none px-3 pb-3 pt-1.5 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#FFEDD5] via-[#FEF3C7] to-[#FDE68A]">
      {/* Boy Cheering + Simple Visual Hint */}
      <section className="flex items-center justify-center gap-3 sm:gap-5 shrink-0">
        <div
          className={`mobile-landscape-hide w-[min(18vw,13dvh)] max-w-[104px] transition-transform ${
            dancing ? 'animate-happy-bounce' : ''
          }`}
        >
          <BoyCharacter mood={dancing ? 'cheering' : 'happy'} className="w-full h-auto max-w-full" />
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border-[3px] border-[#4A2E1B] shadow-sm text-sm sm:text-xl font-bold text-[#3F2617]">
          <CartoonStarIcon filled className="w-5 h-5 sm:w-7 sm:h-7 shrink-0" />
          <span>Toque na tecla com a estrelinha!</span>
        </div>
      </section>

      {/* Wooden Xylophone Frame + 6 Rainbow Bars */}
      <section className="relative flex-1 min-h-0 w-full max-w-4xl mx-auto flex items-center justify-center pt-2">
        {/* Wooden Rails Behind Keys */}
        <div className="pointer-events-none absolute inset-x-3 sm:inset-x-6 top-1/2 -translate-y-1/2 h-24 sm:h-36 flex flex-col justify-between">
          <div className="h-5 sm:h-7 rounded-full bg-[#B45309] border-[3.5px] border-[#4A2E1B] shadow-inner" />
          <div className="h-5 sm:h-7 rounded-full bg-[#B45309] border-[3.5px] border-[#4A2E1B] shadow-inner" />
        </div>

        {/* Keys Row */}
        <div className="relative z-10 w-full h-full max-h-[380px] grid grid-cols-6 gap-2 sm:gap-4 items-center px-1 sm:px-4">
          {KEYS.map((key, idx) => {
            const isTarget = idx === targetKeyIndex;
            const isPressed = pressedKey === idx;
            return (
              <button
                key={key.id}
                type="button"
                onPointerDown={() => handlePressKey(idx)}
                aria-label={`Nota ${key.note}`}
                className={`relative flex flex-col items-center justify-between py-3 sm:py-5 rounded-[20px] sm:rounded-[28px] ${key.bg} ${key.heightPct} border-[4px] sm:border-[5px] border-[#4A2E1B] border-b-[8px] sm:border-b-[11px] shadow-lg cursor-pointer transition-transform ${
                  isPressed ? 'scale-95 translate-y-1' : 'hover:scale-[1.02]'
                } ${isTarget ? 'ring-4 sm:ring-[6px] ring-white shadow-[0_0_24px_rgba(250,204,21,0.95)]' : ''}`}
              >
                {/* Top Peg */}
                <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-white/90 border-[2.5px] border-[#4A2E1B]" />

                {/* Bouncing Star Indicator on Target Bar */}
                {isTarget ? (
                  <div className="w-8 sm:w-14 animate-happy-bounce">
                    <CartoonStarIcon filled className="w-full h-auto max-w-full drop-shadow-md" />
                  </div>
                ) : (
                  <span className="text-base sm:text-3xl font-extrabold text-white drop-shadow-[0_2px_0_#4A2E1B]">
                    {key.note}
                  </span>
                )}

                {/* Bottom Peg */}
                <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-white/90 border-[2.5px] border-[#4A2E1B]" />
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};
