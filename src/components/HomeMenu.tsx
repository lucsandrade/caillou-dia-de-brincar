import React, { useState } from 'react';
import {
  BoyCharacter,
  SisterCharacter,
  GrayCatCharacter,
  ToyIllustration,
  FruitIllustration,
  CartoonStarIcon,
  ParkSceneContent,
} from './CartoonArt';
import {
  AnimalIllustration,
  AccessoryIllustration,
  FlowerIllustration,
  BalloonsPreviewIcon,
  XylophonePreviewIcon,
  ButterflyPreviewIcon,
  TrainPreviewIcon,
} from './ExtraCartoonArt';
import { GAME_CATALOG, GameId } from '../types/game';
import { soundEngine } from '../utils/audio';
import { HOME_GREETINGS, pickVariedPhrase } from '../utils/phrases';

interface HomeMenuProps {
  completedGames: Record<GameId, number>;
  onSelectGame: (game: GameId) => void;
}

export const HomeMenu: React.FC<HomeMenuProps> = ({ completedGames, onSelectGame }) => {
  const [bouncingChar, setBouncingChar] = useState<'boy' | 'sister' | 'cat' | null>(null);

  const totalCompletedCount = GAME_CATALOG.filter((g) => (completedGames[g.id] || 0) > 0).length;

  const handleTapCharacter = (who: 'boy' | 'sister' | 'cat') => {
    setBouncingChar(who);
    if (who === 'boy') {
      soundEngine.playChime(2);
      soundEngine.speak(pickVariedPhrase('home-boy', HOME_GREETINGS.boy), 'cheerful');
    } else if (who === 'sister') {
      soundEngine.playChime(4);
      soundEngine.speak(pickVariedPhrase('home-sister', HOME_GREETINGS.sister), 'cheerful');
    } else {
      soundEngine.playMeow();
      soundEngine.speak(pickVariedPhrase('home-cat', HOME_GREETINGS.cat), 'cheerful');
    }
    window.setTimeout(() => setBouncingChar(null), 900);
  };

  const renderCardArt = (id: GameId) => {
    switch (id) {
      case 'brinquedos':
        return (
          <div className="flex items-center justify-center gap-0.5 sm:gap-1.5 w-full max-w-[140px] sm:max-w-[165px]">
            <ToyIllustration type="dinossauro" className="w-1/3 h-auto max-w-full" />
            <ToyIllustration type="foguete" className="w-1/3 h-auto max-w-full -mt-1.5" />
            <ToyIllustration type="carrinho" className="w-1/3 h-auto max-w-full" />
          </div>
        );
      case 'cores':
        return (
          <div className="flex items-center justify-center gap-0.5 sm:gap-1 w-full max-w-[146px] sm:max-w-[172px]">
            <FruitIllustration color="vermelho" className="w-1/4 h-auto max-w-full" />
            <FruitIllustration color="amarelo" className="w-1/4 h-auto max-w-full -mt-1" />
            <FruitIllustration color="verde" className="w-1/4 h-auto max-w-full" />
            <FruitIllustration color="azul" className="w-1/4 h-auto max-w-full -mt-1" />
          </div>
        );
      case 'esconde':
        return (
          <div className="relative flex items-center justify-center w-full max-w-[74px] sm:max-w-[88px]">
            <GrayCatCharacter mood="happy" className="w-full h-auto max-w-full" />
            <span className="absolute -left-3 top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/75 border-2 border-[#38BDF8] animate-float-slow" />
            <span className="absolute -right-3 top-2 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white/75 border-2 border-[#F472B6] animate-float-slow" />
          </div>
        );
      case 'quebra-cabeca':
        return (
          <div className="relative w-full max-w-[74px] sm:max-w-[88px] aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-[3px] border-[#4A2E1B] shadow-sm bg-[#BAE6FD]">
            <svg viewBox="0 0 400 400" className="w-full h-auto max-w-full block">
              <ParkSceneContent />
              <line x1="200" y1="0" x2="200" y2="400" stroke="#4A2E1B" strokeWidth="8" strokeDasharray="12 8" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#4A2E1B" strokeWidth="8" strokeDasharray="12 8" />
            </svg>
          </div>
        );
      case 'baloes':
        return (
          <div className="w-full max-w-[96px] sm:max-w-[114px]">
            <BalloonsPreviewIcon className="w-full h-auto max-w-full" />
          </div>
        );
      case 'animais':
        return (
          <div className="flex items-center justify-center gap-1 w-full max-w-[136px] sm:max-w-[158px]">
            <AnimalIllustration animal="vaca" className="w-1/2 h-auto max-w-full" />
            <AnimalIllustration animal="pato" className="w-1/2 h-auto max-w-full" />
          </div>
        );
      case 'memoria':
        return (
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl bg-[#A855F7] border-[3px] border-[#4A2E1B] flex items-center justify-center p-1.5 -rotate-6 shadow-sm">
              <CartoonStarIcon filled className="w-full h-auto max-w-full" />
            </div>
            <div className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl bg-[#FEF3C7] border-[3px] border-[#4A2E1B] flex items-center justify-center p-1 rotate-6 shadow-sm">
              <GrayCatCharacter mood="happy" className="w-full h-auto max-w-full" />
            </div>
          </div>
        );
      case 'xilofone':
        return (
          <div className="w-full max-w-[112px] sm:max-w-[132px]">
            <XylophonePreviewIcon className="w-full h-auto max-w-full" />
          </div>
        );
      case 'banho':
        return (
          <div className="relative flex items-center justify-center w-full max-w-[78px] sm:max-w-[92px]">
            <GrayCatCharacter mood="purring" className="w-full h-auto max-w-full" />
            <span className="absolute -top-1 -left-2 w-5 h-5 rounded-full bg-white border-2 border-[#38BDF8]" />
            <span className="absolute top-0 -right-2 w-6 h-6 rounded-full bg-white border-2 border-[#38BDF8]" />
            <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-white border-2 border-[#38BDF8]" />
          </div>
        );
      case 'contar':
        return (
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3].map((n) => (
              <div key={n} className="relative w-8 sm:w-10">
                <CartoonStarIcon filled className="w-full h-auto max-w-full" />
                <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-extrabold text-[#4A2E1B] pt-0.5">
                  {n}
                </span>
              </div>
            ))}
          </div>
        );
      case 'pintar':
        return (
          <div className="w-full max-w-[104px] sm:max-w-[122px]">
            <ButterflyPreviewIcon className="w-full h-auto max-w-full" />
          </div>
        );
      case 'vestir':
        return (
          <div className="relative flex items-center justify-center w-full max-w-[74px] sm:max-w-[88px]">
            <BoyCharacter mood="happy" className="w-full h-auto max-w-full" />
            <div className="absolute -top-2 left-[18%] w-[64%]">
              <AccessoryIllustration item="chapeu" className="w-full h-auto max-w-full" />
            </div>
          </div>
        );
      case 'jardim':
        return (
          <div className="flex items-end justify-center gap-1 w-full max-w-[106px] sm:max-w-[122px]">
            <FlowerIllustration bloomed petalColor="#F472B6" className="w-1/2 h-auto max-w-full" />
            <FlowerIllustration bloomed petalColor="#FACC15" className="w-1/2 h-auto max-w-full" />
          </div>
        );
      case 'trem':
        return (
          <div className="w-full max-w-[116px] sm:max-w-[136px]">
            <TrainPreviewIcon className="w-full h-auto max-w-full" />
          </div>
        );
    }
  };

  return (
    <main className="relative flex-1 min-h-0 flex flex-col overflow-hidden px-3 pb-2 sm:px-6 sm:pb-4 w-full max-w-full">
      {/* Decorative Storybook Sun & Clouds */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 sm:h-40 overflow-hidden">
        <svg
          viewBox="0 0 120 120"
          className="absolute right-4 sm:right-8 top-0 w-12 sm:w-20 h-auto animate-sun-spin opacity-85"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="28" fill="#FDE047" stroke="#4A2E1B" strokeWidth="4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="60"
              y1="14"
              x2="60"
              y2="24"
              stroke="#F59E0B"
              strokeWidth="6"
              strokeLinecap="round"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
        </svg>

        <svg
          viewBox="0 0 160 80"
          className="absolute left-4 sm:left-8 top-2 w-16 sm:w-32 h-auto animate-cloud-drift opacity-85"
          aria-hidden="true"
        >
          <path
            d="M24 58C14 58 8 50 10 40C12 31 20 26 29 27C35 14 53 10 66 19C76 11 94 14 101 26C112 25 122 34 120 46C119 54 112 58 104 58H24Z"
            fill="#FFFFFF"
            stroke="#93C5FD"
            strokeWidth="3.5"
          />
        </svg>
      </div>

      {/* Grassy Meadow Bottom Horizon */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-[#86EFAC] border-t-4 border-[#4A2E1B]/20 rounded-t-[48%]"
        aria-hidden="true"
      />

      {/* Interactive Characters Greeting Strip */}
      <section className="mobile-landscape-compact-chars relative z-10 flex items-end justify-center gap-3 sm:gap-6 pt-0.5 pb-1 shrink-0">
        <button
          type="button"
          onClick={() => handleTapCharacter('boy')}
          aria-label="Tocar no menino"
          className={`w-[min(16vw,11dvh)] max-w-[96px] cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] rounded-full ${
            bouncingChar === 'boy' ? 'animate-happy-bounce' : ''
          }`}
        >
          <BoyCharacter
            mood={bouncingChar === 'boy' ? 'cheering' : 'happy'}
            className="w-full h-auto max-w-full"
          />
        </button>

        <button
          type="button"
          onClick={() => handleTapCharacter('cat')}
          aria-label="Tocar no gato cinza"
          className={`w-[min(14vw,9.5dvh)] max-w-[84px] cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] rounded-full ${
            bouncingChar === 'cat' ? 'animate-happy-bounce' : ''
          }`}
        >
          <GrayCatCharacter
            mood={bouncingChar === 'cat' ? 'purring' : 'happy'}
            className="w-full h-auto max-w-full"
          />
        </button>

        <button
          type="button"
          onClick={() => handleTapCharacter('sister')}
          aria-label="Tocar na irmãzinha"
          className={`w-[min(16vw,11dvh)] max-w-[96px] cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] rounded-full ${
            bouncingChar === 'sister' ? 'animate-happy-bounce' : ''
          }`}
        >
          <SisterCharacter
            mood={bouncingChar === 'sister' ? 'cheering' : 'happy'}
            className="w-full h-auto max-w-full"
          />
        </button>

        {/* Stars Progress Counter */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border-[3px] border-[#4A2E1B] shadow-sm self-center"
          aria-label={`${totalCompletedCount} de ${GAME_CATALOG.length} joguinhos completos`}
        >
          <CartoonStarIcon filled className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span className="text-sm sm:text-lg font-extrabold text-[#3F2617]">
            {totalCompletedCount}/{GAME_CATALOG.length}
          </span>
        </div>
      </section>

      {/* Scrollable Grid of all 14 Colorful Mini-Games */}
      <section
        aria-label="Escolha um jogo"
        className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-contain pt-1.5 pb-5 px-0.5 max-w-6xl w-full mx-auto"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {GAME_CATALOG.map((card) => {
            const stars = completedGames[card.id] || 0;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  soundEngine.playPop(1.1);
                  soundEngine.speak(card.introSpeech, 'cheerful');
                  onSelectGame(card.id);
                }}
                className={`toddler-btn relative flex flex-col items-center justify-between gap-1.5 sm:gap-2 p-2.5 sm:p-4 min-h-[144px] sm:min-h-[178px] rounded-[22px] sm:rounded-[28px] ${card.bg} ${card.hoverBg} border-[4px] border-[#4A2E1B] border-b-[7px] sm:border-b-[9px] shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] overflow-hidden`}
              >
                {stars > 0 && (
                  <div
                    className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-6 sm:w-7"
                    aria-label="Jogo concluído"
                  >
                    <CartoonStarIcon filled className="w-full h-auto max-w-full drop-shadow-sm" />
                  </div>
                )}

                <div className="flex-1 min-h-0 w-full flex items-center justify-center py-0.5">
                  {renderCardArt(card.id)}
                </div>

                <span className="text-sm sm:text-lg md:text-xl font-bold text-[#3F2617] text-center leading-tight shrink-0">
                  {card.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};

