import React from 'react';
import {
  Volume2,
  VolumeX,
  MessageCircle,
  MessageCircleOff,
  Music,
  Minus,
  Plus,
} from 'lucide-react';
import { CartoonHouseIcon, CartoonStarIcon } from './CartoonArt';

interface TopBarProps {
  isHome: boolean;
  gameTitle?: string;
  progressCurrent?: number;
  progressTotal?: number;
  sfxEnabled: boolean;
  voiceEnabled: boolean;
  musicVolume: number; // 0, 0.35, 0.65, 1
  onGoHome: () => void;
  onToggleSfx: () => void;
  onToggleVoice: () => void;
  onDecreaseMusic: () => void;
  onIncreaseMusic: () => void;
  onToggleMusic: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isHome,
  gameTitle,
  progressCurrent = 0,
  progressTotal = 0,
  sfxEnabled,
  voiceEnabled,
  musicVolume,
  onGoHome,
  onToggleSfx,
  onToggleVoice,
  onDecreaseMusic,
  onIncreaseMusic,
  onToggleMusic,
}) => {
  const musicLevel = musicVolume === 0 ? 0 : musicVolume <= 0.4 ? 1 : musicVolume <= 0.75 ? 2 : 3;

  return (
    <header className="relative z-30 flex items-center justify-between gap-1.5 sm:gap-3 px-2.5 py-2 sm:px-6 sm:py-2.5 shrink-0 w-full max-w-full">
      {/* Left Zone: Compact single-line Title on Home, or Big 'Casa' button inside games */}
      <div className={`flex items-center ${isHome ? 'min-w-0 flex-1' : 'shrink-0'}`}>
        {!isHome ? (
          <button
            type="button"
            onClick={onGoHome}
            aria-label="Voltar para a Casa"
            className="toddler-btn flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl sm:rounded-3xl bg-[#FF7A45] hover:bg-[#FF692E] text-white border-[3px] sm:border-4 border-[#4A2E1B] border-b-[5px] sm:border-b-[7px] shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] min-h-[42px] sm:min-h-[50px]"
          >
            <CartoonHouseIcon className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
            <span className="text-base sm:text-xl md:text-2xl font-bold tracking-wide whitespace-nowrap">
              Casa
            </span>
          </button>
        ) : (
          <h1 className="text-[15px] min-[390px]:text-base sm:text-2xl md:text-3xl font-bold text-[#3F2617] tracking-tight whitespace-nowrap truncate drop-shadow-[0_2px_0_rgba(255,255,255,0.9)]">
            Caillou: Dia de Brincar!
          </h1>
        )}
      </div>

      {/* Center Zone: Game Title + Star Progress on tablets/desktops (compact stars on mobile games) */}
      {!isHome && gameTitle && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-0 flex-1">
          <h1 className="hidden md:block text-xl lg:text-2xl font-bold text-[#3F2617] truncate drop-shadow-[0_2px_0_rgba(255,255,255,0.9)]">
            {gameTitle}
          </h1>
          {progressTotal > 0 && (
            <div
              className="flex items-center gap-0.5 sm:gap-1 shrink-0"
              aria-label={`${progressCurrent} de ${progressTotal} concluídos`}
            >
              {Array.from({ length: progressTotal }).map((_, i) => (
                <CartoonStarIcon
                  key={i}
                  filled={i < progressCurrent}
                  className={`w-5 h-5 sm:w-7 sm:h-7 transition-transform duration-300 ${
                    i < progressCurrent ? 'scale-110' : 'scale-95 opacity-75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Right Zone: Compact Single-Row Music Volume + Som + Voz controls */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Music Volume Control Group */}
        <div
          className="flex items-center rounded-xl sm:rounded-2xl bg-[#FFFDF5] border-[3px] sm:border-4 border-[#4A2E1B] border-b-[5px] sm:border-b-[6px] overflow-hidden"
          role="group"
          aria-label="Volume da música"
        >
          <button
            type="button"
            onClick={onDecreaseMusic}
            disabled={musicLevel === 0}
            aria-label="Diminuir volume da música"
            className="flex items-center justify-center w-7 h-9 sm:w-9 sm:h-10 bg-[#F3E8FF] hover:bg-[#E9D5FF] disabled:opacity-40 text-[#3F2617] cursor-pointer disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FACC15]"
          >
            <Minus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
          </button>

          <button
            type="button"
            onClick={onToggleMusic}
            aria-pressed={musicLevel > 0}
            aria-label={musicLevel > 0 ? 'Silenciar música' : 'Ligar música'}
            className={`flex items-center gap-1 px-1.5 h-9 sm:px-2.5 sm:h-10 font-bold text-xs sm:text-base cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FACC15] ${
              musicLevel > 0
                ? 'bg-[#C084FC] text-[#2E1065] hover:bg-[#D8B4FE]'
                : 'bg-[#E2E8F0] text-[#64748B] hover:bg-[#CBD5E1]'
            }`}
          >
            <Music className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="hidden xl:inline">Música</span>
            <span className="flex items-end gap-[2px] h-3.5 sm:h-4" aria-hidden="true">
              {[1, 2, 3].map((bar) => (
                <span
                  key={bar}
                  className={`w-1 sm:w-1.5 rounded-sm transition-colors ${
                    bar === 1 ? 'h-1.5 sm:h-2' : bar === 2 ? 'h-2.5 sm:h-3' : 'h-3.5 sm:h-4'
                  } ${musicLevel >= bar ? 'bg-[#3F2617]' : 'bg-[#3F2617]/20'}`}
                />
              ))}
            </span>
          </button>

          <button
            type="button"
            onClick={onIncreaseMusic}
            disabled={musicLevel === 3}
            aria-label="Aumentar volume da música"
            className="flex items-center justify-center w-7 h-9 sm:w-9 sm:h-10 bg-[#F3E8FF] hover:bg-[#E9D5FF] disabled:opacity-40 text-[#3F2617] cursor-pointer disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FACC15]"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleSfx}
          aria-pressed={sfxEnabled}
          aria-label={sfxEnabled ? 'Desativar sons' : 'Ativar sons'}
          className={`toddler-btn flex items-center justify-center gap-1 min-w-[40px] h-[42px] sm:h-[46px] px-2 sm:px-3.5 rounded-xl sm:rounded-2xl border-[3px] sm:border-4 border-[#4A2E1B] border-b-[5px] sm:border-b-[6px] font-bold text-sm sm:text-base cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] ${
            sfxEnabled
              ? 'bg-[#FACC15] text-[#3F2617] hover:bg-[#FDE047]'
              : 'bg-[#E2E8F0] text-[#64748B] hover:bg-[#CBD5E1]'
          }`}
        >
          {sfxEnabled ? (
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          ) : (
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          )}
          <span className="hidden lg:inline">Som</span>
        </button>

        <button
          type="button"
          onClick={onToggleVoice}
          aria-pressed={voiceEnabled}
          aria-label={voiceEnabled ? 'Desativar narração em português' : 'Ativar narração em português'}
          className={`toddler-btn flex items-center justify-center gap-1 min-w-[40px] h-[42px] sm:h-[46px] px-2 sm:px-3.5 rounded-xl sm:rounded-2xl border-[3px] sm:border-4 border-[#4A2E1B] border-b-[5px] sm:border-b-[6px] font-bold text-sm sm:text-base cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] ${
            voiceEnabled
              ? 'bg-[#38BDF8] text-[#1E293B] hover:bg-[#7DD3FC]'
              : 'bg-[#E2E8F0] text-[#64748B] hover:bg-[#CBD5E1]'
          }`}
        >
          {voiceEnabled ? (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          ) : (
            <MessageCircleOff className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          )}
          <span className="hidden lg:inline">Voz</span>
        </button>
      </div>
    </header>
  );
};
