import React, { useEffect, useRef, useState } from 'react';
import { ShapeBlockIllustration, ShapeId } from '../components/ExtraCartoonArt';
import { soundEngine } from '../utils/audio';
import { GENTLE_RETRY, pickVariedPhrase, PRAISE_SHORT } from '../utils/phrases';

interface ShapesTrainGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

interface ShapeMeta {
  id: ShapeId;
  name: string;
  spokenName: string;
  wagonBg: string;
}

const SHAPES: readonly ShapeMeta[] = [
  { id: 'circulo', name: 'Círculo', spokenName: 'Círculo vermelho', wagonBg: 'bg-[#FEE2E2]' },
  { id: 'quadrado', name: 'Quadrado', spokenName: 'Quadrado azul', wagonBg: 'bg-[#DBEAFE]' },
  { id: 'triangulo', name: 'Triângulo', spokenName: 'Triângulo amarelo', wagonBg: 'bg-[#FEF9C3]' },
];

export const ShapesTrainGame: React.FC<ShapesTrainGameProps> = ({ onProgress, onComplete }) => {
  const [loadedShapes, setLoadedShapes] = useState<ShapeId[]>([]);
  const [selectedId, setSelectedId] = useState<ShapeId | null>(null);
  const [draggingId, setDraggingId] = useState<ShapeId | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [departing, setDeparting] = useState(false);

  const wagonRefs = useRef<Partial<Record<ShapeId, HTMLButtonElement | null>>>({});
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    onProgress(0, SHAPES.length);
  }, [onProgress]);

  const placeShape = (shapeId: ShapeId) => {
    if (completedRef.current || loadedShapes.includes(shapeId)) return;
    const meta = SHAPES.find((s) => s.id === shapeId);
    const nextLoaded = [...loadedShapes, shapeId];
    setLoadedShapes(nextLoaded);
    setSelectedId(null);
    onProgress(nextLoaded.length, SHAPES.length);
    soundEngine.playChime(nextLoaded.length + 1);

    if (nextLoaded.length >= SHAPES.length) {
      completedRef.current = true;
      soundEngine.playTrainWhistle();
      setDeparting(true);
      window.setTimeout(() => onComplete(), 1100);
    } else {
      soundEngine.speak(
        `${pickVariedPhrase('train-ok', PRAISE_SHORT)} ${meta?.spokenName ?? ''} no trem!`,
        'cheerful',
      );
    }
  };

  const handleShapePointerDown = (e: React.PointerEvent<HTMLButtonElement>, shape: ShapeMeta) => {
    if (loadedShapes.includes(shape.id) || completedRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setDraggingId(shape.id);
    setSelectedId(shape.id);
    setDragPos({ x: e.clientX, y: e.clientY });
    soundEngine.playPop(1.05);
    soundEngine.speak(`${shape.spokenName}!`, 'cheerful');
  };

  const handleShapePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingId) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleShapePointerUp = (e: React.PointerEvent<HTMLButtonElement>, shape: ShapeMeta) => {
    if (draggingId !== shape.id) return;
    setDraggingId(null);

    const start = startPosRef.current;
    const movedDist = start ? Math.hypot(e.clientX - start.x, e.clientY - start.y) : 0;
    if (movedDist < 12) {
      // Keep selected so child can tap matching wagon
      return;
    }

    // Check magnetic snap against target wagon
    const targetEl = wagonRefs.current[shape.id];
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const pad = 42;
      if (
        e.clientX >= rect.left - pad &&
        e.clientX <= rect.right + pad &&
        e.clientY >= rect.top - pad &&
        e.clientY <= rect.bottom + pad
      ) {
        placeShape(shape.id);
        return;
      }
    }

    soundEngine.playBoing();
    soundEngine.speak(pickVariedPhrase('train-retry', GENTLE_RETRY), 'gentle');
  };

  const handleTapWagon = (wagonShapeId: ShapeId) => {
    if (loadedShapes.includes(wagonShapeId) || completedRef.current) return;
    if (!selectedId) {
      const meta = SHAPES.find((s) => s.id === wagonShapeId);
      soundEngine.playPop(0.95);
      soundEngine.speak(`Aqui entra o ${meta?.name.toLowerCase()}!`, 'gentle');
      return;
    }
    if (selectedId === wagonShapeId) {
      placeShape(wagonShapeId);
    } else {
      soundEngine.playBoing();
      soundEngine.speak(pickVariedPhrase('train-retry', GENTLE_RETRY), 'gentle');
    }
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col items-center justify-between overflow-hidden touch-none select-none px-3 pb-3 pt-1.5 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#DCFCE7]">
      <div className="px-4 py-1.5 rounded-full bg-white/95 border-[3px] border-[#4A2E1B] shadow-sm text-sm sm:text-xl font-bold text-[#3F2617] shrink-0">
        Coloque cada forma no vagão do trem! ({loadedShapes.length}/{SHAPES.length})
      </div>

      {/* Train on Tracks */}
      <section className="flex-1 min-h-0 w-full max-w-4xl flex flex-col items-center justify-center">
        <div
          className={`w-full flex items-end justify-center gap-1.5 sm:gap-3 transition-transform duration-1000 ease-in ${
            departing ? '-translate-x-16 sm:-translate-x-28' : ''
          }`}
        >
          {/* Cute Cartoon Locomotive */}
          <div className="w-[22%] max-w-[140px] shrink-0">
            <svg viewBox="0 0 140 120" className="w-full h-auto max-w-full" aria-hidden="true">
              <circle cx="34" cy="18" r="10" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="3" />
              <circle cx="52" cy="12" r="7" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="3" />
              <rect x="26" y="28" width="18" height="24" rx="5" fill="#FACC15" stroke="#4A2E1B" strokeWidth="4" />
              <rect x="16" y="48" width="70" height="44" rx="10" fill="#EF4444" stroke="#4A2E1B" strokeWidth="4.2" />
              <rect x="64" y="24" width="60" height="68" rx="10" fill="#3B82F6" stroke="#4A2E1B" strokeWidth="4.2" />
              <rect x="76" y="36" width="34" height="24" rx="6" fill="#BAE6FD" stroke="#4A2E1B" strokeWidth="3.5" />
              <circle cx="38" cy="98" r="13" fill="#334155" stroke="#4A2E1B" strokeWidth="4" />
              <circle cx="96" cy="98" r="15" fill="#334155" stroke="#4A2E1B" strokeWidth="4" />
              <circle cx="38" cy="98" r="5" fill="#FACC15" />
              <circle cx="96" cy="98" r="5" fill="#FACC15" />
            </svg>
          </div>

          {/* 3 Shape Wagons */}
          {SHAPES.map((shape) => {
            const isLoaded = loadedShapes.includes(shape.id);
            const isHighlighted = selectedId === shape.id && !isLoaded;

            return (
              <button
                key={shape.id}
                ref={(el) => {
                  wagonRefs.current[shape.id] = el;
                }}
                type="button"
                onClick={() => handleTapWagon(shape.id)}
                aria-label={`Vagão do ${shape.name}`}
                className={`relative flex-1 max-w-[170px] flex flex-col items-center cursor-pointer transition-transform ${
                  isHighlighted ? 'scale-105' : ''
                }`}
              >
                <div
                  className={`w-full aspect-square rounded-[20px] sm:rounded-[26px] border-[4px] border-[#4A2E1B] shadow-md flex items-center justify-center p-2 sm:p-3 ${
                    isLoaded ? 'bg-white animate-pop-in' : shape.wagonBg
                  } ${isHighlighted ? 'ring-4 ring-[#FACC15]' : ''}`}
                >
                  <ShapeBlockIllustration
                    shape={shape.id}
                    silhouette={!isLoaded}
                    className="w-full h-auto max-w-full"
                  />
                </div>
                {/* Wagon Wheels */}
                <div className="flex justify-around w-4/5 -mt-2">
                  <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#334155] border-[3px] border-[#4A2E1B]" />
                  <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#334155] border-[3px] border-[#4A2E1B]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Wooden Railway Track */}
        <div className="w-full max-w-4xl h-3 sm:h-4 rounded-full bg-[#92400E] border-[3px] border-[#4A2E1B] mt-0.5" />
      </section>

      {/* Bottom 3 Draggable Shape Blocks */}
      <section className="grid grid-cols-3 gap-2.5 sm:gap-5 w-full max-w-2xl shrink-0">
        {SHAPES.map((shape) => {
          const isLoaded = loadedShapes.includes(shape.id);
          const isSelected = selectedId === shape.id && !isLoaded;
          const isDragging = draggingId === shape.id;

          return (
            <button
              key={shape.id}
              type="button"
              disabled={isLoaded}
              onPointerDown={(e) => handleShapePointerDown(e, shape)}
              onPointerMove={handleShapePointerMove}
              onPointerUp={(e) => handleShapePointerUp(e, shape)}
              onPointerCancel={() => setDraggingId(null)}
              aria-label={`Arrastar ${shape.spokenName}`}
              className={`toddler-btn flex flex-col items-center justify-center gap-1 p-2.5 sm:p-4 rounded-[22px] sm:rounded-[28px] bg-white border-[4px] border-[#4A2E1B] border-b-[7px] shadow-md touch-none ${
                isLoaded
                  ? 'opacity-30 cursor-default'
                  : 'cursor-grab active:cursor-grabbing hover:bg-[#FFFBEB]'
              } ${isSelected ? 'ring-4 ring-[#FACC15]' : ''} ${isDragging ? 'opacity-30' : ''}`}
            >
              <div className="w-[min(18vw,11dvh)] max-w-[88px]">
                <ShapeBlockIllustration shape={shape.id} className="w-full h-auto max-w-full" />
              </div>
              <span className="text-sm sm:text-xl font-bold text-[#3F2617]">{shape.name}</span>
            </button>
          );
        })}
      </section>

      {/* Floating Dragged Shape */}
      {draggingId && (
        <div
          style={{ left: dragPos.x, top: dragPos.y }}
          className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 z-50 w-24 sm:w-28 drop-shadow-xl"
        >
          <ShapeBlockIllustration shape={draggingId} className="w-full h-auto max-w-full" />
        </div>
      )}
    </main>
  );
};
