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

// PokeAPI Species structure
export interface PokeAPISpeciesResponse {
  evolution_chain: {
    url: string;
  };
}

// PokeAPI Evolution Chain structure
export interface EvolutionDetail {
  min_level?: number;
  item?: { name: string };
  trigger: { name: string };
  held_item?: { name: string };
  location?: { name: string };
  known_move?: { name: string };
  known_move_type?: { name: string };
  min_happiness?: number;
  min_beauty?: number;
  min_affection?: number;
  needs_overworld_rain?: boolean;
  party_species?: { name: string };
  party_type?: { name: string };
  relative_physical_stats?: number;
  time_of_day?: string;
  trade_species?: { name: string };
  turn_upside_down?: boolean;
}

export interface ChainLink {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface PokeAPIEvolutionChainResponse {
  chain: ChainLink;
}
