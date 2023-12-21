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
  const [userResponse, setUserResponse] = useState<boolean | null>(null);
  const [aggregatedResponses, setAggregatedResponses] = useState<{ likes: number; dislikes: number }>({ likes: 0, dislikes: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=999999');
        const data = response.data;

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
        setSelectedPokemon(pokemon);
      } else {
        const response = await axios.get<PokemonDetails>((pokemon as Pokemon).url);
        setSelectedPokemon(response.data);
      }
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  const handleLikeDislike = async (liked: boolean) => {
    // Update user's response
    setUserResponse(liked);
  
    try {
      const response = await axios.get<{ likes: number; dislikes: number }>('/api/aggregated-responses');
      console.log('Aggregated Responses:', response.data);
      setAggregatedResponses(response.data);
    } catch (error) {
      console.error('Error updating/fetching aggregated responses:', error);
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
    const updatedFilterTypes = filterTypes.includes(type)
      ? filterTypes.filter((t) => t !== type)
      : [...filterTypes, type];

    setFilterTypes(updatedFilterTypes);
  };


  
  const filterPokemon = (pokemon: PokemonDetails | Pokemon): boolean => {
    // If no filter types selected, show all
    if (filterTypes.length === 0) {
      return true;
    }
  
    // Check if the Pokemon has at least one of the selected types
    if ('types' in pokemon) {
      return pokemon.types.some((type) => filterTypes.includes(type.type.name));
    }
  
    return false;
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
            <div className="like-dislike-buttons">
              <button onClick={() => handleLikeDislike(true)} className={userResponse === true ? 'active' : ''}>
                Like
              </button>
              <button onClick={() => handleLikeDislike(false)} className={userResponse === false ? 'active' : ''}>
                Dislike
              </button>
            </div>
            <div className="aggregated-responses">
              <p>Aggregated Responses:</p>
              <p>Likes: {aggregatedResponses.likes}</p>
              <p>Dislikes: {aggregatedResponses.dislikes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokeList;
