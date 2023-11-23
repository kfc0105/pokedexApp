// YourComponent.js
import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/api';

const YourComponent = () => {
  const [pokemonList, setPokemonList] = useState(null);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const result = await fetchData('pokemon?limit=10'); // Adjust the parameters based on your needs
        setPokemonList(result.results);
      } catch (error) {
        // Handle errors
      }
    };

    fetchPokemonList();
  }, []);

  return (
    <div>
      {pokemonList ? (
        <ul>
          {pokemonList.map((pokemon) => (
            <li key={pokemon.name}>{pokemon.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default YourComponent;
