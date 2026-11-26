import React, { useEffect, useRef, useState } from 'react';
import { CartoonStarIcon, GrayCatCharacter, ToyIllustration } from '../components/CartoonArt';
import { soundEngine } from '../utils/audio';
import { pickVariedPhrase, PRAISE_SHORT } from '../utils/phrases';

interface MemoryGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

type CardKind = 'gatinho' | 'dinossauro' | 'estrela';

interface MemoryCard {
  uid: number;
  kind: CardKind;
  label: string;
  bg: string;
}

const PAIR_TEMPLATES: { kind: CardKind; label: string; bg: string }[] = [
  { kind: 'gatinho', label: 'Gatinho!', bg: 'bg-[#E0F2FE]' },
  { kind: 'dinossauro', label: 'Dinossauro!', bg: 'bg-[#DCFCE7]' },
  { kind: 'estrela', label: 'Estrelinha!', bg: 'bg-[#FEF3C7]' },
];

function createDeck(): MemoryCard[] {
  const deck: MemoryCard[] = [];
  let uid = 1;
  for (const tpl of PAIR_TEMPLATES) {
    deck.push({ uid: uid++, ...tpl });
    deck.push({ uid: uid++, ...tpl });
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onProgress, onComplete }) => {
  const [cards] = useState<MemoryCard[]>(() => createDeck());
  const [flippedUids, setFlippedUids] = useState<number[]>([]);
  const [matchedKinds, setMatchedKinds] = useState<CardKind[]>([]);
  const busyRef = useRef(false);

  useEffect(() => {
    onProgress(0, PAIR_TEMPLATES.length);
  }, [onProgress]);

  const handleFlip = (card: MemoryCard) => {
    if (busyRef.current) return;
    if (matchedKinds.includes(card.kind)) return;
    if (flippedUids.includes(card.uid)) return;

    soundEngine.playPop(1.05);
    const nextFlipped = [...flippedUids, card.uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 1) {
      soundEngine.speak(card.label, 'cheerful');
      return;
    }

    // Second card flipped
    busyRef.current = true;
    const firstCard = cards.find((c) => c.uid === nextFlipped[0]);
    if (firstCard && firstCard.kind === card.kind) {
      const nextMatched = [...matchedKinds, card.kind];
      window.setTimeout(() => {
        setMatchedKinds(nextMatched);
        setFlippedUids([]);
        soundEngine.playChime(nextMatched.length + 1);
        soundEngine.playSparkle();
        onProgress(nextMatched.length, PAIR_TEMPLATES.length);
        soundEngine.speak(
          `${pickVariedPhrase('mem-ok', PRAISE_SHORT)} Par de ${card.label.toLowerCase()}`,
          'cheerful',
        );
        busyRef.current = false;

        if (nextMatched.length >= PAIR_TEMPLATES.length) {
          window.setTimeout(() => onComplete(), 900);
        }
      }, 320);
    } else {
      soundEngine.speak(card.label, 'cheerful');
      window.setTimeout(() => {
        soundEngine.playBoing();
        setFlippedUids([]);
        busyRef.current = false;
      }, 950);
    }
  };

  const renderCardArt = (kind: CardKind) => {
    if (kind === 'gatinho') {
      return <GrayCatCharacter mood="happy" className="w-[min(22vw,16dvh)] max-w-[120px] h-auto" />;
    }
    if (kind === 'dinossauro') {
      return <ToyIllustration type="dinossauro" className="w-[min(22vw,16dvh)] max-w-[120px] h-auto" />;
    }
    return <CartoonStarIcon filled className="w-[min(20vw,15dvh)] max-w-[105px] h-auto" />;
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col justify-between overflow-hidden touch-none select-none px-3 pb-3 pt-1.5 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#F3E8FF] via-[#FDF4FF] to-[#FCE7F3]">
      <div className="flex justify-center pb-2 shrink-0">
        <div className="px-4 py-1.5 rounded-full bg-white/90 border-[3px] border-[#4A2E1B] shadow-sm text-sm sm:text-xl font-bold text-[#3F2617]">
          Encontre os pares iguais! ({matchedKinds.length}/{PAIR_TEMPLATES.length})
        </div>
      </div>

      {/* 6 Big Cards in 3x2 grid */}
      <section
        aria-label="Cartas da memória"
        className="flex-1 min-h-0 grid grid-cols-3 grid-rows-2 gap-2.5 sm:gap-5 max-w-3xl w-full mx-auto"
      >
        {cards.map((card) => {
          const isMatched = matchedKinds.includes(card.kind);
          const isRevealed = isMatched || flippedUids.includes(card.uid);

          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleFlip(card)}
              aria-label={isRevealed ? card.label : 'Virar cartinha'}
              className={`toddler-btn relative flex flex-col items-center justify-center p-2 sm:p-4 rounded-[22px] sm:rounded-[30px] border-[4px] sm:border-[5px] border-[#4A2E1B] border-b-[7px] sm:border-b-[10px] shadow-lg cursor-pointer min-h-0 overflow-hidden transition-transform ${
                isRevealed
                  ? `${card.bg} ${isMatched ? 'ring-4 ring-[#FACC15] animate-pop-in' : ''}`
                  : 'bg-[#A855F7] hover:bg-[#9333EA]'
              }`}
            >
              {isRevealed ? (
                <>
                  <div className="flex-1 min-h-0 flex items-center justify-center w-full">
                    {renderCardArt(card.kind)}
                  </div>
                  <span className="text-xs sm:text-xl font-bold text-[#3F2617] shrink-0">
                    {card.label.replace('!', '')}
                  </span>
                </>
              ) : (
                <div className="w-[min(16vw,12dvh)] max-w-[78px] opacity-95">
                  <CartoonStarIcon filled className="w-full h-auto max-w-full" />
                </div>
              )}
            </button>
          );
        })}
      </section>
    </main>
  );
};
