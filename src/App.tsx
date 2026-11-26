/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { TopBar } from './components/TopBar';
import { HomeMenu } from './components/HomeMenu';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { ToysGame } from './games/ToysGame';
import { ColorsSnackGame } from './games/ColorsSnackGame';
import { HideSeekBubblesGame } from './games/HideSeekBubblesGame';
import { ParkPuzzleGame } from './games/ParkPuzzleGame';
import { BalloonsGame } from './games/BalloonsGame';
import { AnimalSoundsGame } from './games/AnimalSoundsGame';
import { MemoryGame } from './games/MemoryGame';
import { XylophoneGame } from './games/XylophoneGame';
import { CatBathGame } from './games/CatBathGame';
import { CountStarsGame } from './games/CountStarsGame';
import { ColoringGame } from './games/ColoringGame';
import { DressUpGame } from './games/DressUpGame';
import { GardenFlowersGame } from './games/GardenFlowersGame';
import { ShapesTrainGame } from './games/ShapesTrainGame';
import { createEmptyStarsMap, GAME_BY_ID, GameId } from './types/game';
import { soundEngine } from './utils/audio';
import { pickVariedPhrase } from './utils/phrases';

const STORAGE_KEY = 'caillou-dia-de-brincar-stars-v1';

export default function App() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [gameRunKey, setGameRunKey] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });

  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const MUSIC_STEPS = [0, 0.35, 0.65, 1];
  const [musicStepIndex, setMusicStepIndex] = useState(2); // Default medium-soft (0.65)
  const [lastNonZeroMusicStep, setLastNonZeroMusicStep] = useState(2);
  const musicVolume = MUSIC_STEPS[musicStepIndex];

  const [completedGames, setCompletedGames] = useState<Record<GameId, number>>(() => {
    const defaults = createEmptyStarsMap();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Record<GameId, number>>;
        return { ...defaults, ...parsed };
      }
    } catch {
      // ignore storage access issues
    }
    return defaults;
  });

  useEffect(() => {
    soundEngine.sfxEnabled = sfxEnabled;
  }, [sfxEnabled]);

  useEffect(() => {
    soundEngine.voiceEnabled = voiceEnabled;
    if (!voiceEnabled) {
      soundEngine.stopSpeech();
    }
  }, [voiceEnabled]);

  useEffect(() => {
    soundEngine.setMusicVolume(musicVolume);
  }, [musicVolume]);

  // Play gentle looping ambient soundtrack during active games
  useEffect(() => {
    if (activeGame !== null) {
      soundEngine.startMusic();
    } else {
      soundEngine.stopMusic();
    }
    return () => {
      soundEngine.stopMusic();
    };
  }, [activeGame]);

  const handleProgress = useCallback((current: number, total: number) => {
    setProgress({ current, total });
  }, []);

  const handleSelectGame = (game: GameId) => {
    setShowCelebration(false);
    setProgress({ current: 0, total: 0 });
    setActiveGame(game);
    setGameRunKey((k) => k + 1);
  };

  const handleGoHome = () => {
    soundEngine.playPop(0.95);
    soundEngine.stopSpeech();
    setShowCelebration(false);
    setActiveGame(null);
    setProgress({ current: 0, total: 0 });
  };

  const handleComplete = useCallback(() => {
    if (!activeGame) return;
    const meta = GAME_BY_ID[activeGame];
    setShowCelebration(true);
    soundEngine.playCelebration();
    soundEngine.speak(
      pickVariedPhrase(`celebrate-${activeGame}`, meta.celebrationSpeeches),
      'celebration',
    );

    setCompletedGames((prev) => {
      const updated = { ...prev, [activeGame]: (prev[activeGame] || 0) + 1 };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }, [activeGame]);

  const handlePlayAgain = () => {
    soundEngine.playPop(1.1);
    setShowCelebration(false);
    setProgress({ current: 0, total: 0 });
    setGameRunKey((k) => k + 1);
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    soundEngine.sfxEnabled = next;
    if (next) {
      soundEngine.playPop(1.2);
    }
  };

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    soundEngine.voiceEnabled = next;
    soundEngine.playPop(1.05);
    if (next) {
      soundEngine.speak('Voz ligada! Vamos brincar!', 'cheerful');
    } else {
      soundEngine.stopSpeech();
    }
  };

  const handleDecreaseMusic = () => {
    const nextIdx = Math.max(0, musicStepIndex - 1);
    setMusicStepIndex(nextIdx);
    if (nextIdx > 0) setLastNonZeroMusicStep(nextIdx);
    soundEngine.setMusicVolume(MUSIC_STEPS[nextIdx]);
    if (nextIdx > 0 && activeGame === null) {
      soundEngine.playMusicPreviewNote();
    }
  };

  const handleIncreaseMusic = () => {
    const nextIdx = Math.min(MUSIC_STEPS.length - 1, musicStepIndex + 1);
    setMusicStepIndex(nextIdx);
    setLastNonZeroMusicStep(nextIdx);
    soundEngine.setMusicVolume(MUSIC_STEPS[nextIdx]);
    if (activeGame === null) {
      soundEngine.playMusicPreviewNote();
    }
  };

  const handleToggleMusic = () => {
    if (musicStepIndex > 0) {
      setLastNonZeroMusicStep(musicStepIndex);
      setMusicStepIndex(0);
      soundEngine.setMusicVolume(0);
    } else {
      const restored = lastNonZeroMusicStep > 0 ? lastNonZeroMusicStep : 2;
      setMusicStepIndex(restored);
      soundEngine.setMusicVolume(MUSIC_STEPS[restored]);
      if (activeGame === null) {
        soundEngine.playMusicPreviewNote();
      }
    }
  };

  const renderActiveGame = () => {
    if (!activeGame) return null;
    const key = `${activeGame}-${gameRunKey}`;
    const commonProps = { onProgress: handleProgress, onComplete: handleComplete };

    switch (activeGame) {
      case 'brinquedos':
        return <ToysGame key={key} {...commonProps} />;
      case 'cores':
        return <ColorsSnackGame key={key} {...commonProps} />;
      case 'esconde':
        return <HideSeekBubblesGame key={key} {...commonProps} />;
      case 'quebra-cabeca':
        return <ParkPuzzleGame key={key} {...commonProps} />;
      case 'baloes':
        return <BalloonsGame key={key} {...commonProps} />;
      case 'animais':
        return <AnimalSoundsGame key={key} {...commonProps} />;
      case 'memoria':
        return <MemoryGame key={key} {...commonProps} />;
      case 'xilofone':
        return <XylophoneGame key={key} {...commonProps} />;
      case 'banho':
        return <CatBathGame key={key} {...commonProps} />;
      case 'contar':
        return <CountStarsGame key={key} {...commonProps} />;
      case 'pintar':
        return <ColoringGame key={key} {...commonProps} />;
      case 'vestir':
        return <DressUpGame key={key} {...commonProps} />;
      case 'jardim':
        return <GardenFlowersGame key={key} {...commonProps} />;
      case 'trem':
        return <ShapesTrainGame key={key} {...commonProps} />;
    }
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full max-w-full overflow-hidden flex flex-col bg-gradient-to-b from-[#BDE8FF] via-[#E8F7FF] to-[#FFF9E8]">
      <TopBar
        isHome={activeGame === null}
        gameTitle={activeGame ? GAME_BY_ID[activeGame].title : undefined}
        progressCurrent={progress.current}
        progressTotal={progress.total}
        sfxEnabled={sfxEnabled}
        voiceEnabled={voiceEnabled}
        musicVolume={musicVolume}
        onGoHome={handleGoHome}
        onToggleSfx={handleToggleSfx}
        onToggleVoice={handleToggleVoice}
        onDecreaseMusic={handleDecreaseMusic}
        onIncreaseMusic={handleIncreaseMusic}
        onToggleMusic={handleToggleMusic}
      />

      {activeGame === null ? (
        <HomeMenu completedGames={completedGames} onSelectGame={handleSelectGame} />
      ) : (
        renderActiveGame()
      )}

      {showCelebration && activeGame && (
        <CelebrationOverlay
          title={GAME_BY_ID[activeGame].celebrationTitle}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}
