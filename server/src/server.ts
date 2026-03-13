/**
 * server.ts
 * 
 * The main entry point for the backend server.
 * It imports the Express app and starts listening for connections on a port.
 */

import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Pokedex Backend Server is running on http://localhost:${PORT}`);
  console.log('Use http://localhost:3001/api/pokemon to fetch all 151 Pokemon');
});
