// Assisted using common GitHub development utilities
import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { eq } from 'drizzle-orm';
import * as schema from '../../../drizzle/schema';
import { UserSettings, NewUserSettings } from '../../../drizzle/schema';

/**
 * Service for managing user settings and profiles
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly drizzleService: DrizzleService) {}

  /**
   * Get user settings by wallet address
   * @param walletAddress The wallet address to look up
   * @returns Promise with user settings if found
   */
  async getUserByWallet(walletAddress: string): Promise<UserSettings | null> {
    try {
      const result = await this.drizzleService.orm
        .select()
        .from(schema.userSettings)
        .where(eq(schema.userSettings.walletAddress, walletAddress))
        .limit(1);
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      this.logger.error(`Failed to get user by wallet: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Create or update user settings
   * @param settings The user settings to save
   * @returns Promise with the saved user settings
   */
  async saveUserSettings(settings: NewUserSettings): Promise<UserSettings> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByWallet(settings.walletAddress);
      
      if (existingUser) {
        // Update existing user
        const result = await this.drizzleService.orm
          .update(schema.userSettings)
          .set({
            ...settings,
            // Don't update these fields if not provided
            username: settings.username || existingUser.username,
            avatarUrl: settings.avatarUrl || existingUser.avatarUrl,
            isHiddenChampion: settings.isHiddenChampion !== undefined 
              ? settings.isHiddenChampion 
              : existingUser.isHiddenChampion,
          })
          .where(eq(schema.userSettings.walletAddress, settings.walletAddress))
          .returning();
        
        this.logger.log(`Updated user settings for wallet: ${settings.walletAddress}`);
        return result[0];
      } else {
        // Create new user
        const result = await this.drizzleService.orm
          .insert(schema.userSettings)
          .values(settings)
          .returning();
        
        this.logger.log(`Created new user settings for wallet: ${settings.walletAddress}`);
        return result[0];
      }
    } catch (error) {
      this.logger.error(`Failed to save user settings: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Set a user as a hidden champion (Konami code Easter egg)
   * @param walletAddress The wallet address to update
   * @returns Promise with the updated user settings
   */
  async setHiddenChampion(walletAddress: string): Promise<UserSettings> {
    try {
      const existingUser = await this.getUserByWallet(walletAddress);
      
      if (existingUser) {
        // Update existing user
        const result = await this.drizzleService.orm
          .update(schema.userSettings)
          .set({ isHiddenChampion: true })
          .where(eq(schema.userSettings.walletAddress, walletAddress))
          .returning();
        
        this.logger.log(`Set user ${walletAddress} as Hidden Champion`);
        return result[0];
      } else {
        // Create new user with hidden champion status
        return await this.saveUserSettings({
          walletAddress,
          walletType: 'unknown', // Default wallet type
          isHiddenChampion: true,
        });
      }
    } catch (error) {
      this.logger.error(`Failed to set hidden champion: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete user settings
   * @param walletAddress The wallet address to delete
   * @returns Promise indicating success
   */
  async deleteUser(walletAddress: string): Promise<boolean> {
    try {
      const result = await this.drizzleService.orm
        .delete(schema.userSettings)
        .where(eq(schema.userSettings.walletAddress, walletAddress));
      
      const success = result.changes > 0;
      if (success) {
        this.logger.log(`Deleted user settings for wallet: ${walletAddress}`);
      }
      
      return success;
    } catch (error) {
      this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
      throw error;
    }
  }
}