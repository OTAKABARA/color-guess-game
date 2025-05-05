import { useColorGame } from "@/hooks/useColorGame";
import { formatDistanceToNow } from "date-fns";

interface StatsModalProps {
  onClose: () => void;
}

export default function StatsModal({ onClose }: StatsModalProps) {
  const { statistics, nextGameTime } = useColorGame();
  
  // Calculate win percentage
  const winPercentage = statistics.gamesPlayed > 0
    ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
    : 0;
    
  // Get the maximum count in the guess distribution for scaling
  const maxCount = Math.max(...Object.values(statistics.guessDistribution), 1);
  
  // Calculate time until next game
  const getNextGameCountdown = () => {
    if (!nextGameTime) return "--:--:--";
    
    try {
      return formatDistanceToNow(nextGameTime, { addSuffix: false });
    } catch (error) {
      return "--:--:--";
    }
  };

  // Handle share button
  const handleShare = () => {
    const shareText = `Colorfle Stats\n\nGames Played: ${statistics.gamesPlayed}\nWin %: ${winPercentage}%\nCurrent Streak: ${statistics.currentStreak}\nMax Streak: ${statistics.maxStreak}\n\nPlay at: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: "My Colorfle Stats",
        text: shareText,
      }).catch((error) => {
        console.log("Error sharing", error);
      });
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          alert("Statistics copied to clipboard!");
        })
        .catch((error) => {
          console.error("Failed to copy text: ", error);
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold dark:text-white">{statistics.gamesPlayed}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Played</div>
            </div>
            <div>
              <div className="text-2xl font-bold dark:text-white">{winPercentage}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Win %</div>
            </div>
            <div>
              <div className="text-2xl font-bold dark:text-white">{statistics.currentStreak}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold dark:text-white">{statistics.maxStreak}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Max Streak</div>
            </div>
          </div>
          
          {/* Guess Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guess Distribution</h3>
            
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((guessNumber) => {
                const count = statistics.guessDistribution[guessNumber] || 0;
                const width = maxCount > 0 ? `${(count / maxCount) * 100}%` : "0%";
                return (
                  <div className="flex items-center" key={guessNumber}>
                    <div className="w-3 text-gray-700 dark:text-gray-300 mr-2">{guessNumber}</div>
                    <div 
                      className="bg-primary bg-opacity-80 h-5 rounded px-2 text-right text-white text-xs flex items-center justify-end"
                      style={{ width: width === "0%" ? "0" : width }}
                    >
                      {count > 0 && count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Next game countdown */}
          <div className="border-t dark:border-gray-700 pt-4 text-center">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Next Colorfle</h3>
            <div className="text-xl font-mono dark:text-white">{getNextGameCountdown()}</div>
          </div>
          
          {/* Share button */}
          <div>
            <button 
              onClick={handleShare}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-md hover:shadow-md transition-all"
            >
              <i className="fas fa-share-alt mr-2"></i> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
