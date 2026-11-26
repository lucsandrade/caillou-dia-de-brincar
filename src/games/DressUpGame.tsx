import React, { useEffect, useRef, useState } from 'react';
import { BoyCharacter } from '../components/CartoonArt';
import { AccessoryId, AccessoryIllustration } from '../components/ExtraCartoonArt';
import { soundEngine } from '../utils/audio';
import { pickVariedPhrase, PRAISE_SHORT } from '../utils/phrases';

interface DressUpGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

interface AccessoryMeta {
  id: AccessoryId;
  name: string;
  equippedSpeech: string;
  bg: string;
}

const ACCESSORIES: readonly AccessoryMeta[] = [
  {
    id: 'chapeu',
    name: 'Boné',
    equippedSpeech: 'Que boné legal na cabeça!',
    bg: 'bg-[#DBEAFE]',
  },
  {
    id: 'oculos',
    name: 'Óculos',
    equippedSpeech: 'Olha os óculos azuis estilosos!',
    bg: 'bg-[#E0F2FE]',
  },
  {
    id: 'tenis',
    name: 'Tênis',
    equippedSpeech: 'Tênis verdinho nos pés!',
    bg: 'bg-[#DCFCE7]',
  },
];

export const DressUpGame: React.FC<DressUpGameProps> = ({ onProgress, onComplete }) => {
  const [equipped, setEquipped] = useState<AccessoryId[]>([]);
  const [draggingId, setDraggingId] = useState<AccessoryId | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [cheering, setCheering] = useState(false);

  const boyZoneRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    onProgress(0, ACCESSORIES.length);
  }, [onProgress]);

  const equipItem = (itemId: AccessoryId) => {
    if (completedRef.current || equipped.includes(itemId)) return;

    const nextEquipped = [...equipped, itemId];
    setEquipped(nextEquipped);
    onProgress(nextEquipped.length, ACCESSORIES.length);
    soundEngine.playChime(nextEquipped.length);
    setCheering(true);
    window.setTimeout(() => setCheering(false), 750);

    const meta = ACCESSORIES.find((a) => a.id === itemId);
    if (nextEquipped.length >= ACCESSORIES.length) {
      completedRef.current = true;
      soundEngine.playSparkle();
      window.setTimeout(() => onComplete(), 850);
    } else {
      soundEngine.speak(
        `${pickVariedPhrase('dress-ok', PRAISE_SHORT)} ${meta?.equippedSpeech ?? ''}`,
        'cheerful',
      );
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, item: AccessoryMeta) => {
    if (equipped.includes(item.id) || completedRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    setDraggingId(item.id);
    setDragPos({ x: e.clientX, y: e.clientY });
    soundEngine.playPop(1.05);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingId) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>, item: AccessoryMeta) => {
    if (draggingId !== item.id) return;
    setDraggingId(null);

    const start = pointerStartRef.current;
    const movedDist = start ? Math.hypot(e.clientX - start.x, e.clientY - start.y) : 0;

    // Simple toddler tap (< 14px movement) equips right away!
    if (movedDist < 14) {
      equipItem(item.id);
      return;
    }

    // Check drop anywhere near Caillou with generous margin
    const zone = boyZoneRef.current?.getBoundingClientRect();
    if (zone) {
      const margin = 48;
      const inside =
        e.clientX >= zone.left - margin &&
        e.clientX <= zone.right + margin &&
        e.clientY >= zone.top - margin &&
        e.clientY <= zone.bottom + margin;
      if (inside) {
        equipItem(item.id);
        return;
      }
    }

    soundEngine.playBoing();
    soundEngine.speak('Leve até o Caillou!', 'gentle');
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col items-center justify-between overflow-hidden touch-none select-none px-3 pb-3 pt-1.5 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#FEF9C3] via-[#FFFBEB] to-[#FDE68A]">
      <div className="px-4 py-1.5 rounded-full bg-white/95 border-[3px] border-[#4A2E1B] shadow-sm text-sm sm:text-xl font-bold text-[#3F2617] shrink-0">
        Vista o Caillou para passear! ({equipped.length}/{ACCESSORIES.length})
      </div>

      {/* Caillou Dressing Stage */}
      <section className="flex-1 min-h-0 w-full flex items-center justify-center py-1">
        <div
          ref={boyZoneRef}
          className={`relative w-[min(50vw,36dvh)] max-w-[235px] flex items-center justify-center rounded-[32px] p-3 transition-transform ${
            draggingId ? 'bg-white/60 ring-4 ring-dashed ring-[#F59E0B] scale-105' : ''
          } ${cheering ? 'animate-happy-bounce' : ''}`}
        >
          <BoyCharacter
            mood={cheering || equipped.length === ACCESSORIES.length ? 'cheering' : 'happy'}
            className="w-full h-auto max-w-full"
          />

          {/* Equipped Cap on Head */}
          {equipped.includes('chapeu') && (
            <div className="pointer-events-none absolute top-[1%] left-[19%] w-[62%] animate-pop-in">
              <AccessoryIllustration item="chapeu" className="w-full h-auto max-w-full" />
            </div>
          )}

          {/* Equipped Sunglasses on Eyes */}
          {equipped.includes('oculos') && (
            <div className="pointer-events-none absolute top-[26%] left-[25%] w-[50%] animate-pop-in">
              <AccessoryIllustration item="oculos" className="w-full h-auto max-w-full" />
            </div>
          )}

          {/* Equipped Sneakers on Feet */}
          {equipped.includes('tenis') && (
            <div className="pointer-events-none absolute bottom-[2%] left-[21%] w-[58%] animate-pop-in">
              <AccessoryIllustration item="tenis" className="w-full h-auto max-w-full" />
            </div>
          )}
        </div>
      </section>

      {/* Bottom 3 Accessory Cards */}
      <section className="grid grid-cols-3 gap-2.5 sm:gap-5 w-full max-w-2xl shrink-0">
        {ACCESSORIES.map((item) => {
          const isEquipped = equipped.includes(item.id);
          const isDragging = draggingId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={isEquipped}
              onPointerDown={(e) => handlePointerDown(e, item)}
              onPointerMove={handlePointerMove}
              onPointerUp={(e) => handlePointerUp(e, item)}
              onPointerCancel={() => setDraggingId(null)}
              aria-label={`Colocar ${item.name} no Caillou`}
              className={`toddler-btn flex flex-col items-center justify-center gap-1 p-2.5 sm:p-4 rounded-[22px] sm:rounded-[28px] border-[4px] border-[#4A2E1B] border-b-[7px] shadow-md touch-none ${
                isEquipped
                  ? 'bg-white/45 opacity-40 cursor-default'
                  : `${item.bg} cursor-grab active:cursor-grabbing`
              } ${isDragging ? 'opacity-30' : ''}`}
            >
              <div className="w-[min(20vw,12dvh)] max-w-[100px]">
                <AccessoryIllustration item={item.id} className="w-full h-auto max-w-full" />
              </div>
              <span className="text-sm sm:text-xl font-bold text-[#3F2617]">{item.name}</span>
            </button>
          );
        })}
      </section>

      {/* Floating Dragged Preview */}
      {draggingId && (
        <div
          style={{ left: dragPos.x, top: dragPos.y }}
          className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 z-50 w-24 sm:w-32 drop-shadow-xl"
        >
          <AccessoryIllustration item={draggingId} className="w-full h-auto max-w-full" />
        </div>
      )}
    </main>
  );
};
