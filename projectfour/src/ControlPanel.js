import React, { useState } from 'react';
import './ControlPanel.css';

// The ControlPanel component accepts an onGuessSubmit function as a prop
const ControlPanel = ({ onGuessSubmit }) => {
  // State hook for the current guess input
  const [guess, setGuess] = useState('');
  // State hook for any error message
  const [error, setError] = useState('');

  // Function to handle changes in the input field, updating the guess state and resetting any error
  const handleInputChange = (event) => {
    setError('');
    setGuess(event.target.value.toUpperCase()); // Convert input to uppercase
  };

  // Function to validate the guess format
  const validateGuess = (guess) => {
    if (guess.length !== 4) {
      return "Guess must be 4 characters long."; // Ensure guess is 4 chars
    }
    if (!/^[RGBYOP]{4}$/.test(guess)) {
      return "Invalid guess. Only use R, G, B, Y, O, P."; // Ensure guess only contains allowed characters
    }
    return ''; // Return empty string if no error
  };

  // Function to handle the submission of a guess
  const handleSubmit = () => {
    const errorMessage = validateGuess(guess); // Validate the current guess
    if (errorMessage) {
      setError(errorMessage); // Set error message if validation fails
      return; // Exit the function if there is an error
    }
    onGuessSubmit(guess); // Submit the guess using the passed-in function
    setGuess(''); // Reset the guess input field
  };

  // Render the control panel with an input field, submit button, and possible error message
  return (
    <div className="control-panel">
      <input
        type="text"
        placeholder="Enter your guess here" // Placeholder text
        value={guess} // Controlled input tied to the guess state
        onChange={handleInputChange} // Event handler for input changes
        maxLength="4" // Limit the input to 4 characters
      />
      <button onClick={handleSubmit}>Submit Guess</button> 
      {error && <div className="error">{error}</div>} 
    </div>
  );
};

// Export the ControlPanel component for use in other files
export default ControlPanel;