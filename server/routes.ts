import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDailyColorsSchema, insertGameStatsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get daily colors for a specific date
  app.get("/api/daily-colors/:date", async (req, res) => {
    const { date } = req.params;

    try {
      const dailyColors = await storage.getDailyColors(date);
      
      if (!dailyColors) {
        return res.status(404).json({ message: "Daily colors not found for this date" });
      }
      
      return res.json(dailyColors);
    } catch (error) {
      console.error("Error fetching daily colors:", error);
      return res.status(500).json({ message: "Failed to fetch daily colors" });
    }
  });

  // Create new daily colors
  app.post("/api/daily-colors", async (req, res) => {
    try {
      const validatedData = insertDailyColorsSchema.parse(req.body);
      
      // Check if daily colors already exist for this date
      const existingColors = await storage.getDailyColors(validatedData.date);
      if (existingColors) {
        return res.status(409).json({ message: "Daily colors already exist for this date" });
      }
      
      const dailyColors = await storage.createDailyColors(validatedData);
      return res.status(201).json(dailyColors);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create daily colors" });
    }
  });

  // Save game stats
  app.post("/api/game-stats", async (req, res) => {
    try {
      const validatedData = insertGameStatsSchema.parse(req.body);
      
      const gameStats = await storage.createGameStats(validatedData);
      return res.status(201).json(gameStats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to save game stats" });
    }
  });

  // Get user's game stats
  app.get("/api/users/:userId/game-stats", async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const gameStats = await storage.getUserGameStats(userId);
      return res.json(gameStats);
    } catch (error) {
      console.error("Error fetching user game stats:", error);
      return res.status(500).json({ message: "Failed to fetch user game stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
