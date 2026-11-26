import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CartoonStarIcon, ParkSceneContent } from '../components/CartoonArt';
import { soundEngine } from '../utils/audio';
import {
  GENTLE_RETRY,
  pickVariedPhrase,
  PUZZLE_PIECE_SUCCESS,
} from '../utils/phrases';

interface ParkPuzzleGameProps {
  onProgress: (done: number, total: number) => void;
  onComplete: () => void;
}

interface PieceDef {
  id: number; // 0: TL, 1: TR, 2: BL, 3: BR
  row: number;
  col: number;
  label: string;
  praise: string;
  path: string;
  viewBox: string;
}

/**
 * Classic 2x2 interlocking rounded jigsaw paths on a 400x400 park canvas.
 * Center cross is at (200, 200), tabs protrude by 34px for soft, chunky toddler-friendly shapes.
 */
const PIECES: PieceDef[] = [
  {
    id: 0,
    row: 0,
    col: 0,
    label: 'Sol e arco-íris',
    praise: 'Olha o sol brilhando!',
    // Top-left: right tab OUT, bottom tab OUT
    path: 'M 0 0 L 200 0 L 200 72 C 238 66 238 134 200 128 L 200 200 L 128 200 C 134 238 66 238 72 200 L 0 200 Z',
    viewBox: '0 0 240 240',
  },
  {
    id: 1,
    row: 0,
    col: 1,
    label: 'Árvore e passarinho',
    praise: 'Que árvore linda!',
    // Top-right: left blank IN, bottom tab OUT
    path: 'M 200 0 L 400 0 L 400 200 L 328 200 C 334 238 266 238 272 200 L 200 200 L 200 128 C 238 134 238 66 200 72 Z',
    viewBox: '160 0 240 240',
  },
  {
    id: 2,
    row: 1,
    col: 0,
    label: 'Menino e bola',
    praise: 'Muito bem! A bola no parque!',
    // Bottom-left: top blank IN, right tab OUT
    path: 'M 0 200 L 72 200 C 66 238 134 238 128 200 L 200 200 L 200 272 C 238 266 238 334 200 328 L 200 400 L 0 400 Z',
    viewBox: '0 160 240 240',
  },
  {
    id: 3,
    row: 1,
    col: 1,
    label: 'Gato e flores',
    praise: 'Eba! O gatinho nas flores!',
    // Bottom-right: top blank IN, left blank IN
    path: 'M 200 200 L 272 200 C 266 238 334 238 328 200 L 400 200 L 400 400 L 200 400 L 200 328 C 238 334 238 266 200 272 Z',
    viewBox: '160 160 240 240',
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

export const ParkPuzzleGame: React.FC<ParkPuzzleGameProps> = ({ onProgress, onComplete }) => {
  const trayPieces = useMemo(() => shuffle(PIECES), []);
  const [placed, setPlaced] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
  });
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [dragging, setDragging] = useState<{
    id: number;
    pointerId: number;
    startX: number;
    startY: number;
    dx: number;
    dy: number;
    nearTarget: boolean;
  } | null>(null);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    onProgress(0, PIECES.length);
    const timer = window.setTimeout(() => {
      soundEngine.speak('Vamos montar o quebra-cabeça do parque!', 'gentle');
      void soundEngine.prefetchPhrases([
        'Sol e arco-íris!',
        'Árvore e passarinho!',
        'Menino e bola!',
        'Gato e flores!',
      ]);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [onProgress]);

  const snapPiece = (pieceId: number) => {
    if (placed[pieceId] || completedRef.current) return;
    const nextPlaced = { ...placed, [pieceId]: true };
    const count = Object.values(nextPlaced).filter(Boolean).length;

    setPlaced(nextPlaced);
    setSelectedPiece(null);
    setDragging(null);

    soundEngine.playChime(count);
    soundEngine.playSparkle();
    const piecePool = PUZZLE_PIECE_SUCCESS[pieceId as 0 | 1 | 2 | 3];
    soundEngine.speak(pickVariedPhrase(`puzzle-ok-${pieceId}`, piecePool), 'celebration');
    onProgress(count, PIECES.length);

    if (count === PIECES.length) {
      completedRef.current = true;
      window.setTimeout(() => {
        onComplete();
      }, 1200);
    }
  };

  /**
   * Checks if the pointer is within generous magnetic snap range of the piece's target quadrant
   */
  const isNearQuadrant = (pieceId: number, clientX: number, clientY: number): boolean => {
    const board = boardRef.current;
    if (!board) return false;
    const piece = PIECES.find((p) => p.id === pieceId)!;
    const rect = board.getBoundingClientRect();
    const targetX = rect.left + (piece.col === 0 ? rect.width * 0.25 : rect.width * 0.75);
    const targetY = rect.top + (piece.row === 0 ? rect.height * 0.25 : rect.height * 0.75);
    const dist = Math.hypot(clientX - targetX, clientY - targetY);
    // Generous magnetic radius (~46% of board width) for 3-year-olds
    return dist < rect.width * 0.42;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, piece: PieceDef) => {
    if (placed[piece.id]) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    soundEngine.playPop(1.05);
    soundEngine.speak(piece.label);
    setSelectedPiece(piece.id);
    setDragging({
      id: piece.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0,
      nearTarget: false,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || dragging.pointerId !== e.pointerId) return;
    const dx = e.clientX - dragging.startX;
    const dy = e.clientY - dragging.startY;
    const nearTarget = isNearQuadrant(dragging.id, e.clientX, e.clientY);

    // Automatic magnetic snap as soon as piece gets close enough while dragging!
    if (nearTarget) {
      const board = boardRef.current;
      if (board) {
        const piece = PIECES.find((p) => p.id === dragging.id)!;
        const rect = board.getBoundingClientRect();
        const targetX = rect.left + (piece.col === 0 ? rect.width * 0.25 : rect.width * 0.75);
        const targetY = rect.top + (piece.row === 0 ? rect.height * 0.25 : rect.height * 0.75);
        const exactDist = Math.hypot(e.clientX - targetX, e.clientY - targetY);
        if (exactDist < rect.width * 0.26) {
          snapPiece(dragging.id);
          return;
        }
      }
    }

    setDragging({ ...dragging, dx, dy, nearTarget });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || dragging.pointerId !== e.pointerId) return;
    if (isNearQuadrant(dragging.id, e.clientX, e.clientY)) {
      snapPiece(dragging.id);
      return;
    }

    const moved = Math.hypot(dragging.dx, dragging.dy);
    if (moved > 40) {
      const board = boardRef.current;
      if (board) {
        const r = board.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          soundEngine.playBoing();
          soundEngine.speak(pickVariedPhrase('puzzle-retry', GENTLE_RETRY), 'gentle');
        }
      }
    }
    setDragging(null);
  };

  const handleBoardSlotTap = (pieceId: number) => {
    if (placed[pieceId]) return;
    if (selectedPiece === pieceId) {
      snapPiece(pieceId);
    } else if (selectedPiece !== null) {
      soundEngine.playBoing();
      soundEngine.speak(pickVariedPhrase('puzzle-retry', GENTLE_RETRY), 'gentle');
    } else {
      const p = PIECES.find((item) => item.id === pieceId)!;
      soundEngine.playPop(0.95);
      soundEngine.speak(`Aqui encaixa: ${p.label.toLowerCase()}!`, 'gentle');
    }
  };

  return (
    <main className="mobile-landscape-row relative flex-1 min-h-0 w-full max-w-full flex flex-col lg:flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-8 overflow-hidden touch-none px-3 pb-3 sm:px-8 sm:pb-6 bg-gradient-to-b from-[#DCFCE7] via-[#F0FDF4] to-[#BBF7D0]">
      {/* Left / Top: Wooden Park Puzzle Board */}
      <section className="relative z-10 flex items-center justify-center shrink-0">
        <div className="p-2 sm:p-3.5 rounded-[24px] sm:rounded-[34px] bg-[#E5A967] border-[4px] sm:border-[5px] border-[#4A2E1B] shadow-[0_8px_0_rgba(74,46,27,0.22)]">
          <div
            ref={boardRef}
            className="relative w-[min(78vw,46dvh)] h-[min(78vw,46dvh)] sm:w-[min(62vw,50dvh)] sm:h-[min(62vw,50dvh)] lg:w-[min(45vw,66dvh)] lg:h-[min(45vw,66dvh)] [@media(max-height:500px)_and_(min-width:520px)]:w-[min(42vw,70dvh)] [@media(max-height:500px)_and_(min-width:520px)]:h-[min(42vw,70dvh)] max-w-[390px] max-h-[390px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FFFDF5] border-[3px] sm:border-4 border-[#7C4A1D]"
          >
            {/* Full Unified SVG Board: Faint guide underneath + Snapped sharp pieces on top */}
            <svg viewBox="0 0 400 400" className="w-full h-auto max-w-full block">
              <defs>
                {PIECES.map((p) => (
                  <clipPath key={p.id} id={`board-clip-${p.id}`}>
                    <path d={p.path} />
                  </clipPath>
                ))}
              </defs>

              {/* Soft translucent ghost hint of the complete park scene */}
              <g opacity="0.28">
                <ParkSceneContent />
              </g>

              {/* Jigsaw Slot Outlines + Magnetic Glow Target */}
              {PIECES.map((p) => {
                const isMagneticGlow = dragging?.id === p.id && dragging.nearTarget;
                const isSelectedTarget = !dragging && selectedPiece === p.id && !placed[p.id];
                return (
                  <path
                    key={`outline-${p.id}`}
                    d={p.path}
                    fill={
                      isMagneticGlow
                        ? 'rgba(250, 204, 21, 0.45)'
                        : isSelectedTarget
                          ? 'rgba(250, 204, 21, 0.25)'
                          : 'transparent'
                    }
                    stroke={isMagneticGlow ? '#F59E0B' : '#7C4A1D'}
                    strokeWidth={isMagneticGlow ? '8' : '4'}
                    strokeDasharray={placed[p.id] ? undefined : '10 8'}
                    className="cursor-pointer"
                    onClick={() => handleBoardSlotTap(p.id)}
                  />
                );
              })}

              {/* Snapped Full-Color Pieces */}
              {PIECES.map(
                (p) =>
                  placed[p.id] && (
                    <g key={`placed-${p.id}`} clipPath={`url(#board-clip-${p.id})`}>
                      <ParkSceneContent />
                    </g>
                  ),
              )}

              {/* Crisp outline around placed pieces */}
              {PIECES.map(
                (p) =>
                  placed[p.id] && (
                    <path
                      key={`border-${p.id}`}
                      d={p.path}
                      fill="none"
                      stroke="#4A2E1B"
                      strokeWidth="3.5"
                      pointerEvents="none"
                    />
                  ),
              )}
            </svg>

            {/* Sparkle star when all 4 pieces are snapped */}
            {Object.values(placed).every(Boolean) && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center animate-pop-in">
                <CartoonStarIcon filled className="w-16 sm:w-20 h-auto drop-shadow-lg" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Right / Bottom: Tray of 4 Draggable Jigsaw Pieces */}
      <section className="relative z-20 w-full max-w-md lg:max-w-sm [@media(max-height:500px)_and_(min-width:520px)]:max-w-[260px] shrink-0">
        <div className="rounded-[24px] sm:rounded-[34px] bg-[#FFFDF5] border-[4px] sm:border-[5px] border-[#4A2E1B] shadow-md p-2 sm:p-4">
          <div className="grid grid-cols-4 lg:grid-cols-2 [@media(max-height:500px)_and_(min-width:520px)]:grid-cols-2 gap-2 sm:gap-4 items-center justify-items-center">
            {trayPieces.map((piece) => {
              const isPlaced = placed[piece.id];
              const isDraggingThis = dragging?.id === piece.id;
              const isSelected = selectedPiece === piece.id && !isDraggingThis;

              if (isPlaced) {
                return (
                  <div
                    key={piece.id}
                    className="w-[min(19vw,15dvh)] h-[min(19vw,15dvh)] sm:w-[min(16vw,16dvh)] sm:h-[min(16vw,16dvh)] lg:w-[min(14vw,22dvh)] lg:h-[min(14vw,22dvh)] [@media(max-height:500px)_and_(min-width:520px)]:w-[min(16vw,28dvh)] [@media(max-height:500px)_and_(min-width:520px)]:h-[min(16vw,28dvh)] max-w-[136px] max-h-[136px] rounded-xl sm:rounded-2xl bg-[#DCFCE7]/50 border-2 border-dashed border-[#86EFAC] flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <CartoonStarIcon filled className="w-7 sm:w-9 h-auto opacity-90" />
                  </div>
                );
              }

              return (
                <div
                  key={piece.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Peça: ${piece.label}`}
                  onPointerDown={(e) => handlePointerDown(e, piece)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      soundEngine.playPop();
                      soundEngine.speak(`${piece.label}!`, 'cheerful');
                      setSelectedPiece(piece.id);
                    }
                  }}
                  style={
                    isDraggingThis
                      ? {
                          transform: `translate3d(${dragging.dx}px, ${dragging.dy}px, 0) scale(1.22)`,
                          zIndex: 60,
                        }
                      : undefined
                  }
                  className={`touch-none flex items-center justify-center p-0.5 sm:p-1 rounded-xl sm:rounded-2xl cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15] w-[min(19vw,15dvh)] h-[min(19vw,15dvh)] sm:w-[min(16vw,16dvh)] sm:h-[min(16vw,16dvh)] lg:w-[min(14vw,22dvh)] lg:h-[min(14vw,22dvh)] [@media(max-height:500px)_and_(min-width:520px)]:w-[min(16vw,28dvh)] [@media(max-height:500px)_and_(min-width:520px)]:h-[min(16vw,28dvh)] max-w-[136px] max-h-[136px] ${
                    isDraggingThis
                      ? 'drop-shadow-[0_18px_16px_rgba(74,46,27,0.34)]'
                      : isSelected
                        ? 'bg-[#FEF9C3] ring-4 ring-[#F59E0B] scale-105'
                        : 'hover:scale-106'
                  }`}
                >
                  <svg
                    viewBox={piece.viewBox}
                    className="w-full h-auto max-w-full max-h-full pointer-events-none overflow-visible"
                  >
                    <defs>
                      <clipPath id={`tray-clip-${piece.id}`}>
                        <path d={piece.path} />
                      </clipPath>
                    </defs>
                    <g clipPath={`url(#tray-clip-${piece.id})`}>
                      <ParkSceneContent />
                    </g>
                    <path
                      d={piece.path}
                      fill="none"
                      stroke="#4A2E1B"
                      strokeWidth="6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
