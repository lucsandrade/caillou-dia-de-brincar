import React, { useEffect, useRef, useState } from 'react';
import { Droplets } from 'lucide-react';
import { FlowerIllustration, WateringCanIcon } from '../components/ExtraCartoonArt';
import { soundEngine } from '../utils/audio';
import { pickVariedPhrase, PRAISE_SHORT } from '../utils/phrases';

interface GardenFlowersGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

interface FlowerPot {
  id: number;
  colorName: string;
  petalColor: string;
}

const FLOWER_POTS: readonly FlowerPot[] = [
  { id: 0, colorName: 'rosa', petalColor: '#F472B6' },
  { id: 1, colorName: 'amarela', petalColor: '#FACC15' },
  { id: 2, colorName: 'azul', petalColor: '#38BDF8' },
  { id: 3, colorName: 'roxa', petalColor: '#C084FC' },
];

export const GardenFlowersGame: React.FC<GardenFlowersGameProps> = ({ onProgress, onComplete }) => {
  const [bloomedIds, setBloomedIds] = useState<number[]>([]);
  const [wateringPotId, setWateringPotId] = useState<number | null>(null);
  const [draggingCan, setDraggingCan] = useState(false);
  const [canPos, setCanPos] = useState({ x: 0, y: 0 });
  const potRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const completedRef = useRef(false);

  useEffect(() => {
    onProgress(0, FLOWER_POTS.length);
  }, [onProgress]);

  const waterPot = (pot: FlowerPot) => {
    if (completedRef.current) return;
    if (bloomedIds.includes(pot.id)) {
      soundEngine.playSparkle();
      soundEngine.speak(`Que florzinha ${pot.colorName} feliz!`, 'cheerful');
      return;
    }

    setWateringPotId(pot.id);
    soundEngine.playSplash();

    const nextBloomed = [...bloomedIds, pot.id];
    setBloomedIds(nextBloomed);
    onProgress(nextBloomed.length, FLOWER_POTS.length);

    window.setTimeout(() => {
      soundEngine.playChime(nextBloomed.length);
      setWateringPotId((prev) => (prev === pot.id ? null : prev));
    }, 520);

    if (nextBloomed.length >= FLOWER_POTS.length) {
      completedRef.current = true;
      window.setTimeout(() => {
        soundEngine.playSparkle();
        onComplete();
      }, 950);
    } else {
      soundEngine.speak(
        `${pickVariedPhrase('garden-ok', PRAISE_SHORT)} A florzinha ${pot.colorName} abriu!`,
        'cheerful',
      );
    }
  };

  const checkCanHoverPot = (clientX: number, clientY: number) => {
    for (let i = 0; i < FLOWER_POTS.length; i++) {
      const el = potRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left - 18 &&
        clientX <= rect.right + 18 &&
        clientY >= rect.top - 32 &&
        clientY <= rect.bottom + 18
      ) {
        const pot = FLOWER_POTS[i];
        if (!bloomedIds.includes(pot.id)) {
          waterPot(pot);
        }
        break;
      }
    }
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col items-center justify-between overflow-hidden touch-none select-none px-3 pb-3 pt-1.5 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#BAE6FD] via-[#DCFCE7] to-[#86EFAC]">
      {/* Sun & Banner */}
      <div className="px-4 py-1.5 rounded-full bg-white/95 border-[3px] border-[#4A2E1B] shadow-sm text-sm sm:text-xl font-bold text-[#3F2617] shrink-0">
        Regue as florzinhas! ({bloomedIds.length}/{FLOWER_POTS.length})
      </div>

      {/* 4 Flower Pots Row / 2x2 Grid */}
      <section className="mobile-landscape-grid-4 flex-1 min-h-0 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 items-center py-2">
        {FLOWER_POTS.map((pot, idx) => {
          const isBloomed = bloomedIds.includes(pot.id);
          const isWatering = wateringPotId === pot.id;

          return (
            <button
              key={pot.id}
              ref={(el) => {
                potRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => waterPot(pot)}
              aria-label={isBloomed ? `Flor ${pot.colorName} aberta` : `Regar brotinho ${pot.colorName}`}
              className={`toddler-btn relative flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-[24px] sm:rounded-[30px] bg-white/85 hover:bg-white border-[4px] border-[#4A2E1B] border-b-[7px] shadow-md cursor-pointer h-full max-h-[260px] transition-transform ${
                isBloomed ? 'animate-pop-in ring-4 ring-[#FDE047]' : ''
              }`}
            >
              {isWatering && (
                <div className="pointer-events-none absolute top-2 inset-x-0 flex justify-center gap-2 z-20 animate-bounce">
                  <Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-[#0EA5E9]" />
                  <Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-[#38BDF8]" />
                </div>
              )}

              <div className="w-[min(28vw,18dvh)] max-w-[130px]">
                <FlowerIllustration
                  bloomed={isBloomed}
                  petalColor={pot.petalColor}
                  className="w-full h-auto max-w-full"
                />
              </div>
            </button>
          );
        })}
      </section>

      {/* Draggable / Tappable Watering Can */}
      <section className="shrink-0 flex items-center justify-center pt-1">
        <button
          type="button"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDraggingCan(true);
            setCanPos({ x: e.clientX, y: e.clientY });
            soundEngine.playPop(1.05);
          }}
          onPointerMove={(e) => {
            if (!draggingCan) return;
            setCanPos({ x: e.clientX, y: e.clientY });
            checkCanHoverPot(e.clientX, e.clientY);
          }}
          onPointerUp={() => {
            if (!draggingCan) return;
            setDraggingCan(false);
            // If user just tapped the watering can, water the next unbloomed sprout!
            const nextUnbloomed = FLOWER_POTS.find((p) => !bloomedIds.includes(p.id));
            if (nextUnbloomed) {
              waterPot(nextUnbloomed);
            }
          }}
          onPointerCancel={() => setDraggingCan(false)}
          aria-label="Arrastar ou tocar no regador para regar as flores"
          className={`toddler-btn flex items-center gap-2.5 px-5 sm:px-7 py-2 sm:py-3 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] border-[4px] border-[#4A2E1B] border-b-[7px] shadow-lg cursor-grab active:cursor-grabbing touch-none ${
            draggingCan ? 'opacity-40' : ''
          }`}
        >
          <div className="w-12 sm:w-16">
            <WateringCanIcon className="w-full h-auto max-w-full" />
          </div>
          <span className="text-base sm:text-2xl font-bold text-white drop-shadow-[0_2px_0_#4A2E1B]">
            Regador
          </span>
        </button>
      </section>

      {/* Floating Dragged Watering Can */}
      {draggingCan && (
        <div
          style={{ left: canPos.x, top: canPos.y }}
          className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 z-50 w-24 sm:w-32 -rotate-12 drop-shadow-xl"
        >
          <WateringCanIcon className="w-full h-auto max-w-full" />
        </div>
      )}
    </main>
  );
};
