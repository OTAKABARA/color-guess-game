import { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

interface ColorPickerProps {
  color: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

export default function ColorPicker({ color, onSelect, onClose }: ColorPickerProps) {
  const { settings } = useSettings();
  const initialRgb = hexToRgb(color || "#6366F1");
  
  const [rgb, setRgb] = useState({
    r: initialRgb?.r ?? 99,
    g: initialRgb?.g ?? 102,
    b: initialRgb?.b ?? 241,
  });
  
  const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
  
  useEffect(() => {
    // Handle escape key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  
  // Color presets
  const colorPresets = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", 
    "#FF00FF", "#00FFFF", "#FF9900", "#9900FF",
    "#00FF99", "#FF0099", "#000000", "#FFFFFF", 
    "#F472B6", "#A78BFA", "#60A5FA", "#34D399"
  ];
  
  // Handle preset color selection
  const handlePresetClick = (presetColor: string) => {
    const rgb = hexToRgb(presetColor);
    if (rgb) {
      setRgb(rgb);
    }
  };
  
  // Handle slider changes
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, channel: 'r' | 'g' | 'b') => {
    const value = parseInt(e.target.value);
    setRgb({ ...rgb, [channel]: value });
  };
  
  // Handle select color
  const handleSelectColor = () => {
    onSelect(hexColor);
    onClose();
  };
  
  // Utility functions
  function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }
  
  function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Select a Color</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div>
          {/* Color Preview */}
          <div className="mb-6">
            <div 
              className="w-full h-24 rounded-lg mb-2"
              style={{ backgroundColor: hexColor }}
            ></div>
            <div className="text-center text-gray-700 dark:text-gray-300">{hexColor}</div>
          </div>
          
          {/* Sliders */}
          <div className="space-y-4 mb-6">
            {/* Red Channel */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Red</label>
                <span className="text-sm text-gray-500 dark:text-gray-400">{rgb.r}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="255" 
                value={rgb.r} 
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500" 
                onChange={(e) => handleSliderChange(e, 'r')}
              />
            </div>
            
            {/* Green Channel */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Green</label>
                <span className="text-sm text-gray-500 dark:text-gray-400">{rgb.g}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="255" 
                value={rgb.g} 
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" 
                onChange={(e) => handleSliderChange(e, 'g')}
              />
            </div>
            
            {/* Blue Channel */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Blue</label>
                <span className="text-sm text-gray-500 dark:text-gray-400">{rgb.b}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="255" 
                value={rgb.b} 
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                onChange={(e) => handleSliderChange(e, 'b')}
              />
            </div>
          </div>
          
          {/* Color Presets */}
          {!settings.hardMode && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Presets</h3>
              <div className="grid grid-cols-8 gap-2">
                {colorPresets.map((presetColor, index) => (
                  <div 
                    key={index}
                    className={`w-8 h-8 rounded-full cursor-pointer ${presetColor === '#FFFFFF' ? 'border border-gray-300 dark:border-gray-600' : ''}`}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handlePresetClick(presetColor)}
                  ></div>
                ))}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSelectColor}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
