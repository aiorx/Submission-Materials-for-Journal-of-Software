// Assisted using common GitHub development utilities
import { Controller, Get, Post, Body, Param, Delete, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSettings, NewUserSettings } from '../../../drizzle/schema';

/**
 * Controller for user management API endpoints
 */
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  /**
   * Get user settings by wallet address
   * @param walletAddress The wallet address to look up
   * @returns User settings if found
   */
  @Get(':address')
  async getUserByWallet(@Param('address') walletAddress: string): Promise<UserSettings> {
    try {
      if (!walletAddress) {
        throw new BadRequestException('Wallet address is required');
      }
      
      const user = await this.userService.getUserByWallet(walletAddress);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      return user;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get user by wallet: ${error.message}`, error.stack);
      throw new BadRequestException('Could not retrieve user data');
    }
  }

  /**
   * Create or update user settings
   * @param settings The user settings to save
   * @returns The saved user settings
   */
  @Post()
  async saveUserSettings(@Body() settings: NewUserSettings): Promise<UserSettings> {
    try {
      if (!settings.walletAddress || !settings.walletType) {
        throw new BadRequestException('Wallet address and wallet type are required');
      }
      
      return await this.userService.saveUserSettings(settings);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to save user settings: ${error.message}`, error.stack);
      throw new BadRequestException('Could not save user settings');
    }
  }

  /**
   * Activate hidden champion status for a user (Konami code Easter egg)
   * @param walletAddress The wallet address to update
   * @returns The updated user settings
   */
  @Post(':address/hidden-champion')
  async setHiddenChampion(@Param('address') walletAddress: string): Promise<UserSettings> {
    try {
      if (!walletAddress) {
        throw new BadRequestException('Wallet address is required');
      }
      
      return await this.userService.setHiddenChampion(walletAddress);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to set hidden champion: ${error.message}`, error.stack);
      throw new BadRequestException('Could not update hidden champion status');
    }
  }

  /**
   * Delete user settings
   * @param walletAddress The wallet address to delete
   * @returns Success message
   */
  @Delete(':address')
  async deleteUser(@Param('address') walletAddress: string): Promise<{ success: boolean }> {
    try {
      if (!walletAddress) {
        throw new BadRequestException('Wallet address is required');
      }
      
      const success = await this.userService.deleteUser(walletAddress);
      if (!success) {
        throw new NotFoundException('User not found');
      }
      
      return { success };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
      throw new BadRequestException('Could not delete user');
    }
  }

  /**
   * Check if a user has hidden champion status
   * @param walletAddress The wallet address to check
   * @returns Hidden champion status
   */
  @Get(':address/is-champion')
  async isHiddenChampion(@Param('address') walletAddress: string): Promise<{ isChampion: boolean }> {
    try {
      if (!walletAddress) {
        throw new BadRequestException('Wallet address is required');
      }
      
      const user = await this.userService.getUserByWallet(walletAddress);
      return { isChampion: user?.isHiddenChampion || false };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to check champion status: ${error.message}`, error.stack);
      throw new BadRequestException('Could not check champion status');
    }
  }
}