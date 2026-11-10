/**
 * Prisma client singleton to ensure only one instance is used across the application
 * This avoids connection limit issues and improves performance
 *
 * Aided with basic GitHub coding tools
 */
var PrismaClient = require('../prisma/app/generated/prisma/client').PrismaClient;

// Define a global variable to store the Prisma instance
var globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Create the Prisma client singleton
var prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// If we're not in production, add prisma to the global object to preserve it between hot reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Export prisma as db for Auth.js adapter
var db = prisma;
