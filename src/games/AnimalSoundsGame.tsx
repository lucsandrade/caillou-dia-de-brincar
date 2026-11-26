import React, { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { AnimalId, AnimalIllustration } from '../components/ExtraCartoonArt';
import { CartoonStarIcon } from '../components/CartoonArt';
import { soundEngine } from '../utils/audio';
import { pickVariedPhrase, PRAISE_SHORT } from '../utils/phrases';

interface AnimalSoundsGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

interface AnimalMeta {
  id: AnimalId;
  name: string;
  article: string;
  soundWord: string;
  question: string;
  bg: string;
}

const ANIMALS: readonly AnimalMeta[] = [
  {
    id: 'vaca',
    name: 'Vaca',
    article: 'A vaca',
    soundWord: 'Muuu!',
    question: 'Quem faz muuu?',
    bg: 'bg-[#FEF3C7]',
  },
  {
    id: 'cachorro',
    name: 'Cachorrinho',
    article: 'O cachorrinho',
    soundWord: 'Au-au!',
    question: 'Quem faz au-au?',
    bg: 'bg-[#FFEDD5]',
  },
  {
    id: 'pato',
    name: 'Patinho',
    article: 'O patinho',
    soundWord: 'Quá-quá!',
    question: 'Quem faz quá-quá?',
    bg: 'bg-[#E0F2FE]',
  },
  {
    id: 'ovelha',
    name: 'Ovelhinha',
    article: 'A ovelhinha',
    soundWord: 'Mééé!',
    question: 'Quem faz mééé?',
    bg: 'bg-[#DCFCE7]',
  },
];

function shuffleOrder(): AnimalId[] {
  const ids: AnimalId[] = ['vaca', 'cachorro', 'pato', 'ovelha'];
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

export const AnimalSoundsGame: React.FC<AnimalSoundsGameProps> = ({ onProgress, onComplete }) => {
  const [roundOrder] = useState<AnimalId[]>(() => shuffleOrder());
  const [roundIdx, setRoundIdx] = useState(0);
  const [celebratingId, setCelebratingId] = useState<AnimalId | null>(null);
  const [wigglingId, setWigglingId] = useState<AnimalId | null>(null);
  const lockedRef = useRef(false);

  const currentTargetId = roundOrder[Math.min(roundIdx, roundOrder.length - 1)];
  const currentMeta = ANIMALS.find((a) => a.id === currentTargetId) ?? ANIMALS[0];

  const promptAnimal = (meta: AnimalMeta) => {
    soundEngine.playAnimalSound(meta.id);
    window.setTimeout(() => {
      soundEngine.speak(meta.question, 'cheerful');
    }, 450);
  };

  useEffect(() => {
    onProgress(0, ANIMALS.length);
  }, [onProgress]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      promptAnimal(currentMeta);
    }, roundIdx === 0 ? 550 : 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx]);

  const handleTapAnimal = (animal: AnimalMeta) => {
    if (lockedRef.current) return;

    if (animal.id === currentTargetId) {
      lockedRef.current = true;
      setCelebratingId(animal.id);
      soundEngine.playAnimalSound(animal.id);
      window.setTimeout(() => soundEngine.playChime(roundIdx + 1), 220);

      const nextRound = roundIdx + 1;
      onProgress(nextRound, ANIMALS.length);

      const praise = pickVariedPhrase('animal-ok', PRAISE_SHORT);
      soundEngine.speak(`${praise} ${animal.article} faz ${animal.soundWord}`, 'cheerful');

      window.setTimeout(() => {
        setCelebratingId(null);
        if (nextRound >= ANIMALS.length) {
          onComplete();
        } else {
          lockedRef.current = false;
          setRoundIdx(nextRound);
        }
      }, 1450);
    } else {
      setWigglingId(animal.id);
      soundEngine.playAnimalSound(animal.id);
      soundEngine.speak(`Esse é ${animal.article.toLowerCase()}! ${animal.soundWord}`, 'gentle');
      window.setTimeout(() => setWigglingId(null), 650);
    }
  };

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col justify-between overflow-hidden touch-none select-none px-3 pb-3 pt-1.5 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#BAE6FD] via-[#ECFCCB] to-[#BBF7D0]">
      {/* Prompt & Replay Sound Button */}
      <section className="flex items-center justify-center gap-2 sm:gap-4 shrink-0 pb-2">
        <button
          type="button"
          onClick={() => promptAnimal(currentMeta)}
          aria-label="Ouvir o som do bichinho de novo"
          className="toddler-btn flex items-center gap-2 sm:gap-3 px-4 sm:px-7 py-2 sm:py-3 rounded-full bg-[#FACC15] hover:bg-[#FDE047] border-[3.5px] sm:border-[4px] border-[#4A2E1B] border-b-[6px] shadow-md cursor-pointer"
        >
          <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A2E1B] shrink-0" strokeWidth={2.8} />
          <span className="text-base sm:text-2xl font-bold text-[#3F2617]">
            {currentMeta.question}
          </span>
        </button>
      </section>

      {/* 4 Big Farm Animal Cards */}
      <section className="mobile-landscape-grid-4 flex-1 min-h-0 grid grid-cols-2 gap-3 sm:gap-5 max-w-4xl w-full mx-auto">
        {ANIMALS.map((animal) => {
          const isWinner = celebratingId === animal.id;
          const isWiggling = wigglingId === animal.id;
          return (
            <button
              key={animal.id}
              type="button"
              onClick={() => handleTapAnimal(animal)}
              aria-label={`${animal.name}, faz ${animal.soundWord}`}
              className={`toddler-btn relative flex flex-col items-center justify-center gap-1 sm:gap-2 p-2.5 sm:p-5 rounded-[24px] sm:rounded-[32px] ${animal.bg} border-[4px] sm:border-[5px] border-[#4A2E1B] border-b-[7px] sm:border-b-[10px] shadow-lg cursor-pointer min-h-0 overflow-hidden transition-transform ${
                isWinner ? 'ring-4 ring-[#FACC15] scale-[1.03] animate-happy-bounce' : ''
              } ${isWiggling ? 'animate-gentle-wiggle' : ''}`}
            >
              {isWinner && (
                <div className="absolute top-2 right-2 w-7 sm:w-10">
                  <CartoonStarIcon filled className="w-full h-auto max-w-full" />
                </div>
              )}
              <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                <div className="w-[min(32vw,20dvh)] max-w-[165px]">
                  <AnimalIllustration animal={animal.id} className="w-full h-auto max-w-full" />
                </div>
              </div>
              <span className="text-base sm:text-2xl font-bold text-[#3F2617] shrink-0">
                {animal.name}
              </span>
            </button>
          );
        })}
      </section>
    </main>
  );
};
