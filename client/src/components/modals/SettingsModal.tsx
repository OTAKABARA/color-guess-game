import { useSettings } from "@/context/SettingsContext";
import { useColorGame } from "@/hooks/useColorGame";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const { resetGameData } = useColorGame();

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all your data? This cannot be undone.")) {
      resetGameData();
      alert("All data has been reset!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Color Blindness Support */}
          <div className="flex items-center justify-between pb-3 border-b dark:border-gray-700">
            <div>
              <h3 className="font-medium dark:text-white">Color Blind Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enhances color contrast and adds patterns</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.colorBlindMode}
                onChange={() => updateSettings({ ...settings, colorBlindMode: !settings.colorBlindMode })}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {/* Hard Mode */}
          <div className="flex items-center justify-between pb-3 border-b dark:border-gray-700">
            <div>
              <h3 className="font-medium dark:text-white">Hard Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">No presets, only RGB sliders</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.hardMode}
                onChange={() => updateSettings({ ...settings, hardMode: !settings.hardMode })}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {/* Dark Mode */}
          <div className="flex items-center justify-between pb-3 border-b dark:border-gray-700">
            <div>
              <h3 className="font-medium dark:text-white">Dark Theme</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.darkMode}
                onChange={() => updateSettings({ ...settings, darkMode: !settings.darkMode })}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {/* Reset Data */}
          <div className="pt-2">
            <button 
              onClick={handleResetData}
              className="w-full py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            >
              Reset All Data
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">This will clear all your statistics and saved games</p>
          </div>
        </div>
      </div>
    </div>
  );
}
