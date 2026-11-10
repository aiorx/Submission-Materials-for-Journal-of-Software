// Aided with basic GitHub coding tools
import { Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';

/**
 * Wallet routes with Solana integration
 * @param fastify - Fastify instance
 */
export async function walletRoutes(fastify: FastifyInstance): Promise<void> {
  // Define shared schemas for reuse
  const TransactionSchema = Type.Object({
    id: Type.String(),
    hash: Type.String(),
    amount: Type.Number(),
    timestamp: Type.Number(),
    status: Type.String({ enum: ['confirmed', 'processing', 'failed'] }),
    type: Type.String({ enum: ['deposit', 'withdrawal', 'transfer'] }),
    address: Type.String(),
    confirmations: Type.Number(),
  });

  const TokenSchema = Type.Object({
    symbol: Type.String(),
    name: Type.String(),
    balance: Type.Number(),
    usdValue: Type.Number(),
    icon: Type.Optional(Type.String()),
    mintAddress: Type.String(),
    decimals: Type.Number(),
  });

  const ErrorSchema = Type.Object({
    message: Type.String(),
    code: Type.Optional(Type.Number()),
  });

  // Get wallet balance endpoint with caching
  fastify.get(
    '/balance/:address',
    {
      schema: {
        params: Type.Object({
          address: Type.String({ pattern: '^[1-9A-HJ-NP-Za-km-z]{32,44}$' }),
        }),
        response: {
          200: Type.Object({
            sol: Type.Number(),
            tokens: Type.Array(TokenSchema),
            totalValueUsd: Type.Number(),
          }),
          400: ErrorSchema,
          404: ErrorSchema,
        },
      },
      config: {
        // Use Redis caching if available with a 30 second TTL
        cache: {
          expiresIn: 30_000,
          privacy: 'private',
        },
      },
    },
    async (request, reply) => {
      const { address } = request.params as { address: string };

      try {
        // In production, this would integrate with your actual wallet service
        // const walletService = await import('../../services/wallet.service');
        // return await walletService.getBalance(address);

        // First check if we have this in Redis cache
        if (fastify.redis) {
          const cachedData = await fastify.redis.get(
            `wallet:balance:${address}`,
          );
          if (cachedData) {
            fastify.log.info(`Cache hit for wallet balance: ${address}`);
            return JSON.parse(cachedData);
          }
        }

        // Mock data for demonstration
        const result = {
          sol: 4.2069,
          tokens: [
            {
              symbol: 'USDC',
              name: 'USD Coin',
              balance: 1250.75,
              usdValue: 1250.75,
              icon: 'https://static.wikiflow.com/tokens/usdc.png',
              mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
              decimals: 6,
            },
            {
              symbol: 'WIKI',
              name: 'WikiFlow Token',
              balance: 25000,
              usdValue: 2500,
              icon: 'https://static.wikiflow.com/tokens/wiki.png',
              mintAddress: 'WIKLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
              decimals: 9,
            },
          ],
          totalValueUsd: 1250.75 + 2500 + 4.2069 * 109.25, // SOL price mock
        };

        // Store in Redis if available
        if (fastify.redis) {
          await fastify.redis.set(
            `wallet:balance:${address}`,
            JSON.stringify(result),
            'EX',
            30, // 30 seconds TTL
          );
        }

        return result;
      } catch (error) {
        fastify.log.error(error);
        throw new Error('Failed to fetch wallet balance');
      }
    },
  );

  // Get transaction history with pagination
  fastify.get(
    '/transactions/:address',
    {
      schema: {
        params: Type.Object({
          address: Type.String({ pattern: '^[1-9A-HJ-NP-Za-km-z]{32,44}$' }),
        }),
        querystring: Type.Object({
          limit: Type.Optional(
            Type.Number({ minimum: 1, maximum: 50, default: 10 }),
          ),
          offset: Type.Optional(Type.Number({ minimum: 0, default: 0 })),
          type: Type.Optional(
            Type.String({ enum: ['deposit', 'withdrawal', 'transfer', 'all'] }),
          ),
          tokenFilter: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({
            transactions: Type.Array(TransactionSchema),
            meta: Type.Object({
              total: Type.Number(),
              limit: Type.Number(),
              offset: Type.Number(),
            }),
          }),
          400: ErrorSchema,
        },
      },
    },
    async (request) => {
      const { address } = request.params as { address: string };
      const {
        limit = 10,
        offset = 0,
        type = 'all',
        tokenFilter,
      } = request.query as any;

      try {
        // In production, this would integrate with your actual wallet service
        // const walletService = await import('../../services/wallet.service');
        // return await walletService.getTransactionHistory(address, { limit, offset, type, tokenFilter });

        // Generate mock transactions
        const transactions = Array.from({ length: limit }).map((_, i) => {
          const idx = i + offset;
          const types = ['deposit', 'withdrawal', 'transfer'];
          const mockType = types[idx % types.length];
          const timestamp = Date.now() - idx * 3600 * 1000; // 1 hour apart

          return {
            id: `tx-${idx}`,
            hash: `${idx}ABCDEFabcdef1234567890${idx}`,
            amount: 100 / (idx + 1),
            timestamp,
            status: 'confirmed',
            type: mockType,
            address:
              mockType === 'transfer'
                ? 'Sol' + Math.random().toString(36).substring(2, 10)
                : address,
            confirmations: 35,
          };
        });

        // Apply type filter if not 'all'
        const filteredTransactions =
          type === 'all'
            ? transactions
            : transactions.filter((tx) => tx.type === type);

        return {
          transactions: filteredTransactions,
          meta: {
            total: 120, // Mock total
            limit,
            offset,
          },
        };
      } catch (error) {
        fastify.log.error(error);
        throw new Error('Failed to fetch transaction history');
      }
    },
  );

  // Send transaction endpoint
  fastify.post(
    '/send',
    {
      schema: {
        body: Type.Object({
          fromAddress: Type.String({
            pattern: '^[1-9A-HJ-NP-Za-km-z]{32,44}$',
          }),
          toAddress: Type.String({ pattern: '^[1-9A-HJ-NP-Za-km-z]{32,44}$' }),
          amount: Type.Number({ minimum: 0.000001 }),
          token: Type.Optional(Type.String()), // Token mint address, or 'SOL' for native
          memo: Type.Optional(Type.String({ maxLength: 100 })),
        }),
        response: {
          200: Type.Object({
            success: Type.Boolean(),
            txHash: Type.String(),
            blockTime: Type.Number(),
            fee: Type.Number(),
          }),
          400: ErrorSchema,
          401: ErrorSchema,
          500: ErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const {
        fromAddress,
        toAddress,
        amount,
        token = 'SOL',
        memo,
      } = request.body as any;

      try {
        // Rate limiting for transaction endpoints to prevent spam
        const clientIp = request.ip;
        const rateLimitKey = `ratelimit:tx:${clientIp}`;

        if (fastify.redis) {
          const current = await fastify.redis.incr(rateLimitKey);
          if (current === 1) {
            await fastify.redis.expire(rateLimitKey, 60); // 60 seconds window
          }

          if (current > 5) {
            // max 5 tx per minute
            return reply.code(429).send({
              message: 'Rate limit exceeded. Please try again later.',
              code: 429,
            });
          }
        }

        // In production, this would integrate with your actual wallet service
        // with proper authentication and validation
        // const walletService = await import('../../services/wallet.service');
        // return await walletService.sendTransaction({ fromAddress, toAddress, amount, token, memo });

        // Mock successful transaction response
        return {
          success: true,
          txHash:
            '4vJ5tP9ke2XrcrnRCJXUeYy59c993RZi4Z1Xp9y7GDCwWbgNhNmJk7xDQ1pUBxFRfKPZCBNkdKrZGC9vqRpqeyfP',
          blockTime: Math.floor(Date.now() / 1000),
          fee: 0.000005,
        };
      } catch (error) {
        fastify.log.error(error);
        throw new Error('Failed to send transaction');
      }
    },
  );

  // Websocket support for real-time transaction updates
  fastify.get(
    '/listen/:address',
    { websocket: true },
    (connection, request) => {
      const { address } = request.params as { address: string };

      fastify.log.info(
        `WebSocket connection established for address: ${address}`,
      );

      // Keep track of active connections
      const clients = fastify.websocketServer.clients;

      // Send a welcome message
      connection.socket.send(
        JSON.stringify({
          type: 'connection_established',
          address,
          timestamp: Date.now(),
        }),
      );

      // Set up interval to simulate real-time updates
      const interval = setInterval(() => {
        // Only send if socket is still open
        if (connection.socket.readyState === 1) {
          const mockTx = {
            type: 'transaction_update',
            data: {
              txHash: Math.random().toString(36).substring(2, 15),
              amount: Math.random() * 10,
              status: 'confirmed',
              timestamp: Date.now(),
            },
          };

          connection.socket.send(JSON.stringify(mockTx));
        }
      }, 10000); // every 10 seconds

      // Clean up on connection close
      connection.socket.on('close', () => {
        clearInterval(interval);
        fastify.log.info(`WebSocket connection closed for address: ${address}`);
      });
    },
  );
}
