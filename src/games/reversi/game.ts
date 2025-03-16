import { Game } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { Board, Player, BOARD_SIZE } from './types';
import { isValidMove, makeMove, hasValidMove } from './utils/gameLogic';

export interface ReversiState {
  board: Board;
  lastMove: { row: number; col: number } | null;
}

export const ReversiGame: Game<ReversiState> = {
  setup: () => {
    const board: Board = Array(BOARD_SIZE).fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));
    
    const mid = BOARD_SIZE / 2;
    board[mid - 1][mid - 1] = 'white';
    board[mid - 1][mid] = 'black';
    board[mid][mid - 1] = 'black';
    board[mid][mid] = 'white';

    return {
      board,
      lastMove: null
    };
  },

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    makeMove: ({ G, playerID }, row: number, col: number) => {
      const currentPlayer = playerID === '0' ? 'black' : 'white';
      
      if (!isValidMove(row, col, currentPlayer, G.board)) {
        return INVALID_MOVE;
      }

      const newBoard = makeMove(row, col, currentPlayer, G.board);
      return {
        ...G,
        board: newBoard,
        lastMove: { row, col }
      };
    },

    skipTurn: ({ G, playerID }) => {
      const currentPlayer = playerID === '0' ? 'black' : 'white';
      if (hasValidMove(G.board, currentPlayer)) {
        return INVALID_MOVE;
      }
      return { ...G };
    }
  },

  endIf: ({ G }) => {
    const blackHasMove = hasValidMove(G.board, 'black');
    const whiteHasMove = hasValidMove(G.board, 'white');

    if (!blackHasMove && !whiteHasMove) {
      let black = 0;
      let white = 0;
      G.board.forEach(row => {
        row.forEach(cell => {
          if (cell === 'black') black++;
          if (cell === 'white') white++;
        });
      });
      
      if (black > white) return { winner: '0' };
      if (white > black) return { winner: '1' };
      return { draw: true };
    }
  },

  ai: {
    enumerate: (G) => {
      const moves = [];
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (G.board[i][j] === null) {
            moves.push({ move: 'makeMove', args: [i, j] });
          }
        }
      }
      return moves;
    },
  },
}; 