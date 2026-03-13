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

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300">
      {/* Top Header: ID and Name */}
      <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
        <span className="text-sm font-mono text-gray-500">#{String(pokemon.id).padStart(3, '0')}</span>
        <h2 className="text-xl font-bold text-gray-800 capitalize">{pokemon.name}</h2>
      </div>

      {/* Pokemon Image */}
      <div className="flex justify-center p-4 bg-gradient-to-b from-white to-gray-50">
        <img 
          src={pokemon.image} 
          alt={pokemon.name} 
          className="w-48 h-48 object-contain drop-shadow-md"
        />
      </div>

      {/* Type Labels */}
      <div className="flex justify-center gap-2 px-4 pb-4">
        {pokemon.types.map(type => (
          <span 
            key={type} 
            className={`px-3 py-1 rounded-full text-sm font-semibold text-white shadow-sm bg-type-${type}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>

      {/* Stats Radar Chart */}
      <div className="px-4 py-2">
        <h3 className="text-center font-bold text-gray-700 border-b mb-2">Base Stats</h3>
        <StatRadarChart stats={pokemon.stats} pokemonName={pokemon.name} />
      </div>

      {/* Move List */}
      <div className="px-4 py-4 mt-auto">
        <h3 className="text-center font-bold text-gray-700 border-b mb-2">Moves (FR/LG)</h3>
        <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          <MoveTable moves={pokemon.moves} />
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
