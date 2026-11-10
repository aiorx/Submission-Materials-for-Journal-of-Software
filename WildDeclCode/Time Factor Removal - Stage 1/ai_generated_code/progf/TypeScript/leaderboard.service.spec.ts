// Supported via standard GitHub programming aids
var Test = require('@nestjs/testing').Test;
var TestingModule = require('@nestjs/testing').TestingModule;
var DrizzleService = require('../database/drizzle.service').DrizzleService;
var WebSocketGateway = require('../gateways/websocket.gateway').WebSocketGateway;
var LeaderboardService = require('./leaderboard.service').LeaderboardService;

// Mock the DrizzleService
var mockDrizzleService = {
  orm: {
    query: jest.fn(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  },
};

// Mock the WebSocketGateway
var mockWebSocketGateway = {
  broadcastLeaderboardUpdate: jest.fn(),
  notifyWallet: jest.fn(),
};

describe('LeaderboardService', function () {
  var service: LeaderboardService;
  var drizzleService: DrizzleService;
  var gateway: WebSocketGateway;

  beforeEach(async () => {
    var module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        { provide: DrizzleService, useValue: mockDrizzleService },
        { provide: WebSocketGateway, useValue: mockWebSocketGateway },
      ],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
    drizzleService = module.get<DrizzleService>(DrizzleService);
    gateway = module.get<WebSocketGateway>(WebSocketGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLeaderboard', () => {
    it('should return the leaderboard rankings', async () => {
      // Arrange
      var mockRankings = [
        { walletAddress: '0x123', score: 100, rank: 1 },
        { walletAddress: '0x456', score: 90, rank: 2 },
      ];

      mockDrizzleService.orm.execute.mockResolvedValueOnce(mockRankings);

      // Act
      var result = await service.getLeaderboard({
        timeFrame: 'all',
        limit: 10,
      });

      // Assert
      expect(result).toEqual({
        rankings: mockRankings,
        timeFrame: 'all',
        totalCount: mockRankings.length,
      });

      expect(mockDrizzleService.orm.execute).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      // Arrange
      mockDrizzleService.orm.execute.mockResolvedValueOnce([]);

      // Act
      var result = await service.getLeaderboard({ timeFrame: 'daily' });

      // Assert
      expect(result).toEqual({
        rankings: [],
        timeFrame: 'daily',
        totalCount: 0,
      });
    });

    it('should use default parameters when none provided', async () => {
      // Arrange
      mockDrizzleService.orm.execute.mockResolvedValueOnce([]);

      // Act
      await service.getLeaderboard({});

      // Assert
      expect(mockDrizzleService.orm.execute).toHaveBeenCalled();
      // Could add more specific assertions here based on your implementation
    });
  });

  describe('updateScore', () => {
    it('should update a user score and broadcast the update', async () => {
      // Arrange
      var walletAddress = '0x123';
      var score = 150;
      var mockUser = { walletAddress, score, rank: 1 };

      mockDrizzleService.orm.execute.mockResolvedValueOnce([mockUser]);

      // Act
      await service.updateScore(walletAddress, score);

      // Assert
      expect(mockDrizzleService.orm.execute).toHaveBeenCalled();
      expect(gateway.broadcastLeaderboardUpdate).toHaveBeenCalled();
      expect(gateway.notifyWallet).toHaveBeenCalledWith(
        walletAddress,
        expect.objectContaining({
          type: 'score',
        }),
      );
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      var walletAddress = '0x123';
      var score = 150;

      mockDrizzleService.orm.execute.mockRejectedValueOnce(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(service.updateScore(walletAddress, score)).rejects.toThrow();
    });
  });

  // Add more test cases for other methods in the service
});
