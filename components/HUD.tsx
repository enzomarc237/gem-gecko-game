import React from 'react';
import { GameStats, GameState } from '../types';
import { COLORS } from '../constants';

interface HUDProps {
  stats: GameStats;
  gameState: GameState;
  onPause: () => void;
}

const HUD: React.FC<HUDProps> = ({ stats, gameState, onPause }) => {
  if (gameState !== GameState.PLAYING) return null;

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex justify-between items-start">
      {/* Health Bar */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          {Array.from({ length: stats.maxHealth }).map((_, i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full border-2 border-white transition-all ${i < stats.health ? 'bg-red-500 scale-100' : 'bg-transparent scale-90 opacity-50'}`}
            />
          ))}
        </div>
        <span className="text-sm font-bold tracking-wider">HEALTH</span>
      </div>

      {/* Score */}
      <div className="flex flex-col items-end">
        <div className="text-4xl font-[Luckiest_Guy]" style={{ color: COLORS.ACCENT_ORANGE, textShadow: '2px 2px 0 #000' }}>
            {stats.distance}m
        </div>
        <div className="text-sm font-bold flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
            {stats.coins}
        </div>
      </div>
      
      {/* Pause Button (Pointer events allowed) */}
      <button 
        onClick={onPause}
        className="pointer-events-auto absolute top-6 right-1/2 translate-x-1/2 p-2 hover:bg-white/10 rounded"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>
    </div>
  );
};

export default HUD;