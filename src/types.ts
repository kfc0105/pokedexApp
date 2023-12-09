// types.ts
export interface Pokemon {
  id: number;
  name: string;
  url: string;
  types: {
    type: {
      name: string;
    };
  }[];
}

export interface PokemonList {
  count: number;
  results: Pokemon[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  url: string;
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
  // Add more properties as needed
}
