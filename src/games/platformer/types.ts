export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  jumpForce: number;
  gravity: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameState {
  player: Player;
  platforms: Platform[];
  score: number;
  gameSpeed: number;
  isGameOver: boolean;
}

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;
export const PLATFORM_MIN_WIDTH = 50;
export const PLATFORM_MAX_WIDTH = 150;
export const PLATFORM_HEIGHT = 15;
export const INITIAL_GAME_SPEED = 3;
export const SPAWN_INTERVAL = 100; 