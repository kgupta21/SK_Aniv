import React, { useState } from 'react';
import { Client } from 'boardgame.io/react';
import { P2P } from '@boardgame.io/p2p';
import { GameLayout } from '../../components/GameLayout';
import { ReversiBoard } from './components/ReversiBoard';
import { ReversiGame, ReversiState } from './game';
import { Board, Player } from './types';
import { Copy, UserPlus } from 'lucide-react';
import { BoardProps } from 'boardgame.io/react';

interface ReversiClientProps extends BoardProps<ReversiState> {
  hostMatchID?: string;
}

function ReversiClient({ G, moves, playerID, isActive, matchData, hostMatchID }: ReversiClientProps) {
  const [copied, setCopied] = useState(false);

  const handleMove = (row: number, col: number) => {
    if (isActive) {
      moves.makeMove(row, col);
    }
  };

  const copyMatchID = () => {
    if (!hostMatchID) return;
    navigator.clipboard.writeText(hostMatchID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScore = (board: Board) => {
    let black = 0;
    let white = 0;
    board.forEach(row => {
      row.forEach(cell => {
        if (cell === 'black') black++;
        if (cell === 'white') white++;
      });
    });
    return { black, white };
  };

  const currentPlayer: Player = playerID === '0' ? 'black' : 'white';
  const score = getScore(G.board);

  return (
    <GameLayout title="Reversi - Multiplayer">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            <div className="text-white">
              {isActive ? "Your turn!" : "Opponent's turn"}
            </div>
            {hostMatchID && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyMatchID}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
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
                <div className="text-white font-mono bg-purple-900 px-3 py-1 rounded">
                  {hostMatchID}
                </div>
              </div>
            )}
          </div>
        </div>

        <ReversiBoard
          board={G.board}
          currentPlayer={currentPlayer}
          onMove={handleMove}
          isActive={isActive}
        />

        <div className="mt-6 flex justify-center space-x-8 text-white">
          <div>Black: {score.black}</div>
          <div>White: {score.white}</div>
        </div>

        {matchData && matchData.length < 2 && (
          <div className="mt-6 text-center text-white">
            Waiting for opponent to join...
          </div>
        )}
      </div>
    </GameLayout>
  );
}

// Create P2P clients with match ID prop support
const HostReversi = Client({
  game: ReversiGame,
  board: ReversiClient,
  debug: false,
  multiplayer: P2P({ isHost: true }),
});

const PeerReversi = Client({
  game: ReversiGame,
  board: ReversiClient,
  debug: false,
  multiplayer: P2P(),
});

// Multiplayer setup component
export function MultiplayerReversi() {
  const [isHost, setIsHost] = useState<boolean | null>(null);
  const [matchID, setMatchID] = useState('');
  const [hostMatchID] = useState(() => Math.random().toString(36).substring(2, 9));

  if (isHost === null) {
    return (
      <GameLayout title="Reversi - Multiplayer">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsHost(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
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
              className="px-4 py-2 rounded bg-purple-900 text-white placeholder-purple-300 border border-purple-600 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={() => setIsHost(false)}
              disabled={!matchID}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:bg-purple-800 disabled:cursor-not-allowed"
            >
              Join Game
            </button>
          </div>
        </div>
      </GameLayout>
    );
  }

  const GameComponent = isHost ? HostReversi : PeerReversi;
  return (
    <GameComponent
      matchID={isHost ? hostMatchID : matchID}
      playerID={isHost ? "0" : "1"}
      hostMatchID={isHost ? hostMatchID : matchID}
    />
  );
} 