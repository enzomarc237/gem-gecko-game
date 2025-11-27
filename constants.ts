// Color Palette from Design Brief
export const COLORS = {
  PRIMARY_GREEN: '#7ED321', // Gecko / Nature
  SECONDARY_BROWN: '#8B4513', // Earth / Platforms
  ACCENT_ORANGE: '#FF8C00', // Interaction / Gold
  ACCENT_DANGER: '#9B30FF', // Enemy / Hazard
  NEUTRAL_DARK: '#2C3E50', // UI Background
  NEUTRAL_LIGHT: '#F8F8F2', // Text
  SKY_BLUE: '#87CEEB', // Simple sky implementation
};

export const PHYSICS = {
  GRAVITY: 0.6,
  FRICTION: 0.85,
  MOVE_SPEED: 0.8,
  MAX_SPEED: 8,
  JUMP_FORCE: -14,
  DOUBLE_JUMP_FORCE: -12,
  DASH_SPEED: 15,
  DASH_DURATION: 10, // Frames (approx 160ms at 60fps)
  DASH_COOLDOWN: 60, // Frames (1 second)
  JUMP_PAD_FORCE: -22,
  WALL_JUMP_FORCE: { x: 10, y: -13 },
  WALL_SLIDE_SPEED: 2,
};

export const GAME_CONFIG = {
  CANVAS_WIDTH: 1280,
  CANVAS_HEIGHT: 720,
  TILE_SIZE: 40,
  PLAYER_WIDTH: 30,
  PLAYER_HEIGHT: 50,
  START_HEALTH: 3,
};
