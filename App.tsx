import React, { useState, useEffect, useRef } from 'react';
import GameCanvas from './components/GameCanvas';
import MainMenu from './components/MainMenu';
import HUD from './components/HUD';
import Button from './components/Button';
import UpgradeScreen from './components/UpgradeScreen';
import { GameState, GameStats, Upgrade } from './types';
import { GAME_CONFIG } from './constants';

// Placeholder Audio URLs (Replace with your own assets for production)
const AUDIO_SOURCES = {
  MENU: "https://assets.mixkit.co/music/preview/mixkit-adventure-arcade-game-opener-257.mp3", 
  PLAYING: "https://assets.mixkit.co/music/preview/mixkit-jungle-game-theme-256.mp3",
  GAME_OVER: "https://assets.mixkit.co/music/preview/mixkit-arcade-retro-game-over-213.mp3"
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    distance: 0,
    coins: 0,
    health: GAME_CONFIG.START_HEALTH,
    maxHealth: GAME_CONFIG.START_HEALTH,
    level: 1
  });
  
  // Audio Refs
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<string | null>(null);

  // Audio Management System
  useEffect(() => {
    const playMusic = async (trackUrl: string, loop: boolean = true) => {
      // If the requested track is already playing, do nothing
      if (currentTrackRef.current === trackUrl && bgmRef.current && !bgmRef.current.paused) return;

      // Stop current
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }

      // Create new audio
      const audio = new Audio(trackUrl);
      audio.loop = loop;
      audio.volume = 0.4; 
      bgmRef.current = audio;
      currentTrackRef.current = trackUrl;

      try {
        await audio.play();
      } catch (e) {
        console.warn("Autoplay blocked. User interaction required.", e);
      }
    };

    switch (gameState) {
      case GameState.MENU:
      case GameState.OPTIONS:
        playMusic(AUDIO_SOURCES.MENU);
        break;
      case GameState.TUTORIAL:
      case GameState.PLAYING:
      case GameState.LEVEL_TRANSITION:
        // Keep playing 'PLAYING' music during transitions, or switch if coming from menu
        if (currentTrackRef.current !== AUDIO_SOURCES.PLAYING) {
             playMusic(AUDIO_SOURCES.PLAYING);
        }
        break;
      case GameState.PAUSED:
        if (bgmRef.current) bgmRef.current.volume = 0.1; // Lower volume when paused
        break;
      case GameState.GAME_OVER:
        playMusic(AUDIO_SOURCES.GAME_OVER, false);
        break;
    }

    // Restore volume if resuming from pause
    if (gameState === GameState.PLAYING && bgmRef.current) {
        bgmRef.current.volume = 0.4;
    }

    return () => {
       // Cleanup optional
    };
  }, [gameState]);

  // Handle Pause
  const togglePause = () => {
    if (gameState === GameState.PLAYING) setGameState(GameState.PAUSED);
    else if (gameState === GameState.PAUSED) setGameState(GameState.PLAYING);
  };

  // Handle Level Transition / Upgrade Selection
  const handleUpgradeSelect = (upgrade: Upgrade) => {
    setStats(prev => upgrade.apply(prev));
    setGameState(GameState.PLAYING);
  };

  const restartGame = () => {
      setStats({
          score: 0,
          distance: 0,
          coins: 0,
          health: GAME_CONFIG.START_HEALTH,
          maxHealth: GAME_CONFIG.START_HEALTH,
          level: 1
      });
      setGameState(GameState.PLAYING);
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-black">
      {/* Game Container maintaining Aspect Ratio */}
      <div 
        className="relative overflow-hidden shadow-2xl"
        style={{ 
          width: '100%', 
          maxWidth: `${GAME_CONFIG.CANVAS_WIDTH}px`,
          aspectRatio: `${GAME_CONFIG.CANVAS_WIDTH}/${GAME_CONFIG.CANVAS_HEIGHT}`
        }}
      >
        {/* Render Logic based on State */}
        {gameState === GameState.MENU && (
          <MainMenu setGameState={setGameState} />
        )}

        {(gameState === GameState.PLAYING || 
          gameState === GameState.PAUSED || 
          gameState === GameState.LEVEL_TRANSITION || 
          gameState === GameState.GAME_OVER ||
          gameState === GameState.TUTORIAL) && (
          <GameCanvas 
            gameState={gameState} 
            setGameState={setGameState} 
            setStats={setStats}
            stats={stats}
          />
        )}

        {/* Overlays */}
        {(gameState === GameState.PLAYING || gameState === GameState.TUTORIAL) && (
             <HUD stats={stats} gameState={gameState} onPause={togglePause} />
        )}

        {gameState === GameState.PAUSED && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
            <h2 className="text-5xl font-[Luckiest_Guy] mb-8 text-[#F8F8F2]">PAUSED</h2>
            <div className="flex flex-col gap-4">
              <Button label="RESUME" onClick={() => setGameState(GameState.PLAYING)} />
              <Button label="QUIT TO MENU" onClick={() => setGameState(GameState.MENU)} variant="secondary" />
            </div>
          </div>
        )}

        {gameState === GameState.LEVEL_TRANSITION && (
            <UpgradeScreen onSelectUpgrade={handleUpgradeSelect} />
        )}

        {gameState === GameState.GAME_OVER && (
          <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center z-50">
             <h2 className="text-6xl font-[Luckiest_Guy] mb-4 text-[#F8F8F2] drop-shadow-md">GAME OVER</h2>
             <p className="text-2xl mb-8 text-orange-300">Distance Reached: {stats.distance}m</p>
             <div className="flex gap-4">
                <Button label="TRY AGAIN" onClick={restartGame} variant="primary" />
                <Button label="MENU" onClick={() => setGameState(GameState.MENU)} variant="secondary" />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;