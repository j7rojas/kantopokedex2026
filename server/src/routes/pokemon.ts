/**
 * routes/pokemon.ts
 * 
 * This file contains the Express route handlers for Pokemon-related endpoints.
 * It connects the HTTP requests to our PokeAPI service.
 */

import { Router, Request, Response } from 'express';
import { getAllKantoPokemon, getPokemonById } from '../services/pokeapi';

const router = Router();

/**
 * GET /api/pokemon
 * Returns the list of all 151 Kanto Pokemon
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const pokemons = await getAllKantoPokemon();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: (error as Error).message });
  }
});

/**
 * GET /api/pokemon/:id
 * Returns a single Pokemon by ID or name
 */
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pokemon = await getPokemonById(id);
    res.json(pokemon);
  } catch (error) {
    res.status(404).json({ error: 'Not Found', message: (error as Error).message });
  }
});

export default router;
