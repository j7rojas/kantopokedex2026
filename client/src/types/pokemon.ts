/**
 * types/pokemon.ts
 * 
 * Shared TypeScript interfaces for the Frontend.
 * These match the data structure returned by our Backend.
 */

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonMove {
  name: string;
  level: number;
  type: string;
}

export interface EvolutionStage {
  id: number;
  name: string;
  sprite: string;
  triggerText: string | null;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: PokemonStats;
  moves: PokemonMove[];
  evolutionChain: EvolutionStage[];
}
