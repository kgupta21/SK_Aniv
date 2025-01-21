import { Board, Player, BOARD_SIZE, DIRECTIONS } from '../types';

export function isValidMove(
  row: number,
  col: number,
  player: Player,
  board: Board
): boolean {
  if (board[row][col] !== null) return false;

  for (const [dx, dy] of DIRECTIONS) {
    let x = row + dx;
    let y = col + dy;
    let foundOpponent = false;

    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (board[x][y] === null) break;
      if (board[x][y] !== player) {
        foundOpponent = true;
      } else if (foundOpponent) {
        return true;
      } else {
        break;
      }
      x += dx;
      y += dy;
    }
  }
  return false;
}

export function makeMove(
  row: number,
  col: number,
  player: Player,
  board: Board
): Board {
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = player;

  for (const [dx, dy] of DIRECTIONS) {
    let x = row + dx;
    let y = col + dy;
    const tilesToFlip: [number, number][] = [];

    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (newBoard[x][y] === null) break;
      if (newBoard[x][y] !== player) {
        tilesToFlip.push([x, y]);
      } else {
        tilesToFlip.forEach(([fx, fy]) => {
          newBoard[fx][fy] = player;
        });
        break;
      }
      x += dx;
      y += dy;
    }
  }

  return newBoard;
}

export function hasValidMove(board: Board, player: Player): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidMove(row, col, player, board)) {
        return true;
      }
    }
  }
  return false;
}