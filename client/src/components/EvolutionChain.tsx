/**
 * components/EvolutionChain.tsx
 * 
 * This component displays the evolutionary chain of a Pokemon.
 * It uses FireRed/LeafGreen sprites and displays evolution triggers.
 */

import React from 'react';
import { EvolutionStage } from '../types/pokemon';

interface EvolutionChainProps {
  chain: EvolutionStage[];
}

const EvolutionChain: React.FC<EvolutionChainProps> = ({ chain }) => {
  // If a Pokemon has no evolutions (only itself in the chain), show nothing or "No evolutions"
  if (chain.length <= 1) {
    return (
      <div className="text-center py-4 text-gray-400 italic text-sm">
        No evolutions
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-1">
      {chain.map((stage, index) => (
        <React.Fragment key={stage.id}>
          {/* Transition Arrow and Trigger */}
          {index > 0 && (
            <div className="flex flex-col items-center justify-center -mx-1">
              {stage.triggerText && (
                <span className="text-[9px] leading-none font-bold text-blue-600 bg-blue-50 px-1 rounded border border-blue-100 mb-0.5 whitespace-nowrap">
                  {stage.triggerText}
                </span>
              )}
              <span className="text-gray-300 text-sm leading-none">→</span>
            </div>
          )}

          {/* Pokemon Sprite and Name */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center p-0.5 shadow-sm">
              <img
                src={stage.sprite}
                alt={stage.name}
                className="w-full h-full object-contain pixelated"
                title={stage.name}
                onError={(e) => {
                  // Fallback for missing FR/LG sprites
                  (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`;
                }}
              />
            </div>
            <span className="text-[8px] mt-0.5 font-semibold text-gray-500 capitalize leading-none text-center max-w-[48px] truncate">
              {stage.name}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default EvolutionChain;
