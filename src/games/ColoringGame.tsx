import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../utils/audio';
import { pickVariedPhrase, PRAISE_SHORT } from '../utils/phrases';

interface ColoringGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

type RegionId = 'asasCima' | 'asasBaixo' | 'corpo' | 'sol' | 'flor';

const REGIONS: readonly { id: RegionId; label: string; praise: string }[] = [
  { id: 'asasCima', label: 'Asas de cima', praise: 'Que asas bonitas!' },
  { id: 'asasBaixo', label: 'Asas de baixo', praise: 'Que cor linda nas asas!' },
  { id: 'corpo', label: 'Corpinho da borboleta', praise: 'O corpinho ficou lindo!' },
  { id: 'sol', label: 'Solzinho', praise: 'Olha o solzinho colorido!' },
  { id: 'flor', label: 'Florzinha', praise: 'Que florzinha linda!' },
];

const PALETTE = [
  { id: 'vermelho', name: 'Vermelho', hex: '#EF4444' },
  { id: 'amarelo', name: 'Amarelo', hex: '#FACC15' },
  { id: 'azul', name: 'Azul', hex: '#38BDF8' },
  { id: 'verde', name: 'Verde', hex: '#22C55E' },
  { id: 'rosa', name: 'Rosa', hex: '#F472B6' },
] as const;

const INK = '#4A2E1B';

export const ColoringGame: React.FC<ColoringGameProps> = ({ onProgress, onComplete }) => {
  const [selectedColor, setSelectedColor] = useState<(typeof PALETTE)[number]>(PALETTE[4]); // Rosa default
  const [fills, setFills] = useState<Partial<Record<RegionId, string>>>({});
  const completedRef = useRef(false);

  const paintedCount = Object.keys(fills).length;

  useEffect(() => {
    onProgress(0, REGIONS.length);
  }, [onProgress]);

  const handleSelectColor = (swatch: (typeof PALETTE)[number]) => {
    setSelectedColor(swatch);
    soundEngine.playPop(1.1);
    soundEngine.speak(`${swatch.name}!`, 'cheerful');
  };

  const handlePaintRegion = (regionId: RegionId) => {
    const wasAlreadyPainted = fills[regionId] !== undefined;
    const nextFills = { ...fills, [regionId]: selectedColor.hex };
    setFills(nextFills);

    const nextCount = Object.keys(nextFills).length;
    soundEngine.playChime(nextCount);
    onProgress(nextCount, REGIONS.length);

    const regionInfo = REGIONS.find((r) => r.id === regionId);
    if (!wasAlreadyPainted && nextCount >= REGIONS.length && !completedRef.current) {
      completedRef.current = true;
      soundEngine.playSparkle();
      window.setTimeout(() => onComplete(), 800);
    } else {
      soundEngine.speak(
        `${regionInfo?.praise || pickVariedPhrase('paint-ok', PRAISE_SHORT)}`,
        'cheerful',
      );
    }
  };

  const getFill = (id: RegionId) => fills[id] ?? '#FFFDF5';

  return (
    <main className="relative flex-1 min-h-0 w-full max-w-full flex flex-col items-center justify-between overflow-hidden touch-none select-none px-3 pb-3 pt-1.5 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#FCE7F3] via-[#FFF1F2] to-[#FEF9C3]">
      <div className="px-4 py-1.5 rounded-full bg-white/95 border-[3px] border-[#4A2E1B] shadow-sm text-sm sm:text-xl font-bold text-[#3F2617] shrink-0">
        Escolha uma cor e toque no desenho! ({paintedCount}/{REGIONS.length})
      </div>

      {/* Big Coloring Canvas Card */}
      <section className="flex-1 min-h-0 w-full max-w-3xl my-2 flex items-center justify-center">
        <div className="w-full h-full max-h-[400px] bg-white rounded-[26px] sm:rounded-[34px] border-[4px] sm:border-[5px] border-[#4A2E1B] shadow-lg p-2 sm:p-4 flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 420 270"
            className="w-full h-full max-w-full max-h-full"
            role="img"
            aria-label="Desenho da borboleta para colorir"
          >
            {/* Sun Region (Top Right) */}
            <g
              onClick={() => handlePaintRegion('sol')}
              className="cursor-pointer transition-opacity hover:opacity-90"
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1="358"
                  y1="20"
                  x2="358"
                  y2="34"
                  stroke={INK}
                  strokeWidth="5"
                  strokeLinecap="round"
                  transform={`rotate(${deg} 358 58)`}
                />
              ))}
              <circle
                cx="358"
                cy="58"
                r="28"
                fill={getFill('sol')}
                stroke={INK}
                strokeWidth="4.5"
              />
              <circle cx="349" cy="54" r="3.2" fill={INK} />
              <circle cx="367" cy="54" r="3.2" fill={INK} />
              <path d="M350 64C354 69 362 69 366 64" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>

            {/* Flower Region (Bottom Left) */}
            <g
              onClick={() => handlePaintRegion('flor')}
              className="cursor-pointer transition-opacity hover:opacity-90"
            >
              <path d="M68 258V198" stroke="#16A34A" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="52" cy="228" rx="14" ry="8" transform="rotate(-24 52 228)" fill="#4ADE80" stroke={INK} strokeWidth="3.5" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse
                  key={deg}
                  cx="68"
                  cy="166"
                  rx="14"
                  ry="20"
                  fill={getFill('flor')}
                  stroke={INK}
                  strokeWidth="4"
                  transform={`rotate(${deg} 68 188)`}
                />
              ))}
              <circle cx="68" cy="188" r="14" fill="#FEF08A" stroke={INK} strokeWidth="4" />
            </g>

            {/* Butterfly Upper Wings */}
            <g
              onClick={() => handlePaintRegion('asasCima')}
              className="cursor-pointer transition-opacity hover:opacity-90"
            >
              <ellipse
                cx="148"
                cy="104"
                rx="66"
                ry="48"
                transform="rotate(-18 148 104)"
                fill={getFill('asasCima')}
                stroke={INK}
                strokeWidth="5"
              />
              <ellipse
                cx="272"
                cy="104"
                rx="66"
                ry="48"
                transform="rotate(18 272 104)"
                fill={getFill('asasCima')}
                stroke={INK}
                strokeWidth="5"
              />
              <circle cx="136" cy="98" r="14" fill="#FFFFFF" fillOpacity="0.45" stroke={INK} strokeWidth="3" />
              <circle cx="284" cy="98" r="14" fill="#FFFFFF" fillOpacity="0.45" stroke={INK} strokeWidth="3" />
            </g>

            {/* Butterfly Lower Wings */}
            <g
              onClick={() => handlePaintRegion('asasBaixo')}
              className="cursor-pointer transition-opacity hover:opacity-90"
            >
              <ellipse
                cx="162"
                cy="184"
                rx="46"
                ry="38"
                transform="rotate(20 162 184)"
                fill={getFill('asasBaixo')}
                stroke={INK}
                strokeWidth="5"
              />
              <ellipse
                cx="258"
                cy="184"
                rx="46"
                ry="38"
                transform="rotate(-20 258 184)"
                fill={getFill('asasBaixo')}
                stroke={INK}
                strokeWidth="5"
              />
            </g>

            {/* Butterfly Body & Antennae */}
            <g
              onClick={() => handlePaintRegion('corpo')}
              className="cursor-pointer transition-opacity hover:opacity-90"
            >
              <path d="M198 76C184 42 162 36 156 48" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M222 76C236 42 258 36 264 48" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
              <circle cx="156" cy="48" r="7" fill={getFill('corpo')} stroke={INK} strokeWidth="3.5" />
              <circle cx="264" cy="48" r="7" fill={getFill('corpo')} stroke={INK} strokeWidth="3.5" />
              <rect
                x="190"
                y="76"
                width="40"
                height="148"
                rx="20"
                fill={getFill('corpo')}
                stroke={INK}
                strokeWidth="5"
              />
              {/* Happy Butterfly Face */}
              <circle cx="202" cy="100" r="4" fill={INK} />
              <circle cx="218" cy="100" r="4" fill={INK} />
              <path d="M201 112C206 118 214 118 219 112" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      </section>

      {/* Bottom 5 Big Paint Color Buttons */}
      <section aria-label="Escolha uma cor" className="flex items-center justify-center gap-2.5 sm:gap-5 shrink-0">
        {PALETTE.map((swatch) => {
          const isSelected = selectedColor.id === swatch.id;
          return (
            <button
              key={swatch.id}
              type="button"
              onClick={() => handleSelectColor(swatch)}
              aria-label={`Cor ${swatch.name}`}
              aria-pressed={isSelected}
              style={{ backgroundColor: swatch.hex }}
              className={`toddler-btn w-12 h-12 sm:w-16 sm:h-16 rounded-full border-[4px] border-[#4A2E1B] shadow-md cursor-pointer transition-transform ${
                isSelected ? 'scale-120 ring-4 ring-white shadow-xl -translate-y-1' : 'hover:scale-105'
              }`}
            />
          );
        })}
      </section>
    </main>
  );
};
