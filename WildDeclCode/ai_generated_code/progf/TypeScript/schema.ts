// Assisted using common GitHub development utilities
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { pgTable, serial, varchar, timestamp, integer as pgInteger } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Determine if we're using SQLite or Postgres based on environment variable
const isDatabaseTypePostgres = process.env.DATABASE_TYPE === 'postgres';

// Schema for GPU benchmark leaderboard entries
export const leaderboardSqlite = sqliteTable('gpu_leaderboard', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  gpuInfo: text('gpu_info').notNull(),
  cpuInfo: text('cpu_info').notNull(),
  score: integer('score').notNull(),
  walletAddress: text('wallet_address'),
  walletType: text('wallet_type'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  browser: text('browser'),
  os: text('os'),
  verified: integer('verified', { mode: 'boolean' }).default(false),
});

export const leaderboardPg = pgTable('gpu_leaderboard', {
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
export const userSettingsSqlite = sqliteTable('user_settings', {
  walletAddress: text('wallet_address').primaryKey(),
  walletType: text('wallet_type').notNull(),
  username: text('username'),
  avatarUrl: text('avatar_url'),
  isHiddenChampion: integer('is_hidden_champion', { mode: 'boolean' }).default(false),
  lastLogin: text('last_login').default(sql`CURRENT_TIMESTAMP`),
});

export const userSettingsPg = pgTable('user_settings', {
  walletAddress: varchar('wallet_address', { length: 64 }).primaryKey(),
  walletType: varchar('wallet_type', { length: 20 }).notNull(),
  username: varchar('username', { length: 100 }),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  isHiddenChampion: pgInteger('is_hidden_champion').default(0),
  lastLogin: timestamp('last_login').defaultNow(),
});

// Export the tables based on the database type
export const leaderboard = isDatabaseTypePostgres ? leaderboardPg : leaderboardSqlite;
export const userSettings = isDatabaseTypePostgres ? userSettingsPg : userSettingsSqlite;

// Type definitions for table rows
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboard.$inferInsert;

export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;