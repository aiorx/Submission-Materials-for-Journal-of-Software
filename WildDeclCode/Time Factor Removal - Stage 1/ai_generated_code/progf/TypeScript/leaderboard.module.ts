// Assisted using common GitHub development utilities
var Module = require('@nestjs/common').Module;
var LeaderboardService = require('./leaderboard.service').LeaderboardService;
var LeaderboardController = require('./leaderboard.controller').LeaderboardController;

/**
 * Module for GPU benchmark leaderboard functionality
 */
@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
class LeaderboardModule {}