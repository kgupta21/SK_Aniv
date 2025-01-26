import React, { useEffect, useRef } from 'react';
import { GameLayout } from '../../components/GameLayout';
import { usePlatformer } from './hooks/usePlatformer';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './types';

export default function Platformer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, handleKeyDown, handleKeyUp } = usePlatformer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw sky background
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw player
      ctx.fillStyle = '#ff4';
      ctx.fillRect(
        gameState.player.x,
        gameState.player.y,
        gameState.player.width,
        gameState.player.height
      );

      // Draw platforms
      ctx.fillStyle = '#4a2';
      gameState.platforms.forEach((platform: any) => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      });

      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${gameState.score}`, 10, 30);

      // Draw game over message if needed
      if (gameState.isGameOver) {
        ctx.fillStyle = '#00000088';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.fillStyle = '#ff4444';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
        
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Your Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.fillText('Press SPACE to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
      }

      requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, handleKeyDown, handleKeyUp]);

  return (
    <GameLayout title="Platformer">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block mx-auto bg-sky-300 border-2 border-white shadow-lg"
          />
          <div className="absolute top-4 left-0 w-full text-center text-white text-lg pointer-events-none">
            Use [SPACE] or [UP ARROW] to jump!
          </div>
        </div>
      </div>
    </GameLayout>
  );
} 