import React from 'react';
import './GameBoard.css';

// The GameBoard component takes a 'guesses' prop which is an array of guess objects
const GameBoard = ({ guesses }) => {
  // Render the game board
  return (
    <div className="game-board">
      {/* Map over the guesses array to render each guess and its results */}
      {guesses.map((entry, index) => (
        <div key={index} className="row">
          {/* Split each guess string into individual characters and map over them to render pegs */}
          {entry.guess.split('').map((peg, pegIndex) => (
            // Render a peg for each character in the guess
            <div key={pegIndex} className={`peg ${peg.toLowerCase()}`}>{peg}</div>
          ))}
          {/* Render the results of each guess (exacts and partials) */}
          <div className="results">
            Exacts: {entry.results.exacts}, Partials: {entry.results.partials}
          </div>
        </div>
      ))}
    </div>
  );
};

// Export the GameBoard component for use in other files
export default GameBoard;
