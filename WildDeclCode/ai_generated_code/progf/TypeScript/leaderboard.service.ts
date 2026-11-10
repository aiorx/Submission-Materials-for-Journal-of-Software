// Supported via standard GitHub programming aids
import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { eq, desc, and, sql } from 'drizzle-orm';
import * as schema from '../../../drizzle/schema';
import { NewLeaderboardEntry, LeaderboardEntry } from '../../../drizzle/schema';

/**
 * Service for managing the GPU benchmark leaderboard data
 */
@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(private readonly drizzleService: DrizzleService) {}

  /**
   * Get all leaderboard entries, sorted by score in descending order
   * @param limit Maximum number of entries to return
   * @returns Promise with array of leaderboard entries
   */
  async getAll(limit = 50): Promise<LeaderboardEntry[]> {
    try {
      const maxEntries = Math.min(
        parseInt(process.env.MAX_LEADERBOARD_ENTRIES || '100', 10),
        limit
      );
      
      return await this.drizzleService.orm
        .select()
        .from(schema.leaderboard)
        .orderBy(desc(schema.leaderboard.score))
        .limit(maxEntries);
    } catch (error) {
      this.logger.error(`Failed to get leaderboard entries: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Add a new entry to the leaderboard
   * @param entry The new leaderboard entry to add
   * @returns Promise with the created entry including ID
   */
  async addEntry(entry: NewLeaderboardEntry): Promise<LeaderboardEntry> {
    try {
      // Check if wallet already exists with better score
      if (entry.walletAddress) {
        const existingEntries = await this.drizzleService.orm
          .select()
          .from(schema.leaderboard)
          .where(eq(schema.leaderboard.walletAddress, entry.walletAddress))
          .orderBy(desc(schema.leaderboard.score))
          .limit(1);
        
        // If user has a better score already, don't add this one
        if (existingEntries.length > 0 && existingEntries[0].score >= entry.score) {
          this.logger.log(`User already has a better score (${existingEntries[0].score})`);
          return existingEntries[0];
        }
      }
      
      // Insert the new entry
      const result = await this.drizzleService.orm
        .insert(schema.leaderboard)
        .values(entry)
        .returning();
      
      this.logger.log(`Added new leaderboard entry: ${JSON.stringify(result[0])}`);
      return result[0];
    } catch (error) {
      this.logger.error(`Failed to add leaderboard entry: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get leaderboard entries for a specific wallet address
   * @param walletAddress The wallet address to look up
   * @returns Promise with array of matching leaderboard entries
   */
  async getByWallet(walletAddress: string): Promise<LeaderboardEntry[]> {
    try {
      return await this.drizzleService.orm
        .select()
        .from(schema.leaderboard)
        .where(eq(schema.leaderboard.walletAddress, walletAddress))
        .orderBy(desc(schema.leaderboard.score));
    } catch (error) {
      this.logger.error(`Failed to get leaderboard entries by wallet: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete a leaderboard entry by ID
   * @param id The ID of the entry to delete
   * @returns Promise indicating success
   */
  async deleteEntry(id: number): Promise<boolean> {
    try {
      const result = await this.drizzleService.orm
        .delete(schema.leaderboard)
        .where(eq(schema.leaderboard.id, id));
      
      return result.changes > 0;
    } catch (error) {
      this.logger.error(`Failed to delete leaderboard entry: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get user rank in the leaderboard
   * @param walletAddress The wallet address to get rank for
   * @returns Promise with rank information
   */
  async getUserRank(walletAddress: string): Promise<{ rank: number; total: number; topScore: number | null }> {
    try {
      // First get the user's top score
      const userScores = await this.drizzleService.orm
        .select()
        .from(schema.leaderboard)
        .where(eq(schema.leaderboard.walletAddress, walletAddress))
        .orderBy(desc(schema.leaderboard.score))
        .limit(1);
      
      if (!userScores.length) {
        return { rank: -1, total: 0, topScore: null };
      }
      
      const userTopScore = userScores[0].score;
      
      // Count total entries
      const totalCountResult = await this.drizzleService.orm
        .select({ count: sql<number>`count(*)` })
        .from(schema.leaderboard);
      
      // Count entries with higher or equal scores 
      const rankResult = await this.drizzleService.orm
        .select({ count: sql<number>`count(*)` })
        .from(schema.leaderboard)
        .where(sql`${schema.leaderboard.score} >= ${userTopScore}`);
      
      return {
        rank: rankResult[0].count,
        total: totalCountResult[0].count,
        topScore: userTopScore,
      };
    } catch (error) {
      this.logger.error(`Failed to get user rank: ${error.message}`, error.stack);
      throw error;
    }
  }
}