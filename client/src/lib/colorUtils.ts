import { Color } from "@shared/schema";

// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate distance between two colors (Euclidean distance in RGB space)
export function calculateColorDistance(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return Infinity;
  
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

// Calculate feedback for a guess compared to target colors
export function calculateColorFeedback(
  guessColors: Color[],
  targetColors: Color[]
): ('correct' | 'close' | 'incorrect')[] {
  return guessColors.map((guessColor, index) => {
    const targetColor = targetColors[index];
    const distance = calculateColorDistance(guessColor, targetColor);
    
    // Thresholds for feedback
    // Perfect match: distance = 0
    // Close: distance < 100 (fairly arbitrary, can be adjusted)
    if (distance === 0) {
      return 'correct';
    } else if (distance < 100) {
      return 'close';
    } else {
      return 'incorrect';
    }
  });
}

// Generate a random hex color
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Get a color scheme based on a seed
export function generateColorScheme(seed: number, count: number = 4): string[] {
  const colors: string[] = [];
  const baseHue = seed % 360;
  
  for (let i = 0; i < count; i++) {
    const hue = (baseHue + i * (360 / count)) % 360;
    const saturation = 70 + Math.sin(seed * (i + 1)) * 30;
    const lightness = 50 + Math.cos(seed * (i + 1)) * 10;
    
    colors.push(hslToHex(hue, saturation, lightness));
  }
  
  return colors;
}

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
