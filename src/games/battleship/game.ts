import { Game, Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { BattleshipState, Board, BOARD_SIZE, Ship, Coordinate, SHIPS } from './types';

function createEmptyBoard(): Board {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
}

function createInitialPlayerState() {
  return {
    board: createEmptyBoard(),
    ships: [],
    shots: [],
  };
}

function isValidShipPlacement(board: Board, coordinates: Coordinate[]): boolean {
  // Check if all coordinates are within bounds and not occupied
  return coordinates.every(([row, col]) => {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return false;
    if (board[row][col] !== null) return false;
    
    // Check adjacent cells (including diagonals)
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 && newRow < BOARD_SIZE &&
          newCol >= 0 && newCol < BOARD_SIZE &&
          board[newRow][newCol] === 'ship'
        ) {
          return false;
        }
      }
    }
    return true;
  });
}

export const BattleshipGame: Game<BattleshipState> = {
  setup: () => ({
    players: [createInitialPlayerState(), createInitialPlayerState()],
    phase: 'placement',
    winner: null,
  }),

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    placeShip: ({ G, playerID, events }, coordinates: Coordinate[]) => {
      if (G.phase !== 'placement') return INVALID_MOVE;
      const player = parseInt(playerID);
      const playerState = G.players[player];

      // Validate ship size
      const nextShipSize = SHIPS[playerState.ships.length].size;
      if (coordinates.length !== nextShipSize) return INVALID_MOVE;

      // Validate placement
      if (!isValidShipPlacement(playerState.board, coordinates)) return INVALID_MOVE;

      // Place the ship
      const newBoard = [...playerState.board.map(row => [...row])];
      coordinates.forEach(([row, col]) => {
        newBoard[row][col] = 'ship';
      });

      const newShip: Ship = {
        coordinates,
        hits: Array(coordinates.length).fill(false),
      };

      G.players[player] = {
        ...playerState,
        board: newBoard,
        ships: [...playerState.ships, newShip],
      };

      // Check if all ships are placed
      if (G.players[player].ships.length === SHIPS.length) {
        // If both players have placed all ships, start the game
        if (G.players[1 - player].ships.length === SHIPS.length) {
          G.phase = 'playing';
        } else {
          events.endTurn();
        }
      }
    },

    fireShot: ({ G, playerID, events }, [row, col]: Coordinate) => {
      if (G.phase !== 'playing') return INVALID_MOVE;
      const player = parseInt(playerID);
      const opponent = 1 - player;

      // Validate shot
      if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return INVALID_MOVE;
      if (G.players[player].shots.some(([r, c]) => r === row && c === col)) return INVALID_MOVE;

      // Record the shot
      G.players[player].shots.push([row, col]);

      // Check for hit
      const opponentBoard = G.players[opponent].board;
      const isHit = opponentBoard[row][col] === 'ship';

      // Update opponent's board
      opponentBoard[row][col] = isHit ? 'hit' : 'miss';

      // Update ship status if hit
      if (isHit) {
        for (const ship of G.players[opponent].ships) {
          const hitIndex = ship.coordinates.findIndex(
            ([r, c]) => r === row && c === col
          );
          if (hitIndex !== -1) {
            ship.hits[hitIndex] = true;
            break;
          }
        }

        // Check for win condition
        const allShipsSunk = G.players[opponent].ships.every(ship =>
          ship.hits.every(hit => hit)
        );
        if (allShipsSunk) {
          G.winner = player;
          events.endGame();
          return;
        }
      }

      events.endTurn();
    },
  },
}; 