export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  LEVEL_TRANSITION = 'LEVEL_TRANSITION',
  GAME_OVER = 'GAME_OVER',
  OPTIONS = 'OPTIONS',
  TUTORIAL = 'TUTORIAL'
}

export interface PlayerEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  color: string;
  facing: number; // 1 for right, -1 for left
}

export interface PlatformEntity {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'platform' | 'hazard' | 'finish' | 'jump_pad';
}

export interface EnemyEntity {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  patrolStartX: number;
  patrolEndX: number;
  startY?: number;
  type: 'patrol' | 'seeker' | 'floater';
  color: string;
}

export interface CollectibleEntity {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'coin' | 'health';
  color: string;
  collected: boolean;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface GameStats {
  score: number;
  distance: number;
  coins: number;
  health: number;
  maxHealth: number;
  level: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  apply: (stats: GameStats) => GameStats;
}
