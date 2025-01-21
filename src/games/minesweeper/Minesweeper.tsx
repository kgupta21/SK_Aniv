import React, { useState, useEffect } from 'react';
import { GameLayout } from '../../components/GameLayout';
import { MinesweeperCell } from './components/MinesweeperCell';
import { DifficultySelector } from './components/DifficultySelector';
import { Cell, Difficulty, DIFFICULTIES } from './types';
import { useUser } from '../../context/UserContext';
import { RotateCcw } from 'lucide-react';

export default function Minesweeper() {
  const { addScore } = useUser();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [firstMove, setFirstMove] = useState(true);

  const initializeBoard = () => {
    const { rows, cols, mines } = DIFFICULTIES[difficulty];
    const newBoard: Cell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols) {
                if (newBoard[row + i][col + j].isMine) count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setFirstMove(true);
  };

  useEffect(() => {
    initializeBoard();
  }, [difficulty]);

  const revealCell = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isFlagged || board[row][col].isRevealed) return;

    const newBoard = [...board.map(row => [...row])];
    
    if (board[row][col].isMine) {
      // Game over - reveal all mines
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
          if (board[i][j].isMine) {
            newBoard[i][j].isRevealed = true;
          }
        }
      }
      setBoard(newBoard);
      setGameOver(true);
      if (!firstMove) {
        addScore('minesweeper', 0);
      }
      return;
    }

    const revealEmpty = (r: number, c: number) => {
      if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
      if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) return;

      newBoard[r][c].isRevealed = true;

      if (newBoard[r][c].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealEmpty(r + i, c + j);
          }
        }
      }
    };

    revealEmpty(row, col);
    setBoard(newBoard);
    setFirstMove(false);

    // Check for win
    let unrevealedSafeCells = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (!board[i][j].isMine && !newBoard[i][j].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }
    if (unrevealedSafeCells === 0) {
      setGameWon(true);
      addScore('minesweeper', 100);
    }
  };

  const toggleFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver || gameWon || board[row][col].isRevealed) return;

    const newBoard = [...board.map(row => [...row])];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  };

  return (
    <GameLayout title="Minesweeper">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <DifficultySelector 
            difficulty={difficulty} 
            onSelect={(diff) => {
              setDifficulty(diff);
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

        <div 
          className="grid gap-1 bg-purple-900/30 p-4 rounded-lg mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${DIFFICULTIES[difficulty].cols}, minmax(0, 1fr))`,
            maxWidth: `${DIFFICULTIES[difficulty].cols * 2.5}rem`
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <MinesweeperCell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                onReveal={() => revealCell(rowIndex, colIndex)}
                onFlag={(e) => toggleFlag(rowIndex, colIndex, e)}
              />
            ))
          )}
        </div>

        {(gameOver || gameWon) && (
          <div className="mt-8 text-center">
            <p className="text-xl text-white mb-4">
              {gameWon ? 'Congratulations! You won!' : 'Game Over!'}
            </p>
            <button
              onClick={initializeBoard}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
}