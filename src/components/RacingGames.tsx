import React from 'react';
import { GameLayout } from './GameLayout';

export default function RacingGames() {
  return (
    <GameLayout title="Racing Games">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <p className="text-white/80 text-center mb-8">
          Some fun racing games I know you'll love :)
        </p>
        
        <div className="grid gap-8">
          <div className="bg-white/5 p-6 rounded-lg">
            <h2 className="text-xl text-white mb-4">Pako Highway</h2>
            <div className="w-full flex justify-center">
              <iframe 
                height="167" 
                src="https://itch.io/embed/1601089" 
                width="552"
                className="max-w-full"
                title="Pako Highway"
              />
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-lg">
            <h2 className="text-xl text-white mb-4">PolyTrack</h2>
            <div className="w-full flex justify-center">
              <iframe 
                src="https://itch.io/embed/1829893" 
                width="552" 
                height="167"
                className="max-w-full"
                title="PolyTrack"
              />
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-lg">
            <h2 className="text-xl text-white mb-4">Music Lab</h2>
            <div className="w-full flex justify-center">
              <iframe 
                width="560" 
                height="315" 
                src="https://musiclab.chromeexperiments.com/Song-Maker/embed/6055205153669120" 
                frameBorder="0" 
                allowFullScreen
                className="max-w-full"
                title="Music Lab Song Maker"
              />
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}