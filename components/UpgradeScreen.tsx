import React from 'react';
import { GameStats, Upgrade } from '../types';
import Button from './Button';
import { COLORS } from '../constants';

interface UpgradeScreenProps {
  onSelectUpgrade: (upgrade: Upgrade) => void;
}

const SAMPLE_UPGRADES: Upgrade[] = [
  {
    id: 'health_up',
    name: 'Hearty Breakfast',
    description: 'Increase Max Health by 1',
    cost: 0,
    icon: '❤️',
    apply: (stats) => ({ ...stats, maxHealth: stats.maxHealth + 1, health: stats.health + 1 })
  },
  {
    id: 'double_jump',
    name: 'Feather Weight',
    description: 'Restore Health completely',
    cost: 0,
    icon: '🪶',
    apply: (stats) => ({ ...stats, health: stats.maxHealth })
  },
  {
    id: 'coin_magnet',
    name: 'Sticky Fingers',
    description: 'Gain 50 bonus coins immediately',
    cost: 0,
    icon: '🧲',
    apply: (stats) => ({ ...stats, coins: stats.coins + 50 })
  }
];

const UpgradeScreen: React.FC<UpgradeScreenProps> = ({ onSelectUpgrade }) => {
  return (
    <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-8">
      <h2 className="text-4xl mb-2 text-[#F8F8F2]">LEVEL COMPLETE!</h2>
      <p className="text-xl mb-12 text-[#7ED321]">Choose your mutation</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {SAMPLE_UPGRADES.map(upgrade => (
          <div 
            key={upgrade.id}
            className="bg-[#2C3E50] border-2 border-[#8B4513] rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200 cursor-pointer shadow-xl hover:shadow-[#7ED321]/20"
            onClick={() => onSelectUpgrade(upgrade)}
          >
            <div className="text-6xl mb-4">{upgrade.icon}</div>
            <h3 className="text-2xl font-bold mb-2 text-[#FF8C00]">{upgrade.name}</h3>
            <p className="text-center text-[#F8F8F2] mb-6">{upgrade.description}</p>
            <Button label="SELECT" onClick={() => onSelectUpgrade(upgrade)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpgradeScreen;