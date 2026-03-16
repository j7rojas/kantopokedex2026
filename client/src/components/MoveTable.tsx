/**
 * components/MoveTable.tsx
 * 
 * This component displays the list of moves learned by a Pokemon.
 * The moves are already filtered and sorted by the backend.
 */

import React from 'react';
import { PokemonMove } from '../types/pokemon';

interface MoveTableProps {
  moves: PokemonMove[];
}

const MoveTable: React.FC<MoveTableProps> = ({ moves }) => {
  if (moves.length === 0) {
    return <div className="text-sm text-gray-500 italic py-2 text-center">No level-up moves.</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden shrink-0">
      <table className="min-w-full text-left text-[11px] leading-tight">
        <thead className="bg-gray-100 font-bold">
          <tr>
            <th className="px-2 py-0.5 border-b">Lvl</th>
            <th className="px-2 py-0.5 border-b">Move</th>
            <th className="px-2 py-0.5 border-b">Type</th>
          </tr>
        </thead>
        <tbody>
          {moves.map((move, index) => (
            <tr key={`${move.name}-${index}`} className="hover:bg-gray-50">
              <td className="px-2 py-0.5 border-b">{move.level}</td>
              <td className="px-2 py-0.5 border-b capitalize truncate max-w-[80px]">{move.name}</td>
              <td className="px-2 py-0.5 border-b">
                <span className={`px-1.5 py-0 rounded text-[9px] text-white bg-type-${move.type}`}>
                  {move.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MoveTable;
