// PokeList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PokemonList, PokemonDetails } from './types';

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

        // Set the complete list of Pokemon
        setPokemonList({ count: allPokemon.length, results: allPokemon });
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
    <div>
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
      {selectedPokemon && (
        <div>
          <h2>Details for {selectedPokemon.name}</h2>
          {/* Display additional details about the selected Pokemon */}
          <p>ID: {selectedPokemon.id}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default PokeList;
