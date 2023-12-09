// PokeList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pokemon, PokemonList, PokemonDetails } from './types';
import './PokeList.css';

const PokeList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<PokemonList | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);
  const [sortBy, setSortBy] = useState<string>('id');
  const [filterTypes, setFilterTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=999999');
        const data = response.data;

        // Fetch additional details for each Pokemon
        const detailedPokemon: PokemonDetails[] = await Promise.all(
          data.results.map(async (pokemon: Pokemon) => {
            const detailedResponse = await axios.get(pokemon.url);
            return detailedResponse.data;
          })
        );

        setPokemonList({ count: detailedPokemon.length, results: detailedPokemon });
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePokemonClick = async (pokemon: PokemonDetails | Pokemon) => {
    try {
      if ('height' in pokemon) {
        // It's a PokemonDetails type
        setSelectedPokemon(pokemon);
      } else {
        // It's a Pokemon type, fetch details
        const response = await axios.get<PokemonDetails>((pokemon as Pokemon).url);
        setSelectedPokemon(response.data);
      }
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  const handleSort = (option: string) => {
    if (pokemonList) {
      const sortedList = [...pokemonList.results];
      sortedList.sort((a, b) => {
        if (option === 'id') {
          return a.id - b.id;
        } else if (option === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
      setPokemonList({ ...pokemonList, results: sortedList });
      setSortBy(option);
    }
  };

  const handleFilterChange = (type: string) => {
    // Toggle the filter type
    const updatedFilterTypes = filterTypes.includes(type)
      ? filterTypes.filter((t) => t !== type)
      : [...filterTypes, type];

    setFilterTypes(updatedFilterTypes);
  };

  const filterPokemon = (pokemon: PokemonDetails) => {
    // If no filter types selected, show all
    if (filterTypes.length === 0) {
      return true;
    }

    // Check if the Pokemon has at least one of the selected types
    return pokemon.types.some((type) => filterTypes.includes(type.type.name));
  };

  return (
    <div className="poke-container">
      <div className="pokemon-list">
        <h1>Pokemon List</h1>
        <div>
          <button onClick={() => handleSort('id')} className={sortBy === 'id' ? 'active' : ''}>
            Sort by ID
          </button>
          <button onClick={() => handleSort('name')} className={sortBy === 'name' ? 'active' : ''}>
            Sort by Name
          </button>
        </div>
        <div>
          <h2>Filter by Type</h2>
          {['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dark', 'dragon', 'steel', 'fairy'].map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                value={type}
                checked={filterTypes.includes(type)}
                onChange={() => handleFilterChange(type)}
              />
              {type}
            </label>
          ))}
        </div>
        {pokemonList && (
          <ul>
            {pokemonList.results
              .filter((pokemon) => filterPokemon(pokemon))
              .map((pokemon) => (
                <li key={pokemon.name} onClick={() => handlePokemonClick(pokemon)}>
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
            {('height' in selectedPokemon) && (
              <>
                <p>Height: {selectedPokemon.height} dm</p>
                <p>Weight: {selectedPokemon.weight} hg</p>
                <p>Abilities: {selectedPokemon.abilities.map((ability) => ability.ability.name).join(', ')}</p>
                <p>Types: {selectedPokemon.types.map((type) => type.type.name).join(', ')}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokeList;
