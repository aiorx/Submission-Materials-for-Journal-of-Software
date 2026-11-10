// Aided with basic GitHub coding tools
import { Redis } from '@fastify/redis';
import 'fastify';
import { WebSocket } from 'ws';

/**
 * Enhanced type definitions for Fastify server with all plugins
 */
declare module 'fastify' {
  interface FastifyInstance {
    // Redis plugin
    redis?: Redis;

    // WebSocket server
    websocketServer: {
      clients: Set<WebSocket>;
    };

    // Broadcast function for WebSockets
    broadcast: (channel: string, message: any) => void;

    // Cache service
    cache: {
      get: (key: string) => Promise<any>;
      set: (key: string, value: any, ttlSeconds?: number) => Promise<void>;
      del: (key: string) => Promise<void>;
      cleanup: () => void;
    };

    // Config from env plugin
    config: {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      HOST: string;
      REDIS_URL?: string;
      JWT_SECRET: string;
      RATE_LIMIT: number;
      RATE_LIMIT_TIMEWINDOW: string;
      API_PREFIX: string;
      ENABLE_SWAGGER: boolean;
      MAX_PAYLOAD_SIZE: string;
      [key: string]: any;
    };
  }

  // Route configuration with caching
  interface RouteOptions {
    config?: {
      cache?: {
        expiresIn: number;
        privacy: 'public' | 'private';
      };
    };
  }
}

/**
 * Performance metrics for monitoring
 */
export interface PerformanceMetrics {
  requestCount: number;
  responseTime: {
    avg: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  };
  errorRate: number;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  cpuUsage: number;
}

/**
 * Error response shape for consistent API responses
 */
export interface ErrorResponse {
  error: string;
  statusCode: number;
  message?: string;
  requestId?: string;
}

/**
 * Standardized API response format
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
  requestId: string;
  timestamp: number;
}

/**
 * Route handler context with common utilities
 */
export interface RouteContext {
  requestId: string;
  startTime: number;
  authenticated: boolean;
  userId?: string;
  roles?: string[];
}
