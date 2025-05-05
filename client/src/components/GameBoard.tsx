import { useState } from "react";
import { useColorGame } from "@/hooks/useColorGame";
import ColorPicker from "./ColorPicker";
import ResultModal from "./modals/ResultModal";

export default function GameBoard() {
  const { 
    gameState, 
    submitGuess, 
    clearCurrentGuess, 
    setCurrentGuessColor, 
    getFormattedDate,
    isGameCompleted
  } = useColorGame();
  
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  
  // Handle color selection
  const handleColorClick = (index: number) => {
    setActiveColorIndex(index);
  };
  
  // Handle color selection from picker
  const handleColorSelected = (color: string) => {
    if (activeColorIndex !== null) {
      setCurrentGuessColor(activeColorIndex, color);
    }
  };
  
  // Handle submit guess
  const handleSubmitGuess = () => {
    const allColorsSelected = gameState.currentGuess.every(color => color !== "");
    
    if (!allColorsSelected) {
      alert("Please select all four colors before submitting");
      return;
    }
    
    submitGuess();
    
    // Check if game is over after submission
    if (isGameCompleted()) {
      setShowResultModal(true);
    }
  };
  
  // Get feedback color class
  const getFeedbackColorClass = (feedback: 'correct' | 'close' | 'incorrect') => {
    switch (feedback) {
      case 'correct': return "bg-green-500";
      case 'close': return "bg-amber-500";
      case 'incorrect': return "bg-red-500";
    }
  };
  
  // Calculate remaining guess slots
  const remainingGuessSlots = Math.max(0, 6 - gameState.guesses.length - (gameState.gameOver ? 0 : 1));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6">
      {/* Target Color Display */}
      <div className="mb-6 text-center">
        <p className="text-gray-700 dark:text-gray-300 mb-3">Guess today's target colors:</p>
        <div className="flex justify-center space-x-4">
          {[0, 1, 2, 3].map((index) => (
            <div 
              key={index}
              className="w-16 h-16 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center"
              style={gameState.gameOver ? { backgroundColor: gameState.targetColors[index] } : {}}
            >
              {!gameState.gameOver && <span className="text-gray-400 dark:text-gray-500">?</span>}
            </div>
          ))}
        </div>
      </div>
      
      {/* Guess History */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
          Your Guesses ({gameState.guesses.length}/6)
        </h3>
        
        <div className="space-y-3">
          {/* Past Guesses */}
          {gameState.guesses.map((guess, guessIndex) => (
            <div key={guessIndex} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
              <div className="flex space-x-2 mb-2">
                {guess.colors.map((color, colorIndex) => (
                  <div 
                    key={colorIndex}
                    className="w-12 h-12 rounded" 
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
              <div className="flex space-x-2">
                {guess.feedback.map((feedback, feedbackIndex) => (
                  <div 
                    key={feedbackIndex}
                    className={`w-12 h-3 ${getFeedbackColorClass(feedback)} rounded-full`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Current Guess (if game not over) */}
          {!gameState.gameOver && (
            <div className="border-2 border-primary border-dashed rounded p-3">
              <div className="flex space-x-2">
                {[0, 1, 2, 3].map((index) => (
                  <div 
                    key={index}
                    onClick={() => handleColorClick(index)}
                    className={`w-12 h-12 rounded cursor-pointer ${
                      gameState.currentGuess[index] 
                        ? "" 
                        : "bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500"
                    } flex items-center justify-center`}
                    style={gameState.currentGuess[index] ? { backgroundColor: gameState.currentGuess[index] } : {}}
                  >
                    {!gameState.currentGuess[index] && (
                      <i className="fas fa-plus text-gray-400 dark:text-gray-300"></i>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty Guess Slots */}
          {Array.from({ length: remainingGuessSlots }).map((_, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 border-dashed rounded p-3 opacity-50">
              <div className="flex space-x-2">
                {[0, 1, 2, 3].map((colorIndex) => (
                  <div key={colorIndex} className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-600"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      {!gameState.gameOver && (
        <div className="flex justify-between">
          <button 
            onClick={clearCurrentGuess}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <i className="fas fa-trash-alt mr-1"></i> Clear
          </button>
          <button 
            onClick={handleSubmitGuess}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Submit Guess
          </button>
        </div>
      )}
      
      {/* Color Picker Modal */}
      {activeColorIndex !== null && (
        <ColorPicker 
          color={gameState.currentGuess[activeColorIndex] || ""}
          onSelect={handleColorSelected}
          onClose={() => setActiveColorIndex(null)}
        />
      )}
      
      {/* Result Modal */}
      {showResultModal && (
        <ResultModal onClose={() => setShowResultModal(false)} />
      )}
    </div>
  );
}
