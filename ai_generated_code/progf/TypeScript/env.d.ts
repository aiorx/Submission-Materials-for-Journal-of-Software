// Aided with basic GitHub coding tools
/**
 * Environment variable type declarations
 * Ensures type-safe access to environment variables throughout the application
 */

// Declare environment variables with their expected types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Server configuration
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      HOST?: string;

      // API configuration
      API_PREFIX?: string;
      API_VERSION?: string;
      API_TIMEOUT?: string;

      // CORS configuration
      CORS_ORIGIN?: string;

      // Database configuration
      DATABASE_TYPE?: 'sqlite' | 'postgres';
      DATABASE_URL?: string;
      AUTO_MIGRATE?: string;

      // Authentication settings
      JWT_SECRET?: string;
      JWT_EXPIRES_IN?: string;

      // WebSocket configuration
      WS_PATH?: string;

      // Log configuration
      LOG_LEVEL?: 'error' | 'warn' | 'log' | 'debug' | 'verbose';

      // Feature flags
      ENABLE_RATE_LIMIT?: string;
      ENABLE_SWAGGER?: string;

      // Miscellaneous
      npm_package_version?: string;
    }
  }
}
