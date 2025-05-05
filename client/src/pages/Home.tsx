import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameBoard from "@/components/GameBoard";
import Instructions from "@/components/Instructions";
import { useColorGame } from "@/hooks/useColorGame";
import { useSettings } from "@/context/SettingsContext";

export default function Home() {
  const { gameState, getFormattedDate, loading, error } = useColorGame();
  const { settings } = useSettings();
  const [isSharing, setIsSharing] = useState(false);

  // Handle share button click
  const handleShare = () => {
    setIsSharing(true);
    
    const shareText = `I'm playing Colorfle - the daily color guessing game! Join me at ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Colorfle - Daily Color Guessing Game",
        text: shareText,
        url: window.location.origin,
      })
        .then(() => setIsSharing(false))
        .catch((error) => {
          console.log("Error sharing", error);
          setIsSharing(false);
        });
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          alert("Link copied to clipboard!");
          setIsSharing(false);
        })
        .catch((error) => {
          console.error("Failed to copy text: ", error);
          setIsSharing(false);
        });
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 ${settings.colorBlindMode ? "colorblind-mode" : ""}`}>
      <Header />
      
      <main className="flex-grow p-4">
        <div className="max-w-md mx-auto">
          {/* Game Header */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold dark:text-white">Daily Color Challenge</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {loading ? "Loading..." : getFormattedDate()}
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
              <p>{error}</p>
            </div>
          )}
          
          {/* Game Board */}
          {!loading && <GameBoard />}
          
          {/* Instructions */}
          <Instructions />
          
          {/* Share Results */}
          <div className="text-center">
            <button 
              onClick={handleShare}
              disabled={isSharing}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-md shadow hover:shadow-md transition-all disabled:opacity-70"
            >
              <i className="fas fa-share-alt mr-2"></i> 
              {isSharing ? "Sharing..." : "Share Your Results"}
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
