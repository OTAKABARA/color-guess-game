import {
  users,
  type User,
  type InsertUser,
  dailyColors,
  type DailyColors,
  type InsertDailyColors,
  gameStats,
  type GameStats,
  type InsertGameStats
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Daily colors operations
  getDailyColors(date: string): Promise<DailyColors | undefined>;
  createDailyColors(dailyColorData: InsertDailyColors): Promise<DailyColors>;
  
  // Game stats operations
  getGameStats(userId: number, date: string): Promise<GameStats | undefined>;
  createGameStats(gameStatsData: InsertGameStats): Promise<GameStats>;
  getUserGameStats(userId: number): Promise<GameStats[]>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dailyColors: Map<string, DailyColors>;
  private gameStats: Map<string, GameStats>; // key format: `${userId}-${date}`
  private userIdCounter: number;
  private dailyColorsIdCounter: number;
  private gameStatsIdCounter: number;

  constructor() {
    this.users = new Map();
    this.dailyColors = new Map();
    this.gameStats = new Map();
    this.userIdCounter = 1;
    this.dailyColorsIdCounter = 1;
    this.gameStatsIdCounter = 1;
    
    // Initialize with a few daily colors
    this.initializeDailyColors();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Daily colors operations
  async getDailyColors(date: string): Promise<DailyColors | undefined> {
    return this.dailyColors.get(date);
  }

  async createDailyColors(insertDailyColors: InsertDailyColors): Promise<DailyColors> {
    const id = this.dailyColorsIdCounter++;
    const dailyColorEntry: DailyColors = { ...insertDailyColors, id };
    this.dailyColors.set(insertDailyColors.date, dailyColorEntry);
    return dailyColorEntry;
  }

  // Game stats operations
  async getGameStats(userId: number, date: string): Promise<GameStats | undefined> {
    return this.gameStats.get(`${userId}-${date}`);
  }

  async createGameStats(insertGameStats: InsertGameStats): Promise<GameStats> {
    const id = this.gameStatsIdCounter++;
    const gameStatsEntry: GameStats = { ...insertGameStats, id };
    this.gameStats.set(`${insertGameStats.userId}-${insertGameStats.date}`, gameStatsEntry);
    return gameStatsEntry;
  }

  async getUserGameStats(userId: number): Promise<GameStats[]> {
    return Array.from(this.gameStats.values()).filter(
      (stats) => stats.userId === userId
    );
  }

  // Initialize with some daily colors
  private initializeDailyColors() {
    // Helper to generate a date string
    const getDateString = (daysOffset: number) => {
      const date = new Date();
      date.setDate(date.getDate() + daysOffset);
      return date.toISOString().split('T')[0];
    };

    // Today's colors
    this.createDailyColors({
      date: getDateString(0),
      colors: ["#E74C3C", "#2ECC71", "#3498DB", "#F1C40F"]
    });

    // Yesterday's colors
    this.createDailyColors({
      date: getDateString(-1),
      colors: ["#9B59B6", "#1ABC9C", "#F39C12", "#34495E"]
    });

    // Tomorrow's colors
    this.createDailyColors({
      date: getDateString(1),
      colors: ["#D35400", "#27AE60", "#2980B9", "#F1C40F"]
    });
  }
}

export const storage = new MemStorage();
