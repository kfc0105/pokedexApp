// PokeList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pokemon, PokemonList, PokemonDetails } from './types';
import './PokeList.css';

const PokeList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<PokemonList | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let allPokemon: PokemonDetails[] = [];

        // This keeps fetching until there is non left
        let nextUrl = 'https://pokeapi.co/api/v2/pokemon';
        while (nextUrl) {
          const response = await axios.get(nextUrl);
          allPokemon = [...allPokemon, ...response.data.results];
          nextUrl = response.data.next;
        }

        // Extract data and makes a key??
        const formattedPokemon: Pokemon[] = allPokemon.map((pokemon, index) => ({
          id: index + 1, // Add 1 to index to get ID
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
                {/* this grabs the img */}
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name}
                />
                {pokemon.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="pokemon-details">
        {selectedPokemon && (
          <div className="details-container">
            <h2>Details for {selectedPokemon.name}</h2>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon.id}.png`}
              alt={selectedPokemon.name}
            />
            <p>ID: {selectedPokemon.id}</p>
            <p>Height: {selectedPokemon.height} dm</p>
            <p>Weight: {selectedPokemon.weight} hg</p>
            <p>Abilities: {selectedPokemon.abilities.map((ability) => ability.ability.name).join(', ')}</p>
            <p>Types: {selectedPokemon.types.map((type) => type.type.name).join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokeList;
