// Supported via standard GitHub programming aids
import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { setTimeout } from 'timers/promises';

/**
 * Cache options for integration requests
 */
interface CacheOptions {
  ttl: number; // Time to live in seconds
  staleWhileRevalidate?: boolean; // Allow serving stale data while fetching fresh
  tags?: string[]; // Tags for cache invalidation by category
  forceRefresh?: boolean; // Force refresh the cache
}

/**
 * Integration request options
 */
interface IntegrationRequestOptions {
  timeout?: number; // Request timeout in ms
  retries?: number; // Number of retries on failure
  retryDelay?: number; // Delay between retries in ms
  fallbackValue?: any; // Value to return on failure
  circuitBreaker?: boolean; // Use circuit breaker pattern
  cache?: CacheOptions; // Caching options
  headers?: Record<string, string>; // Custom headers
}

/**
 * Integration request response
 */
interface IntegrationResponse<T> {
  data: T;
  meta: {
    source: 'cache' | 'api';
    timestamp: number;
    duration: number;
    requestId: string;
    cacheHit?: boolean;
    stale?: boolean;
  };
}

/**
 * Advanced integration service for external API communications with caching,
 * retries, circuit breaking, and more.
 */
export class IntegrationService {
  private static instance: IntegrationService;
  private static fastify: FastifyInstance;
  private circuitState: Map<
    string,
    {
      failures: number;
      lastFailure: number;
      status: 'open' | 'closed' | 'half-open';
    }
  > = new Map();
  private cacheStore: Map<
    string,
    { value: any; expires: number; tags: string[] }
  > = new Map();

  // Circuit breaker config
  private readonly CIRCUIT_THRESHOLD = 5; // Number of failures before opening circuit
  private readonly CIRCUIT_RESET_TIMEOUT = 30000; // Time to wait before trying again (30s)

  // Singleton pattern
  private constructor() {}

  /**
   * Initialize the integration service
   */
  public static async init(
    fastify: FastifyInstance,
  ): Promise<IntegrationService> {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
      IntegrationService.fastify = fastify;

      // Log initialization
      fastify.log.info('Integration service initialized');

      // Set up periodic cache cleanup
      setInterval(() => IntegrationService.instance.cleanupCache(), 60000); // Every minute

      // Register shutdown handler
      fastify.addShutdownListener(() => {
        fastify.log.info('Shutting down integration service');
        return Promise.resolve();
      });
    }

    return IntegrationService.instance;
  }

  /**
   * Get service instance
   */
  public static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      throw new Error('Integration service not initialized');
    }
    return IntegrationService.instance;
  }

  /**
   * Register cache service with Fastify
   */
  public static registerCacheService(fastify: FastifyInstance): void {
    // Attach cache service to fastify instance
    fastify.decorate('cache', {
      get: async (key: string) => IntegrationService.instance.getCacheItem(key),
      set: async (key: string, value: any, ttlSeconds = 3600) =>
        IntegrationService.instance.setCacheItem(key, value, ttlSeconds),
      del: async (key: string) =>
        IntegrationService.instance.deleteCacheItem(key),
      cleanup: () => IntegrationService.instance.cleanupCache(),
    });

    // Add cache statistics endpoint under monitoring
    fastify.get('/monitoring/cache', async () => {
      return {
        size: IntegrationService.instance.cacheStore.size,
        keys: Array.from(IntegrationService.instance.cacheStore.keys()),
        stats: {
          expired: Array.from(
            IntegrationService.instance.cacheStore.values(),
          ).filter((item) => item.expires < Date.now()).length,
          valid: Array.from(
            IntegrationService.instance.cacheStore.values(),
          ).filter((item) => item.expires >= Date.now()).length,
        },
      };
    });
  }

  /**
   * Make an API request with advanced features
   */
  public async request<T>(
    url: string,
    options: IntegrationRequestOptions = {},
  ): Promise<IntegrationResponse<T>> {
    const requestId = randomUUID();
    const startTime = performance.now();
    const {
      timeout = 10000,
      retries = 3,
      retryDelay = 500,
      fallbackValue = null,
      circuitBreaker = true,
      cache,
      headers = {},
    } = options;

    // Generate cache key if caching is enabled
    const cacheKey = cache
      ? `integration:${url}:${JSON.stringify(headers)}`
      : null;

    // Check circuit breaker state
    if (circuitBreaker && this.isCircuitOpen(url)) {
      IntegrationService.fastify.log.warn({
        requestId,
        msg: `Circuit open for ${url}, skipping request`,
        service: 'integration',
      });

      // Try to get from cache even if expired as fallback
      if (cacheKey) {
        const cachedValue = await this.getCacheItem(cacheKey, true);
        if (cachedValue) {
          return {
            data: cachedValue,
            meta: {
              source: 'cache',
              timestamp: Date.now(),
              duration: performance.now() - startTime,
              requestId,
              cacheHit: true,
              stale: true,
            },
          };
        }
      }

      // Return fallback value if circuit is open
      return {
        data: fallbackValue as T,
        meta: {
          source: 'api',
          timestamp: Date.now(),
          duration: performance.now() - startTime,
          requestId,
        },
      };
    }

    // Check cache if enabled and not forcing refresh
    if (cacheKey && !cache.forceRefresh) {
      const cachedValue = await this.getCacheItem(cacheKey);
      if (cachedValue) {
        // If we have a cached value, return it
        IntegrationService.fastify.log.debug({
          requestId,
          msg: `Cache hit for ${url}`,
          service: 'integration',
        });

        // If staleWhileRevalidate is enabled, refresh the cache in the background
        if (cache.staleWhileRevalidate) {
          this.refreshCacheInBackground(url, cacheKey, options);
        }

        return {
          data: cachedValue as T,
          meta: {
            source: 'cache',
            timestamp: Date.now(),
            duration: performance.now() - startTime,
            requestId,
            cacheHit: true,
          },
        };
      }
    }

    // Make the actual request with retries
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < retries + 1) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(timeout, () => controller.abort());

        IntegrationService.fastify.log.debug({
          requestId,
          msg: `Making request to ${url}${attempt > 0 ? ` (retry ${attempt})` : ''}`,
          service: 'integration',
        });

        // Make the request
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'WikiFlow/2025',
            Accept: 'application/json',
            ...headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle non-200 responses
        if (!response.ok) {
          throw new Error(
            `API returned ${response.status}: ${response.statusText}`,
          );
        }

        // Parse the response
        const data = await response.json();

        // Reset circuit breaker on success
        if (circuitBreaker) {
          this.resetCircuit(url);
        }

        // Store in cache if enabled
        if (cacheKey && cache) {
          await this.setCacheItem(cacheKey, data, cache.ttl, cache.tags);
        }

        // Return successful response
        return {
          data: data as T,
          meta: {
            source: 'api',
            timestamp: Date.now(),
            duration: performance.now() - startTime,
            requestId,
          },
        };
      } catch (error) {
        lastError = error as Error;

        IntegrationService.fastify.log.error({
          requestId,
          msg: `Error in request to ${url}: ${error.message}`,
          service: 'integration',
          error,
          attempt,
        });

        // Record failure for circuit breaker
        if (circuitBreaker) {
          this.recordFailure(url);
        }

        // Check if we should retry
        if (attempt < retries) {
          const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
          await setTimeout(delay);
          attempt++;
        } else {
          break;
        }
      }
    }

    // All attempts failed, try to get stale cache as fallback
    if (cacheKey) {
      const staleValue = await this.getCacheItem(cacheKey, true);
      if (staleValue) {
        IntegrationService.fastify.log.warn({
          requestId,
          msg: `Using stale cache for ${url} after failed requests`,
          service: 'integration',
        });

        return {
          data: staleValue as T,
          meta: {
            source: 'cache',
            timestamp: Date.now(),
            duration: performance.now() - startTime,
            requestId,
            cacheHit: true,
            stale: true,
          },
        };
      }
    }

    // Return fallback value if all else fails
    IntegrationService.fastify.log.error({
      requestId,
      msg: `All requests to ${url} failed, using fallback`,
      service: 'integration',
      error: lastError,
    });

    return {
      data: fallbackValue as T,
      meta: {
        source: 'api',
        timestamp: Date.now(),
        duration: performance.now() - startTime,
        requestId,
      },
    };
  }

  /**
   * Refresh cache in the background
   */
  private async refreshCacheInBackground(
    url: string,
    cacheKey: string,
    options: IntegrationRequestOptions,
  ): Promise<void> {
    // Clone options but force refresh and disable staleWhileRevalidate to avoid loops
    const refreshOptions = {
      ...options,
      cache: {
        ...options.cache,
        forceRefresh: true,
        staleWhileRevalidate: false,
      },
    };

    // Make the request in the background
    setTimeout(() => {
      this.request(url, refreshOptions).catch((error) => {
        IntegrationService.fastify.log.error({
          msg: `Background cache refresh failed for ${url}: ${error.message}`,
          service: 'integration',
          error,
        });
      });
    }, 0);
  }

  /**
   * Check if circuit is open for a URL
   */
  private isCircuitOpen(url: string): boolean {
    const circuit = this.circuitState.get(url);

    if (!circuit) {
      return false;
    }

    if (circuit.status === 'open') {
      // Check if enough time has passed to try again
      if (Date.now() - circuit.lastFailure > this.CIRCUIT_RESET_TIMEOUT) {
        // Move to half-open state
        this.circuitState.set(url, {
          ...circuit,
          status: 'half-open',
        });
        return false;
      }
      return true;
    }

    return false;
  }

  /**
   * Record a failure for circuit breaker
   */
  private recordFailure(url: string): void {
    const circuit = this.circuitState.get(url) || {
      failures: 0,
      lastFailure: 0,
      status: 'closed',
    };

    // If in half-open state, any failure opens the circuit
    if (circuit.status === 'half-open') {
      this.circuitState.set(url, {
        failures: circuit.failures + 1,
        lastFailure: Date.now(),
        status: 'open',
      });
      return;
    }

    // Increment failure count
    const newCircuit = {
      failures: circuit.failures + 1,
      lastFailure: Date.now(),
      status: circuit.status,
    };

    // Open circuit if threshold reached
    if (newCircuit.failures >= this.CIRCUIT_THRESHOLD) {
      newCircuit.status = 'open';
      IntegrationService.fastify.log.warn({
        msg: `Circuit breaker opened for ${url}`,
        service: 'integration',
        failures: newCircuit.failures,
      });
    }

    this.circuitState.set(url, newCircuit);
  }

  /**
   * Reset circuit breaker on success
   */
  private resetCircuit(url: string): void {
    const circuit = this.circuitState.get(url);

    if (circuit) {
      // If in half-open state and request succeeds, close the circuit
      if (circuit.status === 'half-open') {
        IntegrationService.fastify.log.info({
          msg: `Circuit breaker closed for ${url}`,
          service: 'integration',
        });
      }

      this.circuitState.set(url, {
        failures: 0,
        lastFailure: 0,
        status: 'closed',
      });
    }
  }

  /**
   * Get item from cache
   */
  private async getCacheItem(key: string, allowExpired = false): Promise<any> {
    const item = this.cacheStore.get(key);

    if (!item) {
      return null;
    }

    // Check if item is expired
    if (item.expires < Date.now() && !allowExpired) {
      return null;
    }

    return item.value;
  }

  /**
   * Set item in cache
   */
  private async setCacheItem(
    key: string,
    value: any,
    ttlSeconds = 3600,
    tags: string[] = [],
  ): Promise<void> {
    this.cacheStore.set(key, {
      value,
      expires: Date.now() + ttlSeconds * 1000,
      tags,
    });
  }

  /**
   * Delete item from cache
   */
  private async deleteCacheItem(key: string): Promise<void> {
    this.cacheStore.delete(key);
  }

  /**
   * Clean up expired cache items
   */
  private cleanupCache(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cacheStore.entries()) {
      if (item.expires < now) {
        this.cacheStore.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      IntegrationService.fastify.log.debug({
        msg: `Cleaned up ${cleanedCount} expired cache items`,
        service: 'integration',
        remainingItems: this.cacheStore.size,
      });
    }
  }

  /**
   * Invalidate cache by tag
   */
  public invalidateByTag(tag: string): number {
    let count = 0;

    for (const [key, item] of this.cacheStore.entries()) {
      if (item.tags.includes(tag)) {
        this.cacheStore.delete(key);
        count++;
      }
    }

    if (count > 0) {
      IntegrationService.fastify.log.info({
        msg: `Invalidated ${count} cache items with tag ${tag}`,
        service: 'integration',
      });
    }

    return count;
  }
}
