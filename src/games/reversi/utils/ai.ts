import { Board, Player, AIConfig, AI_DEPTH } from '../types';
import { isValidMove, makeMove } from './gameLogic';

export function evaluateBoard(board: Board, player: Player): number {
  let score = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === player) {
        if ((i === 0 || i === board.length - 1) && (j === 0 || j === board[0].length - 1)) {
          score += 10;
        } else if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
          score += 3;
        } else {
          score += 1;
        }
      }
    }
  }
  return score;
}

export function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  player: Player
): [number, [number, number] | null] {
  if (depth === 0) {
    return [evaluateBoard(board, player), null];
  }

  const moves: [number, number][] = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (isValidMove(i, j, player, board)) {
        moves.push([i, j]);
      }
    }
  }

  if (moves.length === 0) {
    return [evaluateBoard(board, player), null];
  }

  let bestMove: [number, number] | null = null;
  
  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const [row, col] of moves) {
      const newBoard = makeMove(row, col, player, board);
      const [evaluation] = minimax(
        newBoard,
        depth - 1,
        alpha,
        beta,
        false,
        player === 'black' ? 'white' : 'black'
      );
      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = [row, col];
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return [maxEval, bestMove];
  } else {
    let minEval = Infinity;
    for (const [row, col] of moves) {
      const newBoard = makeMove(row, col, player, board);
      const [evaluation] = minimax(
        newBoard,
        depth - 1,
        alpha,
        beta,
        true,
        player === 'black' ? 'white' : 'black'
      );
      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = [row, col];
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return [minEval, bestMove];
  }
}