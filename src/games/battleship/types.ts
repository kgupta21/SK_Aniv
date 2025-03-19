export type Cell = 'ship' | 'hit' | 'miss' | null;
export type Board = Cell[][];
export type Coordinate = [number, number];

export interface Ship {
  coordinates: Coordinate[];
  hits: boolean[];
}

export interface PlayerState {
  board: Board;
  ships: Ship[];
  shots: Coordinate[];
}

export interface BattleshipState {
  players: [PlayerState, PlayerState];
  phase: 'placement' | 'playing';
  winner: number | null;
}

export const BOARD_SIZE = 10;
export const SHIPS = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Submarine', size: 3 },
  { name: 'Destroyer', size: 2 }
]; 