// Assisted using common GitHub development utilities
var sqliteTable = require('drizzle-orm/sqlite-core').sqliteTable;
var text = require('drizzle-orm/sqlite-core').text;
var integer = require('drizzle-orm/sqlite-core').integer;
var primaryKey = require('drizzle-orm/sqlite-core').primaryKey;
var pgTable = require('drizzle-orm/pg-core').pgTable;
var serial = require('drizzle-orm/pg-core').serial;
var varchar = require('drizzle-orm/pg-core').varchar;
var timestamp = require('drizzle-orm/pg-core').timestamp;
var pgInteger = require('drizzle-orm/pg-core').integer;
var sql = require('drizzle-orm').sql;

// Determine if we're using SQLite or Postgres based on environment variable
var isDatabaseTypePostgres = process.env.DATABASE_TYPE === 'postgres';

// Schema for GPU benchmark leaderboard entries
var leaderboardSqlite = sqliteTable('gpu_leaderboard', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  gpuInfo: text('gpu_info').notNull(),
  cpuInfo: text('cpu_info').notNull(),
  score: integer('score').notNull(),
  walletAddress: text('wallet_address'),
  walletType: text('wallet_type'),
  createdAt: text('created_at').default(sql"CURRENT_TIMESTAMP"),
  browser: text('browser'),
  os: text('os'),
  verified: integer('verified', { mode: 'boolean' }).default(false),
});

var leaderboardPg = pgTable('gpu_leaderboard', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull(),
  gpuInfo: varchar('gpu_info', { length: 255 }).notNull(),
  cpuInfo: varchar('cpu_info', { length: 255 }).notNull(),
  score: pgInteger('score').notNull(),
  walletAddress: varchar('wallet_address', { length: 64 }),
  walletType: varchar('wallet_type', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  browser: varchar('browser', { length: 100 }),
  os: varchar('os', { length: 100 }),
  verified: pgInteger('verified').default(0),
});

// User settings table (minimal for now)
var userSettingsSqlite = sqliteTable('user_settings', {
  walletAddress: text('wallet_address').primaryKey(),
  walletType: text('wallet_type').notNull(),
  username: text('username'),
  avatarUrl: text('avatar_url'),
  isHiddenChampion: integer('is_hidden_champion', { mode: 'boolean' }).default(false),
  lastLogin: text('last_login').default(sql"CURRENT_TIMESTAMP"),
});

var userSettingsPg = pgTable('user_settings', {
  walletAddress: varchar('wallet_address', { length: 64 }).primaryKey(),
  walletType: varchar('wallet_type', { length: 20 }).notNull(),
  username: varchar('username', { length: 100 }),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  isHiddenChampion: pgInteger('is_hidden_champion').default(0),
  lastLogin: timestamp('last_login').defaultNow(),
});

// Export the tables based on the database type
var leaderboard = isDatabaseTypePostgres ? leaderboardPg : leaderboardSqlite;
var userSettings = isDatabaseTypePostgres ? userSettingsPg : userSettingsSqlite;

// Type definitions for table rows
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboard.$inferInsert;

export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;