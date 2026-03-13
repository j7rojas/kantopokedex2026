/**
 * pages/Home.tsx
 * 
 * This is the main page of our application.
 * It handles:
 * 1. Fetching the 151 Pokemon from our backend
 * 2. Storing them in state
 * 3. Handling search and type filtering
 * 4. Displaying the responsive grid of Pokemon cards
 */

import React, { useEffect, useState, useMemo } from 'react';
import { fetchAllPokemon } from '../services/api';
import { Pokemon } from '../types/pokemon';
import PokemonCard from '../components/PokemonCard';
import { Search, Loader2, AlertCircle } from 'lucide-react';

const Home: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllPokemon();
        setPokemons(data);
        setError(null);
      } catch (err) {
        setError('Failed to load Pokemon data. Is the backend server running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter Pokemon based on search term and type
  const filteredPokemons = useMemo(() => {
    return pokemons.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.id.toString() === searchTerm;
      const matchesType = typeFilter === 'all' || p.types.includes(typeFilter);
      return matchesSearch && matchesType;
    });
  }, [pokemons, searchTerm, typeFilter]);

  // Unique list of types for the filter dropdown
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    pokemons.forEach(p => p.types.forEach(t => types.add(t)));
    return Array.from(types).sort();
  }, [pokemons]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-red-500" />
        <p className="text-xl font-semibold">Loading Kanto Pokédex...</p>
        <p className="text-sm">Fetching 151 Pokémon and their moves from the backend.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600 px-4 text-center">
        <AlertCircle className="w-16 h-16 mb-4" />
        <p className="text-2xl font-bold mb-2">Error</p>
        <p className="max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Controls */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black text-red-600 mb-4 tracking-tighter">KANTO POKÉDEX</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore the original 151 Pokémon with detailed base stats and Gen 3 FireRed/LeafGreen move lists.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or number..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-64">
          <select 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-none transition capitalize"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {allTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredPokemons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPokemons.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-xl">No Pokémon match your search or filter.</p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-400 text-sm border-t pt-8">
        <p>Data provided by <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className="underline hover:text-red-500">PokeAPI</a>.</p>
        <p>© 2026 Kanto Pokedex Project</p>
      </footer>
    </div>
  );
};

export default Home;
