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
  PokemonMove,
  PokeAPISpeciesResponse,
  PokeAPIEvolutionChainResponse,
  ChainLink,
  EvolutionStage,
  EvolutionDetail
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

    // 4. Fetch Evolution Chain
    // First, get the species data to find the evolution chain URL
    const speciesResponse = await axios.get<PokeAPISpeciesResponse>(`${BASE_URL}/pokemon-species/${id}`);
    const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

    // Fetch the actual evolution chain
    const evolutionChainResponse = await axios.get<PokeAPIEvolutionChainResponse>(evolutionChainUrl);
    
    // Parse the evolution chain into a flat array of stages
    const evolutionChain = await parseEvolutionChain(evolutionChainResponse.data.chain);

    const transformedPokemon: Pokemon = {
      id,
      name,
      image,
      types,
      stats,
      moves,
      evolutionChain
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
 * Helper to parse the nested PokeAPI evolution chain structure into a clean flat array.
 */
async function parseEvolutionChain(chain: ChainLink): Promise<EvolutionStage[]> {
  const result: EvolutionStage[] = [];
  let current: ChainLink | undefined = chain;

  while (current) {
    const speciesName = current.species.name;
    const speciesId = parseInt(current.species.url.split('/').filter(Boolean).pop() || '0');
    
    // Format trigger text from evolution details
    let triggerText: string | null = null;
    if (current.evolution_details && current.evolution_details.length > 0) {
      const detail = current.evolution_details[0];
      triggerText = formatEvolutionTrigger(detail);
    }

    // Get the Gen III FireRed/LeafGreen front sprite
    // Fallback if not available
    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/${speciesId}.png`;
    
    result.push({
      id: speciesId,
      name: speciesName.charAt(0).toUpperCase() + speciesName.slice(1),
      sprite,
      triggerText
    });

    // For now, we follow the first evolution path for simplicity in the UI,
    // but the structure can be extended for branching.
    current = current.evolves_to[0];
  }

  return result;
}

/**
 * Formats the evolution trigger into a human-readable string.
 */
function formatEvolutionTrigger(detail: EvolutionDetail): string {
  if (detail.min_level) return `Lv. ${detail.min_level}`;
  if (detail.item) return detail.item.name.replace('-', ' ');
  if (detail.trigger.name === 'trade') return 'Trade';
  if (detail.trigger.name === 'level-up' && detail.min_happiness) return 'Friendship';
  
  // Fallback for other triggers
  return detail.trigger.name.replace('-', ' ');
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
