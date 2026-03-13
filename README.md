# Kanto Pokédex 2026

A full-stack Pokédex application featuring the original 151 Pokémon.

## Features
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Chart.js.
- **Backend**: Node.js, Express, TypeScript, Node-Cache.
- **Data**: Real-time data from [PokeAPI](https://pokeapi.co/), filtered for Generation 3 (FireRed/LeafGreen) move sets.
- **Visuals**: Radar charts for base stats and clean Pokédex-style cards.
- **Performance**: Backend caching to ensure fast response times and minimal API hitting.

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

## Project Structure

```text
root/
├── package.json                # Root orchestration script (for deployment)
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── MoveTable.tsx       # Table displaying Pokémon moves
│   │   │   ├── PokemonCard.tsx     # Main card container for each Pokémon
│   │   │   └── StatRadarChart.tsx  # Radar chart for base stats (Chart.js)
│   │   ├── pages/              # Page components
│   │   │   └── Home.tsx            # Main landing page displaying the grid
│   │   ├── services/           # API communication layer
│   │   │   └── api.ts              # Axios instance and backend requests
│   │   ├── types/              # TypeScript interfaces
│   │   │   └── pokemon.ts          # Shared Pokémon data structures
│   │   ├── App.tsx             # Main application component
│   │   └── main.tsx            # React entry point
│   ├── index.html              # HTML template
│   └── vite.config.ts          # Vite configuration
├── server/                     # Backend Node.js/Express application
│   ├── src/
│   │   ├── routes/             # API route definitions
│   │   │   └── pokemon.ts          # Endpoints for Pokémon data
│   │   ├── services/           # Business logic and external API calls
│   │   │   └── pokeapi.ts          # PokeAPI fetching, transformation, and caching
│   │   ├── types/              # TypeScript interfaces
│   │   │   └── pokemon.ts          # Server-side data structures
│   │   ├── app.ts              # Express app configuration
│   │   └── server.ts           # Server entry point and port listener
│   └── tsconfig.json           # TypeScript configuration
└── README.md                   # Project documentation
```

## How it Works

### Data Flow Diagram
```mermaid
graph LR
    User([User Browser]) <--> React[React Frontend]
    React <--> Express[Express Backend]
    Express <--> Cache[(Local Cache)]
    Express <--> PokeAPI[PokeAPI External]
```

## Setup Instructions

### 1. Backend Setup
Open a terminal in the `server` directory:
```bash
cd server
npm install
npm run dev
```
The backend will start on [http://localhost:3001](http://localhost:3001).

### 2. Frontend Setup
Open a new terminal in the `client` directory:
```bash
cd client
npm install
npm run dev
```
The frontend will start on [http://localhost:3000](http://localhost:3000).

### 3. Root Orchestration (Deployment)
The project includes a root-level `package.json` to handle deployment on platforms like **Koyeb**.

When you run `npm start` from the root:
1. It triggers `npm run build` (Installs and builds both `client` and `server`).
2. Once the build finishes, it starts the production server from the `server` directory.

This ensures the `dist/` folder is always generated before the server starts, preventing "Module Not Found" errors.

---

## Deployment Summary
- **Platform**: Koyeb (or similar)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

---

## Technical Details & Troubleshooting
- **Move Filtering**: Moves are filtered for the `firered-leafgreen` version group using level-up methods.
- **TypeScript**: Consistent typing between frontend and backend. Note: Imports in `client/src/main.tsx` must not use `.tsx` extensions to avoid build errors.
- **Caching**: The backend uses `node-cache` with a 1-hour TTL.
- **Ports**: The server dynamically listens on `process.env.PORT` with a fallback to `3001` for local development.

---

## How it Works
1. **Frontend** requests Pokémon data from our **Backend**.
2. **Backend** checks its **Local Cache**.
3. If not in cache, **Backend** fetches raw data from **PokeAPI**.
4. **Backend** transforms the data:
   - Formats names and images.
   - Maps base stats.
   - Filters moves specifically for the `firered-leafgreen` version group.
   - Sorts moves by level.
5. **Backend** returns clean, optimized JSON to the **Frontend**.
6. **Frontend** renders the data into responsive cards using **Tailwind CSS** and **Chart.js**.

## Notes for Beginners
- Every file is thoroughly commented to explain its purpose.
- Check `server/src/services/pokeapi.ts` to see how we transform the raw API data.
- Check `client/src/components/StatRadarChart.tsx` to see how we use Chart.js with React.
- The `types` folders in both client and server ensure we have consistent data shapes throughout the app.
