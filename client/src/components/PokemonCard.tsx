/**
 * components/PokemonCard.tsx
 * 
 * This is the main component for a single Pokemon card.
 * It combines the Pokemon's basic info, image, stats chart, and move list.
 */

import React from 'react';
import { Pokemon } from '../types/pokemon';
import StatRadarChart from './StatRadarChart';
import MoveTable from './MoveTable';
import EvolutionChain from './EvolutionChain';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col hover:shadow-2xl hover:border-red-400 transition-shadow max-w-xs mx-auto w-full h-full">
      {/* Top Header: ID and Name */}
      <div className="bg-gray-50 px-3 py-1 border-b flex justify-between items-center">
        <span className="text-xs font-mono text-gray-500">#{String(pokemon.id).padStart(3, '0')}</span>
        <h2 className="text-base font-bold text-gray-800 capitalize">{pokemon.name}</h2>
      </div>

      {/* Scrollable Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-0 gap-2">
        {/* Pokemon Image */}
        <div className="flex justify-center p-1 bg-gradient-to-b from-white to-gray-50 shrink-0">
          <img 
            src={pokemon.image} 
            alt={pokemon.name} 
            className="w-24 h-24 object-contain drop-shadow-md"
          />
        </div>

        {/* Type Labels */}
        <div className="flex justify-center gap-1 px-3 pb-1 shrink-0">
          {pokemon.types.map(type => (
            <span 
              key={type} 
              className={`px-2 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm bg-type-${type} uppercase tracking-wider`}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Stats Radar Chart */}
        <div className="px-3 py-0.5 shrink-0">
          <h3 className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b mb-0.5">Base Stats</h3>
          <StatRadarChart stats={pokemon.stats} pokemonName={pokemon.name} />
        </div>

        {/* Evolution Chain Section */}
        <div className="px-3 py-0.5 shrink-0">
          <h3 className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b mb-0.5">Evolutionary Chain</h3>
          <EvolutionChain chain={pokemon.evolutionChain} />
        </div>

        {/* Move List */}
        <div className="px-3 py-1 flex-1 flex flex-col min-h-0 overflow-hidden">
          <h3 className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b mb-0.5 shrink-0">Moves (FR/LG)</h3>
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
            <MoveTable moves={pokemon.moves} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
