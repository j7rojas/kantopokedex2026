/**
 * server.ts
 * 
 * The main entry point for the backend server.
 * It imports the Express app and starts listening for connections on a port.
 * 
 * NOTE FOR BEGINNERS:
 * Cloud platforms (like Koyeb, Heroku, or Render) assign a port to your application
 * dynamically using an environment variable called PORT. Your server MUST listen 
 * on this specific port to be accessible from the internet. In local development,
 * we usually use a fallback like 3001.
 */

import app from './app';

// 1. Get the port from the environment variable PORT (provided by cloud hosting)
// 2. Convert it to a Number using the Number() function
// 3. If PORT is not defined (local development), default to 3001
const PORT = Number(process.env.PORT) || 3001;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  // Check if we are running on a cloud platform by checking if process.env.PORT exists
  const isCloud = !!process.env.PORT;

  console.log(`Pokedex Backend Server is starting...`);
  console.log(`Listening on port: ${PORT}`);

  // If we are running locally (no PORT env var), show helpful localhost links
  if (!isCloud) {
    console.log(`Local Development URL: http://localhost:${PORT}`);
    console.log(`API Endpoint: http://localhost:${PORT}/api/pokemon`);
  } else {
    // In production/cloud, we don't assume the URL is localhost
    console.log(`Server is running in production mode on the assigned port.`);
  }
});
