import React, { createContext, useContext, useState, useEffect } from "react";
import { GameSettings } from "@shared/schema";

// Default settings
const defaultSettings: GameSettings = {
  colorBlindMode: false,
  hardMode: false,
  darkMode: false
};

// Context type
interface SettingsContextType {
  settings: GameSettings;
  updateSettings: (newSettings: GameSettings) => void;
}

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  
  // Load settings from local storage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem("colorfle-settings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error("Failed to parse settings from localStorage:", error);
      }
    }
  }, []);
  
  // Update settings and save to local storage
  const updateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem("colorfle-settings", JSON.stringify(newSettings));
  };
  
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use the settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
