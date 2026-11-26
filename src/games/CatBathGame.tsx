import React, { useEffect, useRef, useState } from 'react';
import { Droplets, Sparkles } from 'lucide-react';
import { GrayCatCharacter } from '../components/CartoonArt';
import { soundEngine } from '../utils/audio';
import { pickVariedPhrase, PRAISE_SHORT } from '../utils/phrases';

interface CatBathGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

type SpotState = 'mud' | 'foam' | 'clean';

interface BathSpot {
  id: number;
  leftPct: number;
  topPct: number;
  sizeClass: string;
}

const BATH_SPOTS: readonly BathSpot[] = [
  { id: 0, leftPct: 36, topPct: 26, sizeClass: 'w-11 h-11 sm:w-16 sm:h-16' },
  { id: 1, leftPct: 62, topPct: 28, sizeClass: 'w-11 h-11 sm:w-16 sm:h-16' },
  { id: 2, leftPct: 48, topPct: 48, sizeClass: 'w-12 h-12 sm:w-16 sm:h-16' },
  { id: 3, leftPct: 33, topPct: 60, sizeClass: 'w-11 h-11 sm:w-16 sm:h-16' },
  { id: 4, leftPct: 65, topPct: 58, sizeClass: 'w-11 h-11 sm:w-16 sm:h-16' },
];

const TOTAL_STEPS = BATH_SPOTS.length * 2; // 5 soap + 5 rinse

export const CatBathGame: React.FC<CatBathGameProps> = ({ onProgress, onComplete }) => {
  const [spots, setSpots] = useState<SpotState[]>(() => BATH_SPOTS.map(() => 'mud'));
  const [spraying, setSpraying] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);
  const completedRef = useRef(false);

  const soapCount = spots.filter((s) => s === 'foam' || s === 'clean').length;
  const cleanCount = spots.filter((s) => s === 'clean').length;
  const stage: 'soap' | 'rinse' | 'done' =
    cleanCount >= BATH_SPOTS.length ? 'done' : soapCount >= BATH_SPOTS.length ? 'rinse' : 'soap';

  useEffect(() => {
    onProgress(soapCount + cleanCount, TOTAL_STEPS);
  }, [soapCount, cleanCount, onProgress]);

  const interactSpot = (id: number) => {
    if (completedRef.current) return;

    setSpots((prev) => {
      const current = prev[id];
      if (stage === 'soap' && current === 'mud') {
        const next = [...prev];
        next[id] = 'foam';
        const nowSoaped = next.filter((s) => s !== 'mud').length;
        soundEngine.playPop(0.9 + nowSoaped * 0.08);
        if (nowSoaped === BATH_SPOTS.length) {
          soundEngine.playSparkle();
          soundEngine.speak('Quanta espuma! Agora vamos enxaguar com aguinha!', 'cheerful');
        } else if (nowSoaped === 2) {
          soundEngine.speak('Que espuma gostosa!', 'cheerful');
        }
        return next;
      }

      if (stage === 'rinse' && current === 'foam') {
        const next = [...prev];
        next[id] = 'clean';
        const nowClean = next.filter((s) => s === 'clean').length;
        soundEngine.playSplash();
        setSpraying(true);
        window.setTimeout(() => setSpraying(false), 380);

        if (nowClean === BATH_SPOTS.length) {
          completedRef.current = true;
          soundEngine.playMeow();
          soundEngine.playSparkle();
          window.setTimeout(() => onComplete(), 750);
        } else if (nowClean % 2 === 0) {
          soundEngine.speak(pickVariedPhrase('bath-rinse', PRAISE_SHORT), 'cheerful');
        }
        return next;
      }

      return prev;
    });
  };

  const handleBigShowerRinse = () => {
    if (stage !== 'rinse' || completedRef.current) return;
    const nextFoamIdx = spots.findIndex((s) => s === 'foam');
    if (nextFoamIdx !== -1) {
      interactSpot(nextFoamIdx);
    }
  };

  const handleSwipeCheck = (clientX: number, clientY: number) => {
    if (!pointerActive) return;
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const spotAttr = el?.closest('[data-bath-spot]')?.getAttribute('data-bath-spot');
    if (spotAttr !== null && spotAttr !== undefined) {
      interactSpot(Number(spotAttr));
    }
  };

  return (
    <main
      onPointerDown={() => setPointerActive(true)}
      onPointerUp={() => setPointerActive(false)}
      onPointerCancel={() => setPointerActive(false)}
      onPointerMove={(e) => handleSwipeCheck(e.clientX, e.clientY)}
      className="relative flex-1 min-h-0 w-full max-w-full flex flex-col items-center justify-between overflow-hidden touch-none select-none px-3 pb-3 pt-1.5 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#CFFAFE] via-[#E0F2FE] to-[#BAE6FD]"
    >
      {/* Stage Instruction Banner */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border-[3px] border-[#4A2E1B] shadow-sm text-sm sm:text-xl font-bold text-[#3F2617] shrink-0">
        {stage === 'soap' && <span>Passe sabão nas manchinhas do gatinho!</span>}
        {stage === 'rinse' && <span>Toque na espuma ou no chuveiro para enxaguar!</span>}
        {stage === 'done' && <span>Miau! Gatinho limpinho e cheiroso!</span>}
      </div>

      {/* Cat Inside Cartoon Bathtub */}
      <section className="relative flex-1 min-h-0 w-full max-w-xl flex flex-col items-center justify-center">
        {/* Animated Shower Water Spray */}
        {spraying && (
          <div className="pointer-events-none absolute top-2 inset-x-0 flex justify-center gap-4 z-20 animate-bounce">
            <Droplets className="w-8 h-8 sm:w-10 sm:h-10 text-[#0EA5E9]" />
            <Droplets className="w-9 h-9 sm:w-12 sm:h-12 text-[#38BDF8]" />
            <Droplets className="w-8 h-8 sm:w-10 sm:h-10 text-[#0EA5E9]" />
          </div>
        )}

        {/* Cat + Interactive Spots Overlay */}
        <div className="relative w-[min(62vw,36dvh)] max-w-[270px] -mb-6 sm:-mb-9 z-10">
          <GrayCatCharacter
            mood={stage === 'done' ? 'purring' : 'happy'}
            className="w-full h-auto max-w-full"
          />

          {stage === 'done' && (
            <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-[#FACC15] animate-pulse" />
          )}

          {BATH_SPOTS.map((spot) => {
            const st = spots[spot.id];
            if (st === 'clean') return null;

            return (
              <button
                key={spot.id}
                type="button"
                data-bath-spot={spot.id}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setPointerActive(true);
                  interactSpot(spot.id);
                }}
                aria-label={st === 'mud' ? 'Limpar manchinha com sabão' : 'Enxaguar espuma'}
                style={{ left: `${spot.leftPct}%`, top: `${spot.topPct}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${spot.sizeClass} rounded-full cursor-pointer transition-transform active:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] ${
                  st === 'mud'
                    ? 'bg-[#92400E]/85 border-[3px] border-[#4A2E1B] shadow-md'
                    : 'bg-white/95 border-[3px] border-[#38BDF8] shadow-[0_0_12px_rgba(255,255,255,0.95)] animate-float-slow'
                }`}
              >
                {st === 'foam' && (
                  <span className="block w-full h-full rounded-full bg-gradient-to-br from-white via-[#E0F2FE] to-[#BAE6FD]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Pastel Bathtub Front */}
        <div className="relative z-20 w-[min(86vw,48dvh)] max-w-[390px] h-14 sm:h-24 rounded-b-[44px] rounded-t-[18px] bg-white border-[4px] sm:border-[5px] border-[#4A2E1B] shadow-lg flex items-center justify-around px-6">
          <span className="w-8 h-8 sm:w-12 sm:h-12 -mt-10 sm:-mt-14 rounded-full bg-white border-[3px] border-[#38BDF8]" />
          <span className="w-10 h-10 sm:w-14 sm:h-14 -mt-12 sm:-mt-16 rounded-full bg-white border-[3px] border-[#38BDF8]" />
          <span className="w-8 h-8 sm:w-12 sm:h-12 -mt-10 sm:-mt-14 rounded-full bg-white border-[3px] border-[#38BDF8]" />
        </div>
      </section>

      {/* Bottom Tool Action Button */}
      <section className="shrink-0 pt-2">
        {stage === 'soap' ? (
          <div className="flex items-center gap-2.5 px-5 py-2 sm:py-3 rounded-full bg-[#FBCFE8] border-[4px] border-[#4A2E1B] shadow-md text-sm sm:text-xl font-bold text-[#3F2617]">
            <span className="inline-block w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#F472B6] border-2 border-[#4A2E1B]" />
            <span>Esponja de Sabão ({soapCount}/{BATH_SPOTS.length})</span>
          </div>
        ) : stage === 'rinse' ? (
          <button
            type="button"
            onClick={handleBigShowerRinse}
            className="toddler-btn flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] border-[4px] border-[#4A2E1B] border-b-[7px] shadow-lg text-base sm:text-2xl font-bold text-white cursor-pointer"
          >
            <Droplets className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.6} />
            <span>Enxaguar com Chuveiro!</span>
          </button>
        ) : (
          <div className="px-5 py-2 rounded-full bg-[#FEF08A] border-[4px] border-[#4A2E1B] text-base sm:text-xl font-bold text-[#3F2617]">
            Brilhando de limpo!
          </div>
        )}
      </section>
    </main>
  );
};
