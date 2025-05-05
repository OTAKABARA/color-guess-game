import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Daily colors schema
export const dailyColors = pgTable("daily_colors", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(), // Format: YYYY-MM-DD
  colors: jsonb("colors").notNull(), // Array of 4 hex colors
});

export const insertDailyColorsSchema = createInsertSchema(dailyColors).pick({
  date: true,
  colors: true,
});

// Game stats schema
export const gameStats = pgTable("game_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: text("date").notNull(), // Format: YYYY-MM-DD
  guesses: integer("guesses"), // null if user didn't win
  completed: timestamp("completed"), // When the game was completed
});

export const insertGameStatsSchema = createInsertSchema(gameStats).pick({
  userId: true,
  date: true,
  guesses: true,
  completed: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type DailyColors = typeof dailyColors.$inferSelect;
export type InsertDailyColors = z.infer<typeof insertDailyColorsSchema>;

export type GameStats = typeof gameStats.$inferSelect;
export type InsertGameStats = z.infer<typeof insertGameStatsSchema>;

// Color type
export type Color = string; // Hex format: #RRGGBB

// Game related types
export type ColorGuess = {
  colors: Color[];
  feedback: ('correct' | 'close' | 'incorrect')[];
};

export type GameState = {
  date: string;
  targetColors: Color[];
  guesses: ColorGuess[];
  currentGuess: Color[];
  gameOver: boolean;
  won: boolean;
  activeColorIndex: number | null;
};

export type GameSettings = {
  colorBlindMode: boolean;
  hardMode: boolean;
  darkMode: boolean;
};

export type GameStatistics = {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
  lastPlayed: string | null;
};
