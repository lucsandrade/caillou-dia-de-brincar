import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BoyCharacter,
  CartoonStarIcon,
  FurnitureIllustration,
  GrayCatCharacter,
  HidingSpotId,
} from '../components/CartoonArt';
import { soundEngine } from '../utils/audio';
import {
  BUBBLE_POP_CHEERS,
  HIDE_FOUND_PHRASES,
  pickVariedPhrase,
} from '../utils/phrases';

interface HideSeekBubblesGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

interface SpotMeta {
  id: HidingSpotId;
  label: string;
  emptyPhrase: string;
  foundPhrase: string;
}

const SPOTS: SpotMeta[] = [
  {
    id: 'sofa',
    label: 'Sofá',
    emptyPhrase: 'Opa, não está no sofá! Onde será que ele foi?',
    foundPhrase: 'Achou o gatinho atrás do sofá! Miau!',
  },
  {
    id: 'cortina',
    label: 'Cortina',
    emptyPhrase: 'Ih, na cortina não tem gatinho! Vamos procurar!',
    foundPhrase: 'Achou o gatinho atrás da cortina! Miau!',
  },
  {
    id: 'poltrona',
    label: 'Poltrona',
    emptyPhrase: 'Opa, atrás da poltrona não está! Cadê ele?',
    foundPhrase: 'Achou o gatinho atrás da poltrona! Miau!',
  },
  {
    id: 'caixa',
    label: 'Caixa',
    emptyPhrase: 'Hum, na caixa também não está! Tenta outro lugar!',
    foundPhrase: 'Achou o gatinho atrás da caixa! Miau!',
  },
];

const BUBBLES_TARGET = 10;

interface Bubble {
  id: number;
  x: number;
  y: number;
  r: number;
  vy: number;
  wobblePhase: number;
  wobbleSpeed: number;
  hue: number;
}

interface PopBurst {
  x: number;
  y: number;
  r: number;
  alpha: number;
  hue: number;
  droplets: { angle: number; dist: number; size: number }[];
}

function pickRandomSpot(exclude?: HidingSpotId): HidingSpotId {
  const pool = SPOTS.filter((s) => s.id !== exclude);
  return pool[Math.floor(Math.random() * pool.length)].id;
}

export const HideSeekBubblesGame: React.FC<HideSeekBubblesGameProps> = ({
  onProgress,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'hide-seek' | 'bubbles'>('hide-seek');
  const [hideRound, setHideRound] = useState(1); // 2 quick rounds before bubbles
  const [catSpot, setCatSpot] = useState<HidingSpotId>(() => pickRandomSpot());
  const [checkedSpots, setCheckedSpots] = useState<Record<HidingSpotId, boolean>>({
    sofa: false,
    cortina: false,
    poltrona: false,
    caixa: false,
  });
  const [wigglingSpot, setWigglingSpot] = useState<HidingSpotId | null>(null);
  const [foundSpot, setFoundSpot] = useState<HidingSpotId | null>(null);
  const [showPeekHint, setShowPeekHint] = useState(false);

  // Bubble phase state
  const [poppedCount, setPoppedCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const burstsRef = useRef<PopBurst[]>([]);
  const poppedRef = useRef(0);
  const completedRef = useRef(false);

  // Update top-bar star progress (2 hide-and-seek rounds + 1 bubble stage = 3 big stars)
  useEffect(() => {
    if (phase === 'hide-seek') {
      onProgress(hideRound - 1 + (foundSpot ? 1 : 0), 3);
    } else {
      onProgress(poppedCount >= BUBBLES_TARGET ? 3 : 2, 3);
    }
  }, [phase, hideRound, foundSpot, poppedCount, onProgress]);

  // Welcome narration for Hide & Seek
  useEffect(() => {
    const timer = window.setTimeout(() => {
      soundEngine.speak('Cadê o gatinho cinza? Toque nos móveis para encontrar!', 'gentle');
      void soundEngine.prefetchPhrases(['Achou o gatinho! Miau!', 'Ploc! Isso mesmo!']);
    }, 350);
    return () => window.clearTimeout(timer);
  }, []);

  // Gentle visual peek hint after 3.5s so a 3-year-old always feels delighted
  useEffect(() => {
    if (phase !== 'hide-seek' || foundSpot) {
      setShowPeekHint(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setShowPeekHint(true);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [phase, hideRound, catSpot, foundSpot]);

  const handleSpotTap = (spot: SpotMeta) => {
    if (phase !== 'hide-seek' || foundSpot) return;

    if (spot.id === catSpot) {
      setFoundSpot(spot.id);
      soundEngine.playMeow();
      soundEngine.playChime(hideRound);
      soundEngine.playSparkle();
      soundEngine.speak(
        pickVariedPhrase(`hide-found-${spot.id}`, HIDE_FOUND_PHRASES[spot.id]),
        'celebration',
      );

      window.setTimeout(() => {
        if (hideRound < 2) {
          const nextSpot = pickRandomSpot(catSpot);
          setHideRound(2);
          setCatSpot(nextSpot);
          setFoundSpot(null);
          setCheckedSpots({ sofa: false, cortina: false, poltrona: false, caixa: false });
          soundEngine.speak('Hi-hi! O gatinho se escondeu de novo! Cadê ele?', 'cheerful');
        } else {
          setPhase('bubbles');
          setFoundSpot(null);
          soundEngine.playSparkle();
          soundEngine.speak('Ebaaa! Agora vamos estourar as bolhas de sabão!', 'celebration');
        }
      }, 1750);
    } else {
      setCheckedSpots((prev) => ({ ...prev, [spot.id]: true }));
      setWigglingSpot(spot.id);
      soundEngine.playBoing();
      soundEngine.speak(spot.emptyPhrase, 'gentle');
      window.setTimeout(() => setWigglingSpot(null), 550);
    }
  };

  // Bubble popping HTML5 Canvas 60fps loop
  const spawnBubble = useCallback((width: number, height: number, randomY = false): Bubble => {
    const minDim = Math.min(width, height);
    const baseR = Math.max(28, Math.min(46, minDim * 0.095));
    const r = baseR + Math.random() * (baseR * 0.48); // Proportional toddler-friendly bubbles
    return {
      id: Math.random(),
      x: r + Math.random() * Math.max(10, width - r * 2),
      y: randomY ? height * 0.2 + Math.random() * height * 0.7 : height + r + Math.random() * 60,
      r,
      vy: 0.85 + Math.random() * 1.05,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.025 + Math.random() * 0.025,
      hue: [195, 290, 330, 48, 165][Math.floor(Math.random() * 5)],
    };
  }, []);

  useEffect(() => {
    if (phase !== 'bubbles') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    bubblesRef.current = Array.from({ length: 11 }, () =>
      spawnBubble(canvas.width, canvas.height, true),
    );
    burstsRef.current = [];
    poppedRef.current = 0;
    setPoppedCount(0);

    let animId = 0;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Keep plenty of big bubbles floating
      if (bubblesRef.current.length < 10 && !completedRef.current) {
        bubblesRef.current.push(spawnBubble(canvas.width, canvas.height, false));
      }

      // Draw & update bubbles
      for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
        const b = bubblesRef.current[i];
        b.y -= b.vy;
        b.wobblePhase += b.wobbleSpeed;
        const drawX = b.x + Math.sin(b.wobblePhase) * 14;

        if (b.y + b.r < -20) {
          bubblesRef.current[i] = spawnBubble(canvas.width, canvas.height, false);
          continue;
        }

        // Translucent iridescent bubble body
        const grad = ctx.createRadialGradient(
          drawX - b.r * 0.3,
          b.y - b.r * 0.3,
          b.r * 0.1,
          drawX,
          b.y,
          b.r,
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
        grad.addColorStop(0.45, `hsla(${b.hue}, 90%, 78%, 0.42)`);
        grad.addColorStop(0.85, `hsla(${(b.hue + 50) % 360}, 90%, 70%, 0.58)`);
        grad.addColorStop(1, `hsla(${b.hue}, 95%, 60%, 0.85)`);

        ctx.beginPath();
        ctx.arc(drawX, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.stroke();

        // Glossy cartoon highlight crescent
        ctx.beginPath();
        ctx.arc(drawX - b.r * 0.32, b.y - b.r * 0.32, b.r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(drawX - b.r * 0.12, b.y - b.r * 0.5, b.r * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      }

      // Draw pop bursts
      for (let i = burstsRef.current.length - 1; i >= 0; i--) {
        const burst = burstsRef.current[i];
        burst.alpha -= 0.045;
        burst.r += 2.6;
        if (burst.alpha <= 0) {
          burstsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = burst.alpha;
        ctx.strokeStyle = `hsla(${burst.hue}, 95%, 65%, 1)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, burst.r, 0, Math.PI * 2);
        ctx.stroke();

        burst.droplets.forEach((d) => {
          const dx = burst.x + Math.cos(d.angle) * (burst.r * 0.9 + d.dist);
          const dy = burst.y + Math.sin(d.angle) * (burst.r * 0.9 + d.dist);
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(dx, dy, d.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [phase, spawnBubble]);

  const tryPopAt = (clientX: number, clientY: number) => {
    if (phase !== 'bubbles' || completedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
      const b = bubblesRef.current[i];
      const drawX = b.x + Math.sin(b.wobblePhase) * 14;
      const dist = Math.hypot(px - drawX, py - b.y);
      if (dist <= b.r + 16) {
        bubblesRef.current.splice(i, 1);
        burstsRef.current.push({
          x: drawX,
          y: b.y,
          r: b.r * 0.7,
          alpha: 1,
          hue: b.hue,
          droplets: Array.from({ length: 7 }, (_, idx) => ({
            angle: (idx / 7) * Math.PI * 2 + Math.random() * 0.3,
            dist: 6 + Math.random() * 14,
            size: 4 + Math.random() * 4,
          })),
        });

        poppedRef.current += 1;
        const nextPopped = poppedRef.current;
        setPoppedCount(nextPopped);
        soundEngine.playPop(0.95 + (nextPopped % 5) * 0.14);

        if (nextPopped === 3 || nextPopped === 6 || nextPopped === 8) {
          soundEngine.speak(pickVariedPhrase('bubble-cheer', BUBBLE_POP_CHEERS), 'cheerful');
        }

        if (nextPopped >= BUBBLES_TARGET && !completedRef.current) {
          completedRef.current = true;
          soundEngine.playSparkle();
          window.setTimeout(() => {
            onComplete();
          }, 700);
        }
        break;
      }
    }
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col justify-between overflow-hidden touch-none bg-gradient-to-b from-[#E0F4FF] via-[#FFF9EC] to-[#F7D7A8]">
      {/* Cozy Living Room Floor & Rug */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-[#E9B87D] border-t-4 border-[#4A2E1B]/25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-3 w-[84%] max-w-3xl h-20 sm:h-28 rounded-full bg-[#FDA4AF]/55 border-4 border-[#FB7185]/45"
        aria-hidden="true"
      />

      {phase === 'hide-seek' ? (
        <section className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center px-3 pb-3 pt-2 sm:px-8 sm:pb-6 max-w-5xl w-full mx-auto">
          {/* 4 Big Tappable Living Room Hiding Spots — 2x2 portrait/desktop, 4x1 short landscape */}
          <div className="mobile-landscape-grid-4 grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-4xl flex-1 min-h-0 max-h-[68dvh] items-stretch">
            {SPOTS.map((spot) => {
              const isFoundHere = foundSpot === spot.id;
              const isCheckedEmpty = checkedSpots[spot.id];
              const isPeekingHere = showPeekHint && catSpot === spot.id && !foundSpot;

              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handleSpotTap(spot)}
                  aria-label={`Olhar atrás de ${spot.label}`}
                  className={`toddler-btn relative flex flex-col items-center justify-between p-2.5 sm:p-5 rounded-[24px] sm:rounded-[34px] border-[4px] sm:border-[5px] border-[#4A2E1B] border-b-[7px] sm:border-b-[9px] cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] min-h-0 overflow-visible ${
                    isFoundHere
                      ? 'bg-[#FEF08A]'
                      : isCheckedEmpty
                        ? 'bg-[#FFFDF5]/70 opacity-75'
                        : 'bg-[#FFFDF5] hover:bg-[#FFF8DC]'
                  } ${wigglingSpot === spot.id ? 'animate-gentle-wiggle' : ''}`}
                >
                  {/* Cute Peeking Cat Hint */}
                  {isPeekingHere && (
                    <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 w-16 sm:w-24 animate-float-slow pointer-events-none z-0">
                      <GrayCatCharacter mood="peeking" className="w-full h-auto max-w-full" />
                    </div>
                  )}

                  {/* Found Cat popping out joyfully! */}
                  {isFoundHere && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#FEF08A]/90 rounded-[20px] sm:rounded-[28px] p-2 animate-pop-in">
                      <div className="w-[min(28vw,20dvh)] max-w-[144px] flex items-center justify-center">
                        <GrayCatCharacter mood="purring" className="w-full h-auto max-w-full animate-happy-bounce" />
                      </div>
                      <CartoonStarIcon filled className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 sm:w-10 h-auto" />
                    </div>
                  )}

                  <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center p-1">
                    <FurnitureIllustration
                      type={spot.id}
                      className="w-full h-auto max-w-[140px] sm:max-w-[180px] max-h-full pointer-events-none"
                    />
                  </div>
                  <span className="relative z-10 text-base sm:text-2xl font-bold text-[#3F2617] shrink-0">
                    {spot.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        /* PHASE 2: SOAP BUBBLE POPPING PLAYGROUND */
        <section className="relative z-10 flex-1 min-h-0 w-full h-full overflow-hidden">
          {/* Bubble Counter Bar */}
          <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            <span className="text-lg sm:text-2xl font-bold text-[#0369A1] drop-shadow-[0_2px_0_rgba(255,255,255,0.95)] tabular-nums whitespace-nowrap">
              Bolhas: {Math.min(poppedCount, BUBBLES_TARGET)} / {BUBBLES_TARGET}
            </span>
          </div>

          {/* Cheering Characters watching bubbles from bottom corners */}
          <div className="pointer-events-none absolute bottom-1 left-2 sm:left-8 z-10 w-[min(22vw,16dvh)] max-w-[128px]">
            <BoyCharacter mood="cheering" className="w-full h-auto max-w-full" />
          </div>
          <div className="pointer-events-none absolute bottom-1 right-2 sm:right-8 z-10 w-[min(20vw,15dvh)] max-w-[120px]">
            <GrayCatCharacter mood="purring" className="w-full h-auto max-w-full animate-float-slow" />
          </div>

          {/* Interactive 60fps Bubble Canvas (Tap or Swipe to pop!) */}
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => tryPopAt(e.clientX, e.clientY)}
            onPointerMove={(e) => {
              if (e.buttons > 0 || e.pointerType === 'touch') {
                tryPopAt(e.clientX, e.clientY);
              }
            }}
            className="touch-none relative z-20 w-full h-full block cursor-pointer"
            aria-label="Toque nas bolhas de sabão para estourar"
          />
        </section>
      )}
    </main>
  );
};
