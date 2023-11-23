// main.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import PokeList from './PokeList';

const App: React.FC = () => {
  return (
    <div>
      <h1>Pokedex App</h1>
      <PokeList />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
