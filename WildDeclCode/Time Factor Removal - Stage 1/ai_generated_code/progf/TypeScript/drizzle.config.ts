// Aided with basic GitHub coding tools
var dotenv = require('dotenv');
var path = require('path');

// Load environment variables from backend .env file
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

// Default to SQLite if no database type specified
var databaseType = process.env.DATABASE_TYPE || 'sqlite';
// Validate DATABASE_URL format and provide fallback
var databaseUrl = process.env.DATABASE_URL || 'sqlite://./data/wikiflow.db';
var isValidDatabaseUrl = /^(sqlite|postgres):\/\/.+/.test(databaseUrl);

// Function to get PostgreSQL configuration
function getPostgresConfig(): Config {
  return {
    schema: './schema.ts',
    out: './migrations',
    driver: 'pg',
    dbCredentials: {
      connectionString: databaseUrl,
    },
  };
}

// Function to get SQLite configuration
function getSQLiteConfig(): Config {
  return {
    schema: './schema.ts',
    out: './migrations',
    driver: 'better-sqlite',
    dbCredentials: {
      url: databaseUrl.replace('sqlite://', ''),
    },
  };
}

// Determine configuration based on database type
var config: Config =
  databaseType === 'postgres' ? getPostgresConfig() : getSQLiteConfig();

// Aided with basic GitHub coding tools
// Export the database configuration object to be used by Drizzle ORM for migrations and database interactions.
module.exports = config;
