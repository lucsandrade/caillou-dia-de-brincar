import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CartoonStarIcon,
  FruitColor,
  FruitIllustration,
  SisterCharacter,
} from '../components/CartoonArt';
import { soundEngine } from '../utils/audio';
import {
  FRUIT_PICK_PHRASES,
  FRUIT_SUCCESS_PHRASES,
  GENTLE_RETRY,
  pickVariedPhrase,
} from '../utils/phrases';

interface ColorsSnackGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

interface FruitItem {
  color: FruitColor;
  name: string;
  colorName: string;
  plateBg: string;
  plateRim: string;
  plateInner: string;
}

const FRUITS: FruitItem[] = [
  {
    color: 'vermelho',
    name: 'Maçã vermelha',
    colorName: 'Vermelho',
    plateBg: '#EF4444',
    plateRim: '#B91C1C',
    plateInner: '#FEE2E2',
  },
  {
    color: 'amarelo',
    name: 'Banana amarela',
    colorName: 'Amarelo',
    plateBg: '#FACC15',
    plateRim: '#CA8A04',
    plateInner: '#FEF9C3',
  },
  {
    color: 'verde',
    name: 'Pera verde',
    colorName: 'Verde',
    plateBg: '#22C55E',
    plateRim: '#15803D',
    plateInner: '#DCFCE7',
  },
  {
    color: 'azul',
    name: 'Mirtilo azul',
    colorName: 'Azul',
    plateBg: '#3B82F6',
    plateRim: '#1D4ED8',
    plateInner: '#DBEAFE',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const ColorsSnackGame: React.FC<ColorsSnackGameProps> = ({ onProgress, onComplete }) => {
  const fruitTrayOrder = useMemo(() => shuffle(FRUITS), []);
  const plateOrder = useMemo(() => FRUITS, []);

  const [served, setServed] = useState<Record<FruitColor, boolean>>({
    vermelho: false,
    amarelo: false,
    verde: false,
    azul: false,
  });
  const [selectedFruit, setSelectedFruit] = useState<FruitColor | null>(null);
  const [dragging, setDragging] = useState<{
    color: FruitColor;
    pointerId: number;
    startX: number;
    startY: number;
    dx: number;
    dy: number;
    nearMatch: boolean;
  } | null>(null);
  const [sisterMood, setSisterMood] = useState<'happy' | 'yummy' | 'cheering'>('happy');
  const [wiggleColor, setWiggleColor] = useState<FruitColor | null>(null);

  const plateRefs = useRef<Record<FruitColor, HTMLButtonElement | null>>({
    vermelho: null,
    amarelo: null,
    verde: null,
    azul: null,
  });
  const completedRef = useRef(false);

  useEffect(() => {
    onProgress(0, FRUITS.length);
    const timer = window.setTimeout(() => {
      soundEngine.speak('Vamos colocar cada frutinha no pratinho da cor certa!', 'gentle');
      void soundEngine.prefetchPhrases([
        'Maçã vermelha!',
        'Banana amarela!',
        'Pera verde!',
        'Mirtilo azul!',
      ]);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [onProgress]);

  const serveFruit = (color: FruitColor) => {
    if (served[color] || completedRef.current) return;
    const nextServed = { ...served, [color]: true };
    const count = Object.values(nextServed).filter(Boolean).length;

    setServed(nextServed);
    setSelectedFruit(null);
    setDragging(null);
    setSisterMood(count === FRUITS.length ? 'cheering' : 'yummy');

    soundEngine.playChime(count);
    soundEngine.playSparkle();
    soundEngine.speak(
      pickVariedPhrase(`fruit-ok-${color}`, FRUIT_SUCCESS_PHRASES[color]),
      'celebration',
    );
    onProgress(count, FRUITS.length);

    if (count < FRUITS.length) {
      window.setTimeout(() => setSisterMood('happy'), 1200);
    } else {
      completedRef.current = true;
      window.setTimeout(() => {
        onComplete();
      }, 1200);
    }
  };

  const isNearMatchingPlate = (color: FruitColor, clientX: number, clientY: number): boolean => {
    const plateEl = plateRefs.current[color];
    if (!plateEl) return false;
    const rect = plateEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(clientX - cx, clientY - cy);
    return dist < Math.max(rect.width, rect.height) * 0.85;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, fruit: FruitItem) => {
    if (served[fruit.color]) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    soundEngine.playPop(1.08);
    soundEngine.speak(
      pickVariedPhrase(`fruit-pick-${fruit.color}`, FRUIT_PICK_PHRASES[fruit.color]),
      'cheerful',
    );
    setSelectedFruit(fruit.color);
    setDragging({
      color: fruit.color,
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
    const nearMatch = isNearMatchingPlate(dragging.color, e.clientX, e.clientY);
    setDragging({ ...dragging, dx, dy, nearMatch });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || dragging.pointerId !== e.pointerId) return;
    const movedDistance = Math.hypot(dragging.dx, dragging.dy);

    if (isNearMatchingPlate(dragging.color, e.clientX, e.clientY)) {
      serveFruit(dragging.color);
      return;
    }

    if (movedDistance > 35) {
      const droppedOnWrong = FRUITS.some((other) => {
        if (other.color === dragging.color) return false;
        const el = plateRefs.current[other.color];
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      });
      if (droppedOnWrong) {
        soundEngine.playBoing();
        soundEngine.speak(pickVariedPhrase('fruit-retry', GENTLE_RETRY), 'gentle');
        setWiggleColor(dragging.color);
        window.setTimeout(() => setWiggleColor(null), 550);
      }
    }

    setDragging(null);
  };

  const handlePlateTap = (plate: FruitItem) => {
    if (served[plate.color]) {
      soundEngine.playPop(1.2);
      soundEngine.speak(`${plate.name}!`, 'cheerful');
      return;
    }
    if (selectedFruit === plate.color) {
      serveFruit(plate.color);
    } else if (selectedFruit) {
      soundEngine.playBoing();
      soundEngine.speak(`Esse é o pratinho ${plate.colorName.toLowerCase()}!`, 'gentle');
    } else {
      soundEngine.playPop(0.95);
      soundEngine.speak(`Pratinho ${plate.colorName.toLowerCase()}!`, 'cheerful');
    }
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col justify-between gap-2 sm:gap-4 overflow-hidden touch-none px-3 pb-3 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#FFEAF2] via-[#FFF6FA] to-[#FDE2E4]">
      {/* Little Sister waiting happily behind the kitchen table */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-1 min-h-0 max-w-5xl w-full mx-auto">
        <div className="mobile-landscape-hide flex items-center justify-center -mb-3 sm:-mb-6 z-0 w-[min(24vw,17dvh)] max-w-[144px]">
          <SisterCharacter
            mood={sisterMood}
            className={`w-full h-auto max-w-full transition-transform ${
              sisterMood !== 'happy' ? 'animate-happy-bounce' : ''
            }`}
          />
        </div>

        {/* Sunny Kitchen Table with 4 Colored Plates */}
        <div className="relative z-10 w-full max-w-4xl rounded-[26px] sm:rounded-[36px] bg-[#FDE68A] border-[4px] sm:border-[5px] border-[#4A2E1B] shadow-[0_8px_0_rgba(74,46,27,0.2)] px-3 py-3 sm:px-7 sm:py-5">
          <div className="mobile-landscape-grid-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 items-center justify-items-center">
            {plateOrder.map((plate) => {
              const isServed = served[plate.color];
              const isMagnetHighlight = dragging?.color === plate.color && dragging.nearMatch;
              const isTapSelectedTarget = !dragging && selectedFruit === plate.color && !isServed;

              return (
                <button
                  key={plate.color}
                  ref={(el) => {
                    plateRefs.current[plate.color] = el;
                  }}
                  type="button"
                  onClick={() => handlePlateTap(plate)}
                  aria-label={`Prato ${plate.colorName}`}
                  className={`relative flex flex-col items-center justify-center w-[min(30vw,18dvh)] h-[min(30vw,18dvh)] sm:w-[min(19vw,23dvh)] sm:h-[min(19vw,23dvh)] max-w-[154px] max-h-[154px] rounded-full border-[4px] sm:border-[5px] border-[#4A2E1B] transition-transform duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4A2E1B] ${
                    isMagnetHighlight
                      ? 'scale-110 shadow-[0_0_24px_rgba(250,204,21,0.95)]'
                      : isTapSelectedTarget
                        ? 'scale-105 animate-pulse-ring'
                        : 'hover:scale-103'
                  }`}
                  style={{
                    backgroundColor: plate.plateBg,
                    boxShadow: `inset 0 -5px 0 ${plate.plateRim}, 0 5px 0 rgba(74,46,27,0.18)`,
                  }}
                >
                  {/* Inner plate circle */}
                  <div
                    className="flex flex-col items-center justify-center w-[76%] h-[76%] rounded-full border-[3px] border-white/70 p-1"
                    style={{ backgroundColor: plate.plateInner }}
                  >
                    {isServed ? (
                      <FruitIllustration
                        color={plate.color}
                        className="w-full h-auto max-w-[85%] max-h-[85%] animate-pop-in"
                      />
                    ) : (
                      <span className="text-xs sm:text-base md:text-lg font-extrabold text-[#3F2617] leading-none">
                        {plate.colorName}
                      </span>
                    )}
                  </div>

                  {isServed && (
                    <CartoonStarIcon
                      filled
                      className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-6 sm:w-9 h-auto animate-pop-in"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Fruit Basket / Tray */}
      <section className="relative z-20 max-w-4xl w-full mx-auto shrink-0">
        <div className="rounded-[24px] sm:rounded-[34px] bg-[#FFFDF5] border-[4px] sm:border-[5px] border-[#4A2E1B] shadow-md px-2 py-2 sm:px-6 sm:py-3">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-6 items-center justify-items-center">
            {fruitTrayOrder.map((fruit) => {
              const isServed = served[fruit.color];
              const isDraggingThis = dragging?.color === fruit.color;
              const isSelected = selectedFruit === fruit.color && !isDraggingThis;

              if (isServed) {
                return (
                  <div
                    key={fruit.color}
                    className="w-[min(19vw,13dvh)] max-w-[96px] aspect-square"
                    aria-hidden="true"
                  />
                );
              }

              return (
                <div
                  key={fruit.color}
                  role="button"
                  tabIndex={0}
                  aria-label={`Arrastar ${fruit.name}`}
                  onPointerDown={(e) => handlePointerDown(e, fruit)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      soundEngine.playPop();
                      soundEngine.speak(`${fruit.name}!`, 'cheerful');
                      setSelectedFruit(fruit.color);
                    }
                  }}
                  style={
                    isDraggingThis
                      ? {
                          transform: `translate3d(${dragging.dx}px, ${dragging.dy}px, 0) scale(1.18)`,
                          zIndex: 60,
                        }
                      : undefined
                  }
                  className={`touch-none flex flex-col items-center justify-center p-1 sm:p-2 rounded-2xl sm:rounded-3xl cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] ${
                    isDraggingThis
                      ? 'drop-shadow-[0_16px_14px_rgba(74,46,27,0.3)]'
                      : isSelected
                        ? 'bg-[#FEF9C3] border-[3px] sm:border-4 border-[#F59E0B] scale-105'
                        : 'hover:scale-106'
                  } ${wiggleColor === fruit.color ? 'animate-gentle-wiggle' : ''}`}
                >
                  <div className="w-[min(18vw,13dvh)] max-w-[96px] flex items-center justify-center pointer-events-none">
                    <FruitIllustration color={fruit.color} className="w-full h-auto max-w-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
