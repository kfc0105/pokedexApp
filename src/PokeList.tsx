// PokeList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pokemon, PokemonList, PokemonDetails } from './types';
import './PokeList.css';

const PokeList: React.FC = () => {
  // State to store the list of Pokemon and the currently selected Pokemon
  const [pokemonList, setPokemonList] = useState<PokemonList | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);

  // Fetch Pokemon data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all Pokemon from the PokeAPI
        let allPokemon: PokemonDetails[] = [];
        let nextUrl = 'https://pokeapi.co/api/v2/pokemon';
        while (nextUrl) {
          const response = await axios.get(nextUrl);
          allPokemon = [...allPokemon, ...response.data.results];
          nextUrl = response.data.next;
        }

        // Format the fetched data into a simpler Pokemon array
        const formattedPokemon: Pokemon[] = allPokemon.map((pokemon, index) => ({
          id: index + 1,
          name: pokemon.name,
          url: pokemon.url,
        }));

        // Set the formatted Pokemon list to the state
        setPokemonList({ count: formattedPokemon.length, results: formattedPokemon });
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

  // Function to handle clicks on a Pokemon, fetching and setting details
  const handlePokemonClick = async (url: string) => {
    try {
      const response = await axios.get(url);
      setSelectedPokemon(response.data);
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  // Function to handle sorting of the Pokemon list based on ID or name
  const handleSort = (option: string) => {
    if (pokemonList) {
      // Create a copy of the current list
      const sortedList = [...pokemonList.results];
      // Sort the list based on the selected option (ID or name)
      sortedList.sort((a, b) => {
        if (option === 'id') {
          return a.id - b.id;
        } else if (option === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
      // Update the Pokemon list in the state with the sorted list
      setPokemonList({ ...pokemonList, results: sortedList });
    }
  };

  // Render the component
  return (
    <div className="poke-container">
      {/* Pokemon list section */}
      <div className="pokemon-list">
        <h1>Pokemon List</h1>
        <div>
          {/* Buttons for sorting the list */}
          <button onClick={() => handleSort('id')}>Sort by ID</button>
          <button onClick={() => handleSort('name')}>Sort by Name</button>
        </div>
        {/* Render the Pokemon list if available */}
        {pokemonList && (
          <ul>
            {pokemonList.results.map((pokemon) => (
              // Render each Pokemon item with an onClick event to handle clicks
              <li key={pokemon.name} onClick={() => handlePokemonClick(pokemon.url)}>
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

      {/* Pokemon details section */}
      <div className="pokemon-details">
        {selectedPokemon && (
          <div className="details-container">
            <h2>Details for {selectedPokemon.name}</h2>
            {/* Display details for the selected Pokemon */}
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

// Export the component
export default PokeList;
