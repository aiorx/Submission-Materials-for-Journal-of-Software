"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSettings = exports.leaderboard = exports.userSettingsPg = exports.userSettingsSqlite = exports.leaderboardPg = exports.leaderboardSqlite = void 0;
// Supported via standard GitHub programming aids
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Determine if we're using SQLite or Postgres based on environment variable
const isDatabaseTypePostgres = process.env.DATABASE_TYPE === 'postgres';
// Schema for GPU benchmark leaderboard entries
exports.leaderboardSqlite = (0, sqlite_core_1.sqliteTable)('gpu_leaderboard', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    username: (0, sqlite_core_1.text)('username').notNull(),
    gpuInfo: (0, sqlite_core_1.text)('gpu_info').notNull(),
    cpuInfo: (0, sqlite_core_1.text)('cpu_info').notNull(),
    score: (0, sqlite_core_1.integer)('score').notNull(),
    walletAddress: (0, sqlite_core_1.text)('wallet_address'),
    walletType: (0, sqlite_core_1.text)('wallet_type'),
    createdAt: (0, sqlite_core_1.text)('created_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    browser: (0, sqlite_core_1.text)('browser'),
    os: (0, sqlite_core_1.text)('os'),
    verified: (0, sqlite_core_1.integer)('verified', { mode: 'boolean' }).default(false),
});
exports.leaderboardPg = (0, pg_core_1.pgTable)('gpu_leaderboard', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    username: (0, pg_core_1.varchar)('username', { length: 100 }).notNull(),
    gpuInfo: (0, pg_core_1.varchar)('gpu_info', { length: 255 }).notNull(),
    cpuInfo: (0, pg_core_1.varchar)('cpu_info', { length: 255 }).notNull(),
    score: (0, pg_core_1.integer)('score').notNull(),
    walletAddress: (0, pg_core_1.varchar)('wallet_address', { length: 64 }),
    walletType: (0, pg_core_1.varchar)('wallet_type', { length: 20 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    browser: (0, pg_core_1.varchar)('browser', { length: 100 }),
    os: (0, pg_core_1.varchar)('os', { length: 100 }),
    verified: (0, pg_core_1.integer)('verified').default(0),
});
// User settings table (minimal for now)
exports.userSettingsSqlite = (0, sqlite_core_1.sqliteTable)('user_settings', {
    walletAddress: (0, sqlite_core_1.text)('wallet_address').primaryKey(),
    walletType: (0, sqlite_core_1.text)('wallet_type').notNull(),
    username: (0, sqlite_core_1.text)('username'),
    avatarUrl: (0, sqlite_core_1.text)('avatar_url'),
    isHiddenChampion: (0, sqlite_core_1.integer)('is_hidden_champion', { mode: 'boolean' }).default(false),
    lastLogin: (0, sqlite_core_1.text)('last_login').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.userSettingsPg = (0, pg_core_1.pgTable)('user_settings', {
    walletAddress: (0, pg_core_1.varchar)('wallet_address', { length: 64 }).primaryKey(),
    walletType: (0, pg_core_1.varchar)('wallet_type', { length: 20 }).notNull(),
    username: (0, pg_core_1.varchar)('username', { length: 100 }),
    avatarUrl: (0, pg_core_1.varchar)('avatar_url', { length: 255 }),
    isHiddenChampion: (0, pg_core_1.integer)('is_hidden_champion').default(0),
    lastLogin: (0, pg_core_1.timestamp)('last_login').defaultNow(),
});
// Export the tables based on the database type
exports.leaderboard = isDatabaseTypePostgres ? exports.leaderboardPg : exports.leaderboardSqlite;
exports.userSettings = isDatabaseTypePostgres ? exports.userSettingsPg : exports.userSettingsSqlite;
