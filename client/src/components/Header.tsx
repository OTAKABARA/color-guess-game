import { useState } from "react";
import InstructionsModal from "./modals/InstructionsModal";
import StatsModal from "./modals/StatsModal";
import SettingsModal from "./modals/SettingsModal";

export default function Header() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fas fa-palette text-primary text-xl"></i>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            Colorfle
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveModal("stats")}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            aria-label="Statistics"
          >
            <i className="fas fa-chart-bar"></i>
          </button>
          <button
            onClick={() => setActiveModal("instructions")}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            aria-label="Help"
          >
            <i className="fas fa-question-circle"></i>
          </button>
          <button
            onClick={() => setActiveModal("settings")}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            aria-label="Settings"
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "instructions" && (
        <InstructionsModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "stats" && (
        <StatsModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "settings" && (
        <SettingsModal onClose={() => setActiveModal(null)} />
      )}
    </header>
  );
}
