import React from 'react';
import Button from './Button';
import { COLORS } from '../constants';
import { GameState } from '../types';

interface MainMenuProps {
  setGameState: (state: GameState) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ setGameState }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-cover bg-center"
         style={{ backgroundColor: COLORS.NEUTRAL_DARK, backgroundImage: 'linear-gradient(rgba(44, 62, 80, 0.9), rgba(44, 62, 80, 0.9)), url(https://picsum.photos/1280/720?grayscale)' }}>
      
      {/* Logo Area */}
      <div className="mb-12 text-center animate-bounce">
        <h1 className="text-8xl drop-shadow-lg" style={{ color: COLORS.PRIMARY_GREEN, textShadow: '4px 4px 0px #000' }}>
          GECKO
        </h1>
        <p className="text-xl mt-2 tracking-widest text-orange-400 font-bold">ROGUELITE PLATFORMER</p>
      </div>

      {/* Menu Options */}
      <div className="flex flex-col gap-4 w-64">
        <Button 
          label="PLAY GAME" 
          onClick={() => setGameState(GameState.PLAYING)} 
          variant="primary"
        />
        <Button 
          label="TUTORIAL" 
          onClick={() => setGameState(GameState.TUTORIAL)} 
          variant="secondary"
        />
        <Button 
          label="OPTIONS" 
          onClick={() => alert("Options not implemented in prototype")} 
          variant="secondary"
        />
        <Button 
          label="CREDITS" 
          onClick={() => alert("Created by the best React Engineer")} 
          variant="secondary"
        />
      </div>

      <div className="absolute bottom-4 text-sm opacity-50">
        v0.1.0-alpha
      </div>
    </div>
  );
};

export default MainMenu;