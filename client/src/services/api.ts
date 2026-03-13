/**
 * services/api.ts
 * 
 * This service handles API calls from the React frontend to our custom Node.js backend.
 * It does NOT call PokeAPI directly.
 */

import axios from 'axios';
import { Pokemon } from '../types/pokemon';

// The URL where our Node.js backend is running
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Fetch all 151 Kanto Pokemon from our backend
 */
export async function fetchAllPokemon(): Promise<Pokemon[]> {
  try {
    const response = await axios.get<Pokemon[]>(`${API_BASE_URL}/pokemon`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pokemon from backend:', error);
    throw error;
  }
}

/**
 * Fetch a single Pokemon by ID or Name from our backend
 */
export async function fetchPokemonById(id: string | number): Promise<Pokemon> {
  try {
    const response = await axios.get<Pokemon>(`${API_BASE_URL}/pokemon/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pokemon ${id} from backend:`, error);
    throw error;
  }
}
