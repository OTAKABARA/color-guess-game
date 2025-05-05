import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { GameState, ColorGuess, GameStatistics, Color } from "@shared/schema";
import { calculateColorFeedback } from "@/lib/colorUtils";

// Default game state
const initialGameState: GameState = {
  date: new Date().toISOString().split('T')[0],
  targetColors: ["", "", "", ""],
  guesses: [],
  currentGuess: ["", "", "", ""],
  gameOver: false,
  won: false,
  activeColorIndex: null
};

// Default statistics
const initialStatistics: GameStatistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {},
  lastPlayed: null
};

export function useColorGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [statistics, setStatistics] = useState<GameStatistics>(initialStatistics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextGameTime, setNextGameTime] = useState<Date | null>(null);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check for next day for reset
  useEffect(() => {
    const checkForNextDay = () => {
      const currentDate = new Date().toISOString().split('T')[0];
      if (gameState.date !== currentDate) {
        initializeGame();
      }
    };

    // Calculate time until next game
    const calculateNextGameTime = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      setNextGameTime(tomorrow);
    };

    checkForNextDay();
    calculateNextGameTime();

    const interval = setInterval(checkForNextDay, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [gameState.date]);

  // Initialize the game
  const initializeGame = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if there's a saved game for today
      const currentDate = new Date().toISOString().split('T')[0];
      const savedGame = localStorage.getItem(`colorfle-game-${currentDate}`);
      
      if (savedGame) {
        // Restore saved game
        const parsedGame = JSON.parse(savedGame);
        setGameState(parsedGame);
      } else {
        // Start a new game
        await fetchDailyColors(currentDate);
      }
      
      // Load statistics
      loadStatistics();
    } catch (err) {
      setError("Failed to initialize game");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch daily colors from the API
  const fetchDailyColors = async (date: string) => {
    try {
      const response = await apiRequest("GET", `/api/daily-colors/${date}`);
      const data = await response.json();
      
      setGameState({
        ...initialGameState,
        date,
        targetColors: data.colors
      });
    } catch (err) {
      console.error("Failed to fetch daily colors:", err);
      
      // Fallback to generated colors if API fails
      const fallbackColors = generateFallbackColors();
      
      setGameState({
        ...initialGameState,
        date,
        targetColors: fallbackColors
      });
    }
  };

  // Generate fallback colors based on the date
  const generateFallbackColors = (): Color[] => {
    const date = new Date();
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    
    const colors: Color[] = [];
    for (let i = 0; i < 4; i++) {
      const hash = (seed * (i + 1)) % 16777215; // 16777215 = FFFFFF in decimal
      const hex = "#" + hash.toString(16).padStart(6, '0').toUpperCase();
      colors.push(hex);
    }
    
    return colors;
  };

  // Load statistics from localStorage
  const loadStatistics = () => {
    const savedStats = localStorage.getItem("colorfle-statistics");
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setStatistics(parsedStats);
      } catch (error) {
        console.error("Failed to parse statistics:", error);
        setStatistics(initialStatistics);
      }
    }
  };

  // Save game state to localStorage
  const saveGameState = (state: GameState) => {
    localStorage.setItem(`colorfle-game-${state.date}`, JSON.stringify(state));
  };

  // Save statistics to localStorage
  const saveStatistics = (stats: GameStatistics) => {
    localStorage.setItem("colorfle-statistics", JSON.stringify(stats));
  };

  // Set color for current guess
  const setCurrentGuessColor = (index: number, color: string) => {
    if (gameState.gameOver) return;
    
    const newCurrentGuess = [...gameState.currentGuess];
    newCurrentGuess[index] = color;
    
    const newState = {
      ...gameState,
      currentGuess: newCurrentGuess,
    };
    
    setGameState(newState);
    saveGameState(newState);
  };

  // Clear current guess
  const clearCurrentGuess = () => {
    if (gameState.gameOver) return;
    
    const newState = {
      ...gameState,
      currentGuess: ["", "", "", ""],
    };
    
    setGameState(newState);
    saveGameState(newState);
  };

  // Submit a guess
  const submitGuess = () => {
    if (gameState.gameOver) return;
    
    // Validate all colors are selected
    if (gameState.currentGuess.some(color => !color)) {
      return;
    }
    
    // Calculate feedback
    const feedback = calculateColorFeedback(gameState.currentGuess, gameState.targetColors);
    
    // Create a new guess
    const newGuess: ColorGuess = {
      colors: [...gameState.currentGuess],
      feedback
    };
    
    // Check if won
    const won = feedback.every(f => f === 'correct');
    const gameOver = won || gameState.guesses.length >= 5; // 6 guesses total (0-5)
    
    // Update game state
    const newState = {
      ...gameState,
      guesses: [...gameState.guesses, newGuess],
      currentGuess: ["", "", "", ""],
      gameOver,
      won
    };
    
    setGameState(newState);
    saveGameState(newState);
    
    // Update statistics if game is over
    if (gameOver) {
      updateStatistics(won, newState.guesses.length + 1);
    }
  };

  // Update game statistics
  const updateStatistics = (won: boolean, numGuesses: number) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Check if this is the first game of the day
    if (statistics.lastPlayed === currentDate) {
      return; // Already played today, don't update stats again
    }
    
    const newStatistics = { ...statistics };
    
    // Update general stats
    newStatistics.gamesPlayed++;
    
    if (won) {
      newStatistics.gamesWon++;
      newStatistics.currentStreak++;
      
      // Update max streak
      if (newStatistics.currentStreak > newStatistics.maxStreak) {
        newStatistics.maxStreak = newStatistics.currentStreak;
      }
      
      // Update guess distribution
      newStatistics.guessDistribution[numGuesses] = 
        (newStatistics.guessDistribution[numGuesses] || 0) + 1;
    } else {
      // Reset streak on loss
      newStatistics.currentStreak = 0;
    }
    
    // Update last played date
    newStatistics.lastPlayed = currentDate;
    
    setStatistics(newStatistics);
    saveStatistics(newStatistics);
  };

  // Reset all game data
  const resetGameData = () => {
    // Clear game state
    localStorage.removeItem(`colorfle-game-${gameState.date}`);
    
    // Reset statistics
    setStatistics(initialStatistics);
    localStorage.removeItem("colorfle-statistics");
    
    // Initialize a new game
    initializeGame();
  };

  // Format the current date
  const getFormattedDate = () => {
    return new Date(gameState.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if game is completed (won or lost)
  const isGameCompleted = () => {
    return gameState.gameOver;
  };

  return {
    gameState,
    statistics,
    loading,
    error,
    nextGameTime,
    setCurrentGuessColor,
    clearCurrentGuess,
    submitGuess,
    resetGameData,
    getFormattedDate,
    isGameCompleted
  };
}
