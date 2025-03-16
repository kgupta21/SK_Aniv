import React, { useState, useEffect } from 'react';
import { GameLayout } from '../../components/GameLayout';
import { ReversiBoard } from './components/ReversiBoard';
import { DifficultySelector } from '../minesweeper/components/DifficultySelector';
import { ReversiStats } from './components/ReversiStats';
import { Board, Player, BOARD_SIZE, AI_DEPTH, Difficulty, Cell } from './types';
import { isValidMove, makeMove, hasValidMove } from './utils/gameLogic';
import { minimax } from './utils/ai';
import { useReversiStats } from './hooks/useReversiStats';
import { BarChart, RotateCcw } from 'lucide-react';

const createInitialBoard = (): Board => {
  const newBoard: Board = Array(BOARD_SIZE).fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
  
  const mid = BOARD_SIZE / 2;
  newBoard[mid - 1][mid - 1] = 'white';
  newBoard[mid - 1][mid] = 'black';
  newBoard[mid][mid - 1] = 'black';
  newBoard[mid][mid] = 'white';
  
  return newBoard;
};

export function Reversi() {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>('medium');
  const [gameOver, setGameOver] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { updateStats } = useReversiStats();

  const initializeBoard = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer('black');
    setGameOver(false);
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const getScore = () => {
    let black = 0;
    let white = 0;
    board.forEach((row: Cell[]) => {
      row.forEach((cell: Cell) => {
        if (cell === 'black') black++;
        if (cell === 'white') white++;
      });
    });
    return { black, white };
  };

  const checkGameOver = (currentBoard: Board) => {
    const blackHasMove = hasValidMove(currentBoard, 'black');
    const whiteHasMove = hasValidMove(currentBoard, 'white');

    if (!blackHasMove && !whiteHasMove) {
      const { black: playerScore, white: aiScore } = getScore();
      const result = playerScore > aiScore ? 'win' : 
                    aiScore > playerScore ? 'loss' : 
                    'tie';
      updateStats(result, aiDifficulty);
      setGameOver(true);
      return true;
    }
    return false;
  };

  const handleMove = async (row: number, col: number) => {
    if (gameOver || currentPlayer === 'white') return;
    
    if (!isValidMove(row, col, currentPlayer, board)) return;

    const newBoard = makeMove(row, col, currentPlayer, board);
    setBoard(newBoard);

    if (checkGameOver(newBoard)) return;

    setCurrentPlayer('white');

    // AI move
    setTimeout(() => {
      const [_, aiMove] = minimax(
        newBoard,
        AI_DEPTH[aiDifficulty as keyof typeof AI_DEPTH],
        -Infinity,
        Infinity,
        true,
        'white'
      );

      if (aiMove) {
        const [aiRow, aiCol] = aiMove;
        const finalBoard = makeMove(aiRow, aiCol, 'white', newBoard);
        setBoard(finalBoard);
        
        if (!checkGameOver(finalBoard)) {
          setCurrentPlayer('black');
        }
      } else {
        // If AI has no valid moves, check if game is over
        checkGameOver(newBoard);
      }
    }, 500);
  };

  const canPlayerMove = (currentBoard: Board, player: Player) => {
    return hasValidMove(currentBoard, player);
  };

  const handleSkipTurn = () => {
    if (currentPlayer === 'white' || gameOver) return;
    setCurrentPlayer('white');
    
    // AI's turn after skip
    setTimeout(() => {
      const [_, aiMove] = minimax(
        board,
        AI_DEPTH[aiDifficulty as keyof typeof AI_DEPTH],
        -Infinity,
        Infinity,
        true,
        'white'
      );

      if (aiMove) {
        const [aiRow, aiCol] = aiMove;
        const finalBoard = makeMove(aiRow, aiCol, 'white', board);
        setBoard(finalBoard);
        
        if (!checkGameOver(finalBoard)) {
          setCurrentPlayer('black');
        }
      } else {
        checkGameOver(board);
      }
    }, 500);
  };

  return (
    <GameLayout title="Reversi">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            <DifficultySelector 
              difficulty={aiDifficulty} 
              onSelect={(diff) => {
                setAiDifficulty(diff as Difficulty);
                initializeBoard();
              }}
            />
            <button
              onClick={initializeBoard}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          </div>
          <button
            onClick={() => setShowStats(true)}
            className="p-2 text-white hover:text-purple-200 transition-colors"
            title="Show Statistics"
          >
            <BarChart size={24} />
          </button>
        </div>

        <ReversiBoard
          board={board}
          currentPlayer={currentPlayer}
          onMove={handleMove}
        />

        {currentPlayer === 'black' && !gameOver && !canPlayerMove(board, 'black') && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSkipTurn}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Skip Turn (No Valid Moves)
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-center space-x-8 text-white">
          <div>Black (You): {getScore().black}</div>
          <div>White (AI): {getScore().white}</div>
        </div>

        {gameOver && (
          <div className="mt-6 text-center">
            <p className="text-xl text-white mb-4">
              Game Over! {
                getScore().black > getScore().white
                  ? 'You win!'
                  : getScore().black < getScore().white
                    ? 'AI wins!'
                    : "It's a tie!"
              }
            </p>
            <button
              onClick={initializeBoard}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

        <ReversiStats 
          isVisible={showStats}
          onClose={() => setShowStats(false)}
        />
      </div>
    </GameLayout>
  );
}

export default Reversi;