/**
 * app.ts
 * 
 * This file configures the Express application.
 * It sets up middleware like CORS and JSON parsing, defines our API routes,
 * and serves the React frontend static files in production.
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import pokemonRoutes from './routes/pokemon';

const app = express();

// Middleware: CORS (Allows the frontend to talk to this backend)
app.use(cors());

// Middleware: JSON parser (Allows handling JSON in request bodies)
app.use(express.json());

// API Routes: All pokemon endpoints will be prefixed with /api/pokemon
app.use('/api/pokemon', pokemonRoutes);

// SERVING THE FRONTEND:
// When we build the React app, it generates static files in 'client/dist'.
// We tell Express to serve these files so the entire app can run on one host.

// 1. Resolve the path to the 'client/dist' directory
// Since this file is in 'server/src', we go up two levels to reach the root, then into 'client/dist'
const clientDistPath = path.resolve(__dirname, '../../client/dist');

// 2. Serve static files (HTML, CSS, JS) from the built React app
app.use(express.static(clientDistPath));

// 3. Catch-all route: For any request that doesn't match an API route or a static file,
// send back 'index.html'. This allows React Router (client-side routing) to work properly.
app.get('*', (req, res) => {
  // Only handle GET requests and exclude API routes from being intercepted here
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  } else {
    // If it's an unknown API route, return a 404 JSON response
    res.status(404).json({ error: 'Not Found', message: 'The requested API endpoint does not exist.' });
  }
});

export default app;
