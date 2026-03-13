/**
 * types/pokemon.ts
 * 
 * This file defines the TypeScript interfaces for our Pokemon data structure.
 * These types are used by the backend to ensure data consistency and by the
 * frontend to understand the shape of the data it receives.
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

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: PokemonStats;
  moves: PokemonMove[];
}

// Internal structure for raw PokeAPI responses (only the parts we need)
export interface PokeAPIPokemonResponse {
  id: number;
  name: string;
  sprites: {
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  moves: Array<{
    move: {
      name: string;
      url: string; // Used to fetch move type
    };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: {
        name: string;
      };
      version_group: {
        name: string;
      };
    }>;
  }>;
}

export interface PokeAPIMoveResponse {
  name: string;
  type: {
    name: string;
  };
}
