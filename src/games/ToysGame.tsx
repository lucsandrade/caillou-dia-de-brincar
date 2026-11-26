import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BoyCharacter, CartoonStarIcon, ToyId, ToyIllustration } from '../components/CartoonArt';
import { soundEngine } from '../utils/audio';
import {
  GENTLE_RETRY,
  pickVariedPhrase,
  TOY_PICK_PHRASES,
  TOY_SUCCESS_PHRASES,
} from '../utils/phrases';

interface ToysGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

interface ToyMeta {
  id: ToyId;
  label: string;
}

const TOYS: ToyMeta[] = [
  { id: 'dinossauro', label: 'Dinossauro' },
  { id: 'foguete', label: 'Foguete' },
  { id: 'carrinho', label: 'Carrinho' },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const ToysGame: React.FC<ToysGameProps> = ({ onProgress, onComplete }) => {
  const shelfOrder = useMemo(() => shuffle(TOYS), []);
  const trayOrder = useMemo(() => shuffle(TOYS), []);

  const [placed, setPlaced] = useState<Record<ToyId, boolean>>({
    dinossauro: false,
    foguete: false,
    carrinho: false,
  });
  const [selectedToy, setSelectedToy] = useState<ToyId | null>(null);
  const [dragging, setDragging] = useState<{
    id: ToyId;
    pointerId: number;
    startX: number;
    startY: number;
    dx: number;
    dy: number;
    nearMatch: boolean;
  } | null>(null);
  const [boyCheer, setBoyCheer] = useState(false);
  const [wiggleId, setWiggleId] = useState<ToyId | null>(null);

  const slotRefs = useRef<Record<ToyId, HTMLButtonElement | null>>({
    dinossauro: null,
    foguete: null,
    carrinho: null,
  });
  const completedRef = useRef(false);

  useEffect(() => {
    onProgress(0, TOYS.length);
    const timer = window.setTimeout(() => {
      soundEngine.speak('Vamos guardar os brinquedos na prateleira!', 'gentle');
      void soundEngine.prefetchPhrases(['Dinossauro!', 'Foguete!', 'Carrinho!']);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [onProgress]);

  const placeToy = (toyId: ToyId) => {
    if (placed[toyId] || completedRef.current) return;
    const nextPlaced = { ...placed, [toyId]: true };
    const count = Object.values(nextPlaced).filter(Boolean).length;

    setPlaced(nextPlaced);
    setSelectedToy(null);
    setDragging(null);
    setBoyCheer(true);

    soundEngine.playChime(count);
    soundEngine.playSparkle();
    soundEngine.speak(
      pickVariedPhrase(`toy-ok-${toyId}`, TOY_SUCCESS_PHRASES[toyId]),
      'celebration',
    );
    onProgress(count, TOYS.length);

    window.setTimeout(() => setBoyCheer(false), 1100);

    if (count === TOYS.length) {
      completedRef.current = true;
      window.setTimeout(() => {
        onComplete();
      }, 1150);
    }
  };

  const isNearMatchingSlot = (toyId: ToyId, clientX: number, clientY: number): boolean => {
    const slotEl = slotRefs.current[toyId];
    if (!slotEl) return false;
    const rect = slotEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(clientX - cx, clientY - cy);
    return dist < Math.max(rect.width, rect.height) * 0.85;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, toy: ToyMeta) => {
    if (placed[toy.id]) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    soundEngine.playPop(1.05);
    soundEngine.speak(pickVariedPhrase(`toy-pick-${toy.id}`, TOY_PICK_PHRASES[toy.id]), 'cheerful');
    setSelectedToy(toy.id);
    setDragging({
      id: toy.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0,
      nearMatch: false,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || dragging.pointerId !== e.pointerId) return;
    const dx = e.clientX - dragging.startX;
    const dy = e.clientY - dragging.startY;
    const nearMatch = isNearMatchingSlot(dragging.id, e.clientX, e.clientY);
    setDragging({ ...dragging, dx, dy, nearMatch });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || dragging.pointerId !== e.pointerId) return;
    const movedDistance = Math.hypot(dragging.dx, dragging.dy);

    if (isNearMatchingSlot(dragging.id, e.clientX, e.clientY)) {
      placeToy(dragging.id);
      return;
    }

    // Check if dropped on a wrong slot
    if (movedDistance > 35) {
      const droppedOnWrong = TOYS.some((other) => {
        if (other.id === dragging.id) return false;
        const el = slotRefs.current[other.id];
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      });
      if (droppedOnWrong) {
        soundEngine.playBoing();
        soundEngine.speak(pickVariedPhrase('toy-retry', GENTLE_RETRY), 'gentle');
        setWiggleId(dragging.id);
        window.setTimeout(() => setWiggleId(null), 550);
      }
    }

    setDragging(null);
  };

  const handleSlotTap = (slotToy: ToyMeta) => {
    if (placed[slotToy.id]) {
      soundEngine.playPop(1.2);
      soundEngine.speak(`${slotToy.label}!`, 'cheerful');
      return;
    }
    if (selectedToy === slotToy.id) {
      placeToy(slotToy.id);
    } else if (selectedToy) {
      soundEngine.playBoing();
      soundEngine.speak(`Aqui é o lugar do ${slotToy.label.toLowerCase()}!`, 'gentle');
    } else {
      soundEngine.playPop(0.95);
      soundEngine.speak(`Cadê o ${slotToy.label.toLowerCase()}?`, 'gentle');
    }
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col justify-between gap-2 sm:gap-4 overflow-hidden touch-none px-3 pb-3 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#FFF6D6] via-[#FFF9E8] to-[#FDE8C8]">
      {/* Playroom Wallpaper Subtle Dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: 'radial-gradient(#F59E0B 2px, transparent 2px)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden="true"
      />

      {/* Upper Area: Wooden Shelf with 3 Matching Silhouettes + Cheering Boy */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-1 min-h-0 max-w-5xl w-full mx-auto">
        <div className="w-full flex items-end justify-center gap-3 sm:gap-6 min-h-0">
          {/* Caillou cheering beside the shelf on medium+ screens */}
          <div className="hidden md:flex flex-col items-center shrink-0 w-28 lg:w-36 -mb-2">
            <BoyCharacter
              mood={boyCheer ? 'cheering' : 'happy'}
              className={`w-full h-auto max-w-full ${boyCheer ? 'animate-happy-bounce' : ''}`}
            />
          </div>

          {/* Wooden Toy Shelf */}
          <div className="flex-1 max-w-3xl w-full min-w-0">
            <div className="relative rounded-[24px] sm:rounded-[32px] bg-[#E5A967] border-[4px] sm:border-[5px] border-[#4A2E1B] shadow-[0_8px_0_rgba(74,46,27,0.22)] p-2.5 sm:p-5">
              {/* Inner recessed shelf wall */}
              <div className="grid grid-cols-3 gap-2 sm:gap-5 rounded-xl sm:rounded-2xl bg-[#C98A4B] border-[3px] sm:border-4 border-[#7C4A1D] p-2 sm:p-4">
                {shelfOrder.map((toy) => {
                  const isPlaced = placed[toy.id];
                  const isMagnetHighlight = dragging?.id === toy.id && dragging.nearMatch;
                  const isTapSelectedTarget = !dragging && selectedToy === toy.id && !isPlaced;

                  return (
                    <button
                      key={toy.id}
                      ref={(el) => {
                        slotRefs.current[toy.id] = el;
                      }}
                      type="button"
                      onClick={() => handleSlotTap(toy)}
                      aria-label={`Espaço do ${toy.label}`}
                      className={`relative flex flex-col items-center justify-center aspect-square max-h-[28dvh] w-full mx-auto p-1.5 sm:p-3 rounded-xl sm:rounded-2xl transition-transform duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] ${
                        isPlaced
                          ? 'bg-[#FFFDF5] border-[3px] sm:border-4 border-[#22C55E] scale-100'
                          : isMagnetHighlight
                            ? 'bg-[#FEF08A] border-[3px] sm:border-4 border-[#F59E0B] scale-105 shadow-[0_0_24px_rgba(250,204,21,0.9)]'
                            : isTapSelectedTarget
                              ? 'bg-[#FFF7D6]/90 border-[3px] sm:border-4 border-[#FACC15] animate-pulse-ring'
                              : 'bg-[#F5D6A8]/75 border-[3px] sm:border-4 border-dashed border-[#7C4A1D]/60'
                      }`}
                    >
                      {isPlaced ? (
                        <>
                          <ToyIllustration
                            type={toy.id}
                            className="w-full h-auto max-w-[90%] max-h-[90%] animate-pop-in"
                          />
                          <CartoonStarIcon
                            filled
                            className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 sm:w-9 h-auto animate-pop-in"
                          />
                        </>
                      ) : (
                        <ToyIllustration
                          type={toy.id}
                          silhouette
                          className="w-full h-auto max-w-[90%] max-h-[90%] pointer-events-none"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Wooden shelf bottom ledge */}
              <div className="mt-2 sm:mt-3 h-3 sm:h-4 rounded-full bg-[#B47233] border-2 border-[#4A2E1B]/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Lower Area: Soft Playroom Rug with Draggable Toys */}
      <section className="relative z-20 max-w-4xl w-full mx-auto shrink-0">
        <div className="rounded-[26px] sm:rounded-[40px] bg-[#93C5FD]/45 border-[4px] sm:border-[5px] border-[#3B82F6]/40 px-2.5 py-2.5 sm:px-8 sm:py-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-8 items-center justify-items-center">
            {trayOrder.map((toy) => {
              const isPlaced = placed[toy.id];
              const isDraggingThis = dragging?.id === toy.id;
              const isSelected = selectedToy === toy.id && !isDraggingThis;

              if (isPlaced) {
                return (
                  <div
                    key={toy.id}
                    className="w-[min(24vw,18dvh)] max-w-[136px] aspect-square"
                    aria-hidden="true"
                  />
                );
              }

              return (
                <div
                  key={toy.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Arrastar ${toy.label}`}
                  onPointerDown={(e) => handlePointerDown(e, toy)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      soundEngine.playPop();
                      soundEngine.speak(`${toy.label}!`, 'cheerful');
                      setSelectedToy(toy.id);
                    }
                  }}
                  style={
                    isDraggingThis
                      ? {
                          transform: `translate3d(${dragging.dx}px, ${dragging.dy}px, 0) scale(1.14)`,
                          zIndex: 60,
                        }
                      : undefined
                  }
                  className={`touch-none flex flex-col items-center justify-center p-1.5 sm:p-3 rounded-2xl sm:rounded-3xl cursor-grab active:cursor-grabbing transition-shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] w-full max-w-[144px] ${
                    isDraggingThis
                      ? 'drop-shadow-[0_18px_16px_rgba(74,46,27,0.3)]'
                      : isSelected
                        ? 'bg-[#FFFDF5] border-[3px] sm:border-4 border-[#F59E0B] shadow-lg scale-105'
                        : 'hover:scale-105'
                  } ${wiggleId === toy.id ? 'animate-gentle-wiggle' : ''}`}
                >
                  <div className="w-[min(22vw,16dvh)] max-w-[120px] flex items-center justify-center pointer-events-none">
                    <ToyIllustration type={toy.id} className="w-full h-auto max-w-full" />
                  </div>
                  <span className="mobile-landscape-hide mt-0.5 sm:mt-1 text-sm sm:text-xl font-bold text-[#3F2617] whitespace-nowrap">
                    {toy.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
