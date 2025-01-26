import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, Platform, CANVAS_HEIGHT, CANVAS_WIDTH, PLATFORM_MIN_WIDTH, PLATFORM_MAX_WIDTH, PLATFORM_HEIGHT, INITIAL_GAME_SPEED, SPAWN_INTERVAL } from '../types';
import { useUser } from '../../../context/UserContext';

const INITIAL_PLAYER: Player = {
  x: 100,
  y: CANVAS_HEIGHT - 50,
  width: 30,
  height: 30,
  vy: 0,
  jumpForce: 10,
  gravity: 0.6
};

export function usePlatformer() {
  const { addScore } = useUser();
  const [gameState, setGameState] = useState<GameState>({
    player: { ...INITIAL_PLAYER },
    platforms: [{
      x: 0,
      y: CANVAS_HEIGHT - 10,
      width: CANVAS_WIDTH,
      height: 10
    }],
    score: 0,
    gameSpeed: INITIAL_GAME_SPEED,
    isGameOver: false
  });

  const [keys, setKeys] = useState({
    space: false,
    arrowUp: false
  });

  const resetGame = useCallback(() => {
    setGameState({
      player: { ...INITIAL_PLAYER },
      platforms: [{
        x: 0,
        y: CANVAS_HEIGHT - 10,
        width: CANVAS_WIDTH,
        height: 10
      }],
      score: 0,
      gameSpeed: INITIAL_GAME_SPEED,
      isGameOver: false
    });
  }, []);

  const spawnPlatform = useCallback(() => {
    const width = Math.floor(Math.random() * (PLATFORM_MAX_WIDTH - PLATFORM_MIN_WIDTH + 1)) + PLATFORM_MIN_WIDTH;
    const y = Math.floor(Math.random() * (CANVAS_HEIGHT / 2)) + CANVAS_HEIGHT / 2 - 30;
    
    return {
      x: CANVAS_WIDTH + 50,
      y,
      width,
      height: PLATFORM_HEIGHT
    };
  }, []);

  const isOnPlatform = useCallback((player: Player, platforms: Platform[]): boolean => {
    const playerBottom = player.y + player.height;
    return platforms.some(platform => {
      return player.x < platform.x + platform.width &&
             player.x + player.width > platform.x &&
             Math.abs(playerBottom - platform.y) < 2 &&
             player.vy >= 0;
    });
  }, []);

  const updateGame = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState((prevState: any) => {
      // Update player velocity and position
      let newVy = prevState.player.vy;
      if ((keys.space || keys.arrowUp) && isOnPlatform(prevState.player, prevState.platforms)) {
        newVy = -prevState.player.jumpForce;
      }
      newVy += prevState.player.gravity;

      const newPlayer = {
        ...prevState.player,
        y: prevState.player.y + newVy,
        vy: newVy
      };

      // Update platforms
      const newPlatforms = prevState.platforms
        .map((platform: any) => ({
          ...platform,
          x: platform.x - prevState.gameSpeed
        }))
        .filter((platform: any) => platform.x + platform.width > 0);

      // Spawn new platform
      if (prevState.score % SPAWN_INTERVAL === 0) {
        newPlatforms.push(spawnPlatform());
      }

      // Check if player fell off
      const isGameOver = newPlayer.y > CANVAS_HEIGHT;

      if (isGameOver) {
        addScore('platformer', prevState.score);
      }

      // Increase game speed gradually
      const newGameSpeed = prevState.gameSpeed + (prevState.score % 1000 === 0 ? 0.5 : 0);

      return {
        ...prevState,
        player: newPlayer,
        platforms: newPlatforms,
        score: isGameOver ? prevState.score : prevState.score + 1,
        gameSpeed: newGameSpeed,
        isGameOver
      };
    });
  }, [gameState.isGameOver, keys, isOnPlatform, spawnPlatform, addScore]);

  useEffect(() => {
    const gameLoop = setInterval(updateGame, 1000 / 60);
    return () => clearInterval(gameLoop);
  }, [updateGame]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState.isGameOver && (e.code === 'Space' || e.code === 'ArrowUp')) {
      resetGame();
      return;
    }

    if (e.code === 'Space' || e.code === 'ArrowUp') {
      setKeys((prev: any) => ({ ...prev, [e.code.toLowerCase()]: true }));
    }
  }, [gameState.isGameOver, resetGame]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      setKeys((prev: any) => ({ ...prev, [e.code.toLowerCase()]: false }));
    }
  }, []);

  return {
    gameState,
    handleKeyDown,
    handleKeyUp
  };
} 