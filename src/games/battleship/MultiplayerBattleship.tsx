import React, { useState } from 'react';
import { Client } from 'boardgame.io/react';
import { P2P } from '@boardgame.io/p2p';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameLayout } from '../../components/GameLayout';
import { BattleshipBoard } from './components/BattleshipBoard';
import { DraggableShip } from './components/DraggableShip';
import { BattleshipGame } from './game';
import { BattleshipState, SHIPS, Coordinate } from './types';
import { Copy, UserPlus } from 'lucide-react';
import { BoardProps } from 'boardgame.io/react';

interface BattleshipClientProps extends BoardProps<BattleshipState> {
  hostMatchID?: string;
}

function BattleshipClient({ G, moves, playerID, isActive, matchData, hostMatchID }: BattleshipClientProps) {
  const [copied, setCopied] = useState(false);
  const [shipOrientations, setShipOrientations] = useState<{ [key: number]: 'horizontal' | 'vertical' }>(
    Object.fromEntries(SHIPS.map((_, i) => [i, 'horizontal']))
  );

  const copyMatchID = () => {
    if (!hostMatchID) return;
    navigator.clipboard.writeText(hostMatchID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShipDrop = (shipIndex: number, row: number, col: number) => {
    if (!isActive || G.phase !== 'placement') return;

    const orientation = shipOrientations[shipIndex];
    const ship = SHIPS[shipIndex];
    const coordinates: Coordinate[] = [];

    for (let i = 0; i < ship.size; i++) {
      if (orientation === 'horizontal') {
        if (col + i >= 10) return; // Invalid placement
        coordinates.push([row, col + i]);
      } else {
        if (row + i >= 10) return; // Invalid placement
        coordinates.push([row + i, col]);
      }
    }

    moves.placeShip(coordinates);
  };

  const handleShotClick = (row: number, col: number) => {
    if (!isActive || G.phase !== 'playing') return;
    moves.fireShot([row, col]);
  };

  const rotateShip = (shipIndex: number) => {
    setShipOrientations(prev => ({
      ...prev,
      [shipIndex]: prev[shipIndex] === 'horizontal' ? 'vertical' : 'horizontal'
    }));
  };

  const currentPlayer = parseInt(playerID);
  const opponent = 1 - currentPlayer;

  const getGamePhaseMessage = () => {
    if (G.phase === 'placement') {
      if (G.players[currentPlayer].ships.length === SHIPS.length) {
        return "Waiting for opponent to place their ships...";
      }
      const nextShip = SHIPS[G.players[currentPlayer].ships.length];
      return `Place your ${nextShip.name} (${nextShip.size} cells)`;
    } else if (G.phase === 'playing') {
      if (isActive) {
        return "Your turn - Click on the opponent's board to fire!";
      }
      return "Opponent's turn - Waiting for their shot...";
    }
    return "";
  };

  const getGameStatus = () => {
    if (matchData && matchData.length < 2) {
      return (
        <div className="mt-6 p-4 bg-blue-900/50 rounded text-center">
          <div className="text-xl font-semibold text-white mb-2">Waiting for opponent to join...</div>
          <div className="text-blue-300">Share the Match ID with your opponent to start the game</div>
        </div>
      );
    }

    if (G.winner !== null) {
      return (
        <div className="mt-6 p-4 bg-blue-900/50 rounded text-center">
          <div className="text-2xl font-bold text-white">
            {G.winner === currentPlayer ? '🎉 You won!' : '😔 You lost!'}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <GameLayout title="Battleship - Multiplayer">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <div className="text-lg font-semibold text-white bg-blue-900/50 px-4 py-2 rounded">
                {getGamePhaseMessage()}
              </div>
              {hostMatchID && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyMatchID}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    title="Copy Match ID"
                  >
                    {copied ? (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Share Match ID
                      </>
                    )}
                  </button>
                  <div className="text-white font-mono bg-blue-900 px-3 py-1 rounded">
                    {hostMatchID}
                  </div>
                </div>
              )}
            </div>
          </div>

          {G.phase === 'placement' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-white text-lg font-semibold">Available Ships</h3>
                <span className="text-blue-300">(Ctrl/Cmd + Click to rotate)</span>
              </div>
              <div className="flex flex-wrap gap-4 p-4 bg-blue-900/50 rounded">
                {SHIPS.map((ship, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <DraggableShip
                      shipIndex={index}
                      isPlaced={G.players[currentPlayer].ships.length > index}
                      orientation={shipOrientations[index]}
                      onRotate={() => rotateShip(index)}
                    />
                    <div className="text-sm text-blue-300">{ship.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-white text-lg font-semibold mb-2">Your Board</h2>
              <BattleshipBoard
                board={G.players[currentPlayer].board}
                showShips={true}
                onShipDrop={handleShipDrop}
                isPlacement={G.phase === 'placement'}
                isActive={G.phase === 'placement' && isActive}
              />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold mb-2">Opponent's Board</h2>
              <BattleshipBoard
                board={G.players[opponent].board}
                showShips={false}
                onCellClick={handleShotClick}
                isActive={G.phase === 'playing' && isActive}
              />
            </div>
          </div>

          {getGameStatus()}
        </div>
      </GameLayout>
    </DndProvider>
  );
}

// Create P2P clients
const HostBattleship = Client({
  game: BattleshipGame,
  board: BattleshipClient,
  debug: false,
  multiplayer: P2P({ isHost: true }),
});

const PeerBattleship = Client({
  game: BattleshipGame,
  board: BattleshipClient,
  debug: false,
  multiplayer: P2P(),
});

// Multiplayer setup component
export function MultiplayerBattleship() {
  const [isHost, setIsHost] = useState<boolean | null>(null);
  const [matchID, setMatchID] = useState('');
  const [hostMatchID] = useState(() => Math.random().toString(36).substring(2, 9));

  if (isHost === null) {
    return (
      <GameLayout title="Battleship - Multiplayer">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsHost(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create New Game
          </button>
          <div className="text-white">- or -</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={matchID}
              onChange={(e) => setMatchID(e.target.value)}
              placeholder="Enter Match ID"
              className="px-4 py-2 rounded bg-blue-900 text-white placeholder-blue-300 border border-blue-600 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={() => setIsHost(false)}
              disabled={!matchID}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              Join Game
            </button>
          </div>
        </div>
      </GameLayout>
    );
  }

  const GameComponent = isHost ? HostBattleship : PeerBattleship;
  return (
    <GameComponent
      matchID={isHost ? hostMatchID : matchID}
      playerID={isHost ? "0" : "1"}
      hostMatchID={isHost ? hostMatchID : matchID}
    />
  );
} 