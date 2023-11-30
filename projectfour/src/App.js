import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import ControlPanel from './ControlPanel';
import './App.css'; // Importing CSS for styling
import axios from 'axios';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

// Maximum number of guesses allowed
const MAX_GUESSES = 11;

// Firebase configuration details
const firebaseConfig = {
  // My Firebase configuration keys
  apiKey: "AIzaSyCV0-z4-ztLOkCQKQWGYqLxqhhzKOnhQXo",
  authDomain: "noble-freehold-404519.firebaseapp.com",
  projectId: "noble-freehold-404519",
  storageBucket: "noble-freehold-404519.appspot.com",
  messagingSenderId: "616928719132",
  appId: "1:616928719132:web:290f280f0ae5c2d14ccad9"
};

// Initialize Firebase with the specified configuration
initializeApp(firebaseConfig);

const App = () => {
  const [gameRecords, setGameRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Authentication state management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [handle, setHandle] = useState('');
  const [score, setScore] = useState(0); // State to store the score
  const [gameOver, setGameOver] = useState(false); // State to track if the game is over

  const [viewOwnRecords, setViewOwnRecords] = useState(false);
  // Pagination state for game records
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5; // You can adjust this number as needed
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = gameRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(gameRecords.length / recordsPerPage);
  const goToNextPage = () => setCurrentPage(page => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(page => Math.max(page - 1, 1));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const [submitChoice, setSubmitChoice] = useState(null);
  const [newHandle, setNewHandle] = useState('');


  // State hook for keeping track of all guesses made
  const [guesses, setGuesses] = useState([]);
  // The secret combination to be guessed, hardcoded for this example
  const secret = "RGBY";

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    if (viewOwnRecords) {
      displayUserGameRecords();
    } else {
      displayAllGameRecords();
    }
  }, [viewOwnRecords, userId]); // Make sure to include userId in the dependency array


  const isHandleAvailable = async (handle) => {
    if (!handle) return true; // Return true if the handle is empty
  
    try {
      const response = await axios.get(`https://noble-freehold-404519.ue.r.appspot.com/checkHandle?handle=${encodeURIComponent(handle)}&userId=${encodeURIComponent(userId)}`);
      return !response.data; // If the handle is in use, the endpoint should return true
    } catch (error) {
      console.error('Error checking handle:', error);
      return false; // Handle this as you see fit
    }
  };
  

  async function handleSubmit(event) {
    event.preventDefault();

    const handleAvailable = await isHandleAvailable(handle);

    if (!handleAvailable) {
      alert("This handle is already in use by another user. Please choose a different one.");
      return;
    }
    const postData = {
        userId,
        handle,
        score
    };
    try {
        const response = await axios.post('https://noble-freehold-404519.ue.r.appspot.com/addGameRecord', postData);
        console.log('Response:', response.data);
        //showAllRecords()
    } catch (error) {
        console.error('Error posting data:', error);
    }
    startNewRound();
  };

  const handleDontSubmit = () => {
    setSubmitChoice(false);
    startNewRound();
  };

  const startNewRound = () => {
    setGameOver(false);
    setSubmitChoice(null);
    setScore(0);
    setGuesses([]);
  };
  
  // function to call API to get all books in DB
  function displayAllGameRecords() {
    setLoading(true);
    axios.get('https://noble-freehold-404519.ue.r.appspot.com/showAllRecords')
      .then(response => {
        const sortedRecords = response.data.sort((a, b) => b.score - a.score);
        setGameRecords(sortedRecords);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }
  
  function displayUserGameRecords() {
    setLoading(true);
    axios.get(`https://noble-freehold-404519.ue.r.appspot.com/findByUserId?userId=${userId}`)
      .then(response => {
        const sortedRecords = response.data.sort((a, b) => b.score - a.score);
        setGameRecords(sortedRecords);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }
  
  const deleteUserGameRecords = () => {
    setLoading(true);
    axios.delete(`https://noble-freehold-404519.ue.r.appspot.com/deleteByUserId?userId=${userId}`)
      .then(response => {
        console.log('Records deleted:', response.data);
        displayUserGameRecords(); // Refresh the list after deletion
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };
  
  const updateUserHandle = (newHandle) => {
    setLoading(true);
    axios.put(`https://noble-freehold-404519.ue.r.appspot.com/updateHandleByUserId?userId=${userId}&newHandle=${newHandle}`)
      .then(response => {
        console.log('Handle updated:', response.data);
        setHandle(newHandle); // Update the handle in the state
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };
  
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };
  
  const signOut = () => {
    const auth = getAuth();
    auth.signOut();
  };
  
  const calculateScore = (numberOfGuesses) => {
    return (MAX_GUESSES - numberOfGuesses) * 10;
  };

  // Function to add a new guess to the state
  const addGuess = (newGuess) => {
    // Compare the new guess to the secret to determine exact and partial matches
    const results = compareGuessToSecret(newGuess, secret);
    // Update the guesses state with the new guess and the results of the comparison
    setGuesses(guesses.concat({ guess: newGuess, results }));
    const newGuesses = guesses.concat({ guess: newGuess, results });
    setGuesses(newGuesses);

    // Check if the game is over
    if (results.exacts === secret.length || newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      setScore(calculateScore(newGuesses.length));
      // Do not automatically submit. Instead, ask for user's choice.
      setSubmitChoice(null); // Reset the choice for a new game
    }
  };

  // Function to compare a guess to the secret
  const compareGuessToSecret = (guess, secret) => {
    let exacts = 0; // Counter for exact matches
    let partials = 0; // Counter for partial matches
    let secretArray = secret.split(''); // Split the secret into an array for comparison
    let guessArray = guess.split(''); // Split the guess into an array for comparison

    // Check for exact matches
    secretArray.forEach((s, index) => {
      if (s === guessArray[index]) {
        exacts++;
        // Nullify the matched elements to avoid recounting them in partial matches
        secretArray[index] = null;
        guessArray[index] = null;
      }
    });

    // Check for partial matches (correct color in the wrong place)
    guessArray.forEach((g, index) => {
      if (g && secretArray.includes(g)) {
        partials++;
        // Nullify the matched element in the secret array to avoid recounting
        secretArray[secretArray.indexOf(g)] = null;
      }
    });

    // Return the results as an object with exact and partial counts
    return { exacts, partials };
  };

  if (!isAuthenticated) {
    return (
      <div className="login-prompt">
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    );
  }
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render the main game app with a title, game board, and control panel
  return (
    <div className="app">
      <h1>MasterMind Game</h1>
      <GameBoard guesses={guesses} />
      <ControlPanel onGuessSubmit={gameOver ? null : addGuess} />
      {gameOver && (
      <div className="game-over-container">
        <p>Your score: {score}</p>
        {!submitChoice && (
          <div className="button-container">
            <button onClick={() => setSubmitChoice(true)}>Submit Score</button>
            <button onClick={handleDontSubmit}>Don't Submit</button>
            </div>
          )}
          {submitChoice && submitChoice === true && (
            <form onSubmit={handleSubmit}>
              <label>
                Handle (Your Game Name): 
                <input type="text" value={handle} onChange={e => setHandle(e.target.value)} />
              </label>
              <br />
              <button type="submit">Submit</button>
            </form>
          )}
          {submitChoice === false && <p>Game ended without submitting score.</p>}
        </div>
      )}


      <button onClick={() => setViewOwnRecords(!viewOwnRecords)}>
        {viewOwnRecords ? "View Hgih Score" : "View My Records"}
      </button>
      {/* Render only paginated records */}
      {currentRecords.map(gameRecord => (
        <div className="game-record-item" key={gameRecord.id}>
          <p>{gameRecord.handle} ID: {gameRecord.userId}</p>
          <p>Score: {gameRecord.score}, Date: {gameRecord.date}</p>
          {/* Include other game record details as needed */}
        </div>
      ))}


      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
        {[...Array(totalPages).keys()].map(number => (
          <button
            key={number}
            onClick={() => goToPage(number + 1)}
            disabled={currentPage === number + 1}
          >
            {number + 1}
          </button>
        ))}
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>

      <div className="user-actions-container">
        {isAuthenticated && userId && (
          <button onClick={deleteUserGameRecords}>Delete My Records</button>
        )}

        <div className="handle-update-container">
          <label>
            New Handle: 
            <input type="text" value={newHandle} onChange={e => setNewHandle(e.target.value)} />
          </label>
          <button onClick={() => updateUserHandle(newHandle)}>Update Handle</button>
        </div>

        <div className="user-info-container">
          <p>My Id: {userId}</p>
        </div>

        <div className="sign-out-container">
          <button onClick={signOut}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

// Export the App component for use in other files
export default App;
