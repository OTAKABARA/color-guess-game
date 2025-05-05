import { useColorGame } from "@/hooks/useColorGame";
import { formatDistanceToNow } from "date-fns";

interface ResultModalProps {
  onClose: () => void;
}

export default function ResultModal({ onClose }: ResultModalProps) {
  const { gameState, statistics, nextGameTime } = useColorGame();
  
  // Calculate time until next game
  const getNextGameCountdown = () => {
    if (!nextGameTime) return "--:--:--";
    
    try {
      return formatDistanceToNow(nextGameTime, { addSuffix: true });
    } catch (error) {
      return "--:--:--";
    }
  };

  // Calculate average guesses
  const calculateAvgGuesses = () => {
    const totalGuesses = Object.entries(statistics.guessDistribution)
      .reduce((acc, [guessNum, count]) => {
        return acc + (parseInt(guessNum) * count);
      }, 0);
      
    const totalWins = Object.values(statistics.guessDistribution).reduce((a, b) => a + b, 0);
    
    if (totalWins === 0) return "0.0";
    
    return (totalGuesses / totalWins).toFixed(1);
  };

  // Handle share button
  const handleShare = () => {
    const numGuesses = gameState.guesses.length;
    const emoji = gameState.won ? "🎉" : "😢";
    
    let resultGridText = "";
    gameState.guesses.forEach(guess => {
      guess.feedback.forEach(feedback => {
        if (feedback === "correct") resultGridText += "🟩";
        else if (feedback === "close") resultGridText += "🟨";
        else resultGridText += "🟥";
      });
      resultGridText += "\n";
    });
    
    const shareText = `Colorfle ${new Date(gameState.date).toLocaleDateString()} ${emoji}\n\n${resultGridText}\n${gameState.won ? `Solved in ${numGuesses}/6 guesses` : "Failed to solve today's puzzle"}\n\nPlay at: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: "My Colorfle Results",
        text: shareText,
      }).catch((error) => {
        console.log("Error sharing", error);
      });
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          alert("Results copied to clipboard!");
        })
        .catch((error) => {
          console.error("Failed to copy text: ", error);
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-primary">
            {gameState.won ? "You Won!" : "Game Over"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {gameState.won 
              ? `You guessed all colors correctly in ${gameState.guesses.length} ${gameState.guesses.length === 1 ? 'try' : 'tries'}`
              : "Better luck next time!"}
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Target Colors */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Today's Colors</h3>
            <div className="flex justify-center space-x-3">
              {gameState.targetColors.map((color, index) => (
                <div 
                  key={index}
                  className="w-16 h-16 rounded shadow-sm"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
            <div className="flex justify-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              {gameState.targetColors.map((color, index) => (
                <div key={index} className="w-16 text-center">{color}</div>
              ))}
            </div>
          </div>
          
          {/* Statistics Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xl font-bold dark:text-white">{statistics.gamesWon}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Games Won</div>
              </div>
              <div>
                <div className="text-xl font-bold dark:text-white">{statistics.currentStreak}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Win Streak</div>
              </div>
              <div>
                <div className="text-xl font-bold dark:text-white">{calculateAvgGuesses()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Avg Guesses</div>
              </div>
            </div>
          </div>
          
          {/* Share Results Section */}
          <div className="pt-2">
            <button 
              onClick={handleShare}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-md hover:shadow-md transition-all"
            >
              <i className="fas fa-share-alt mr-2"></i> Share Results
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              Next Colorfle {getNextGameCountdown()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
