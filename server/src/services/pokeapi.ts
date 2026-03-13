/**
 * services/pokeapi.ts
 * 
 * This service is responsible for all interactions with the PokeAPI.
 * It includes logic for:
 * 1. Fetching raw data from PokeAPI
 * 2. Caching responses to avoid redundant network requests
 * 3. Transforming raw API data into our clean internal structure
 * 4. Filtering moves for the 'firered-leafgreen' version
 */

import axios from 'axios';
import NodeCache from 'node-cache';
import { 
  Pokemon, 
  PokeAPIPokemonResponse, 
  PokeAPIMoveResponse, 
  PokemonMove 
} from '../types/pokemon';

// Initialize a cache that expires every 1 hour (3600 seconds)
// This improves performance significantly for subsequent requests
const cache = new NodeCache({ stdTTL: 3600 });

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetch a single Pokemon by ID or Name and transform it
 */
export async function getPokemonById(idOrName: string | number): Promise<Pokemon> {
  const cacheKey = `pokemon_${idOrName}`;
  const cachedData = cache.get<Pokemon>(cacheKey);

  if (cachedData) {
    console.log(`[Cache Hit] Serving Pokemon: ${idOrName}`);
    return cachedData;
  }

  try {
    console.log(`[Cache Miss] Fetching Pokemon: ${idOrName} from PokeAPI`);
    const response = await axios.get<PokeAPIPokemonResponse>(`${BASE_URL}/pokemon/${idOrName}`);
    const data = response.data;

    // 1. Map simple fields
    const id = data.id;
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const image = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default;
    const types = data.types.map(t => t.type.name);

    // 2. Map stats
    const stats = {
      hp: data.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
      attack: data.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
      defense: data.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
      specialAttack: data.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
      specialDefense: data.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
      speed: data.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
    };

    // 3. Filter and process moves (firered-leafgreen version only)
    const movesPromises = data.moves
      .filter(moveEntry => 
        moveEntry.version_group_details.some(v => v.version_group.name === 'firered-leafgreen' && v.move_learn_method.name === 'level-up')
      )
      .map(async moveEntry => {
        const detail = moveEntry.version_group_details.find(v => v.version_group.name === 'firered-leafgreen' && v.move_learn_method.name === 'level-up')!;
        
        // We need an extra call to get the move's type since it's not in the main pokemon response
        const moveData: PokeAPIMoveResponse = await getMoveDetails(moveEntry.move.url);
        
        return {
          name: moveEntry.move.name.replace('-', ' '),
          level: detail.level_learned_at,
          type: moveData.type.name
        } as PokemonMove;
      });

    const moves = (await Promise.all(movesPromises)).sort((a, b) => a.level - b.level);

    const transformedPokemon: Pokemon = {
      id,
      name,
      image,
      types,
      stats,
      moves
    };

    // Save to cache
    cache.set(cacheKey, transformedPokemon);
    return transformedPokemon;
  } catch (error) {
    console.error(`Error fetching Pokemon ${idOrName}:`, error);
    throw new Error(`Failed to fetch Pokemon ${idOrName}`);
  }
}

/**
 * Fetch move details (specifically for the type) with its own caching
 */
async function getMoveDetails(url: string): Promise<PokeAPIMoveResponse> {
  const cachedMove = cache.get<PokeAPIMoveResponse>(url);
  if (cachedMove) return cachedMove;

  const response = await axios.get<PokeAPIMoveResponse>(url);
  cache.set(url, response.data);
  return response.data;
}

/**
 * Fetch all 151 Kanto Pokemon
 */
export async function getAllKantoPokemon(): Promise<Pokemon[]> {
  const cacheKey = 'kanto_151';
  const cachedAll = cache.get<Pokemon[]>(cacheKey);

  if (cachedAll) {
    console.log('[Cache Hit] Serving all 151 Kanto Pokemon');
    return cachedAll;
  }

  // Create an array of 151 IDs (1 to 151)
  const ids = Array.from({ length: 151 }, (_, i) => i + 1);
  
  // Fetch all in parallel using Promise.all
  // Note: PokeAPI has rate limits, but for 151 requests it usually works fine.
  const pokemons = await Promise.all(ids.map(id => getPokemonById(id)));

  cache.set(cacheKey, pokemons);
  return pokemons;
}
