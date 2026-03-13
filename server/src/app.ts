/**
 * app.ts
 * 
 * This file configures the Express application.
 * It sets up middleware like CORS and JSON parsing, and defines our API routes.
 */

import express from 'express';
import cors from 'cors';
import pokemonRoutes from './routes/pokemon';

const app = express();

// Middleware: CORS (Allows the frontend to talk to this backend)
app.use(cors());

// Middleware: JSON parser (Allows handling JSON in request bodies)
app.use(express.json());

// Routes: All pokemon endpoints will be prefixed with /api/pokemon
app.use('/api/pokemon', pokemonRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.send('Pokedex API is running. Use /api/pokemon to get Pokemon data.');
});

export default app;
