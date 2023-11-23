// PokeList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PokemonList, PokemonDetails } from './types';
import './PokeList.css'; // Import a CSS file for styling

const PokeList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<PokemonList | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let allPokemon: PokemonDetails[] = [];

        // Make requests until there is no more 'next' link
        let nextUrl = 'https://pokeapi.co/api/v2/pokemon';
        while (nextUrl) {
          const response = await axios.get(nextUrl);
          allPokemon = [...allPokemon, ...response.data.results];
          nextUrl = response.data.next;
        }

        // Extract only the necessary properties (name and url)
        const formattedPokemon: Pokemon[] = allPokemon.map((pokemon) => ({
          name: pokemon.name,
          url: pokemon.url,
        }));

        // Set the complete list of Pokemon
        setPokemonList({ count: formattedPokemon.length, results: formattedPokemon });
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePokemonClick = async (url: string) => {
    try {
      const response = await axios.get(url);
      setSelectedPokemon(response.data);
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  return (
    <div className="poke-container">
      <div className="pokemon-list">
        <h1>Pokemon List</h1>
        {pokemonList && (
          <ul>
            {pokemonList.results.map((pokemon) => (
              <li key={pokemon.name} onClick={() => handlePokemonClick(pokemon.url)}>
                {pokemon.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="pokemon-details">
        {selectedPokemon && (
          <div>
            <h2>Details for {selectedPokemon.name}</h2>
            {/* Display additional details about the selected Pokemon */}
            <p>ID: {selectedPokemon.id}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokeList;
