// Aided with basic GitHub coding tools
var Module = require('@nestjs/common').Module;
var Global = require('@nestjs/common').Global;
var DrizzleService = require('./drizzle.service').DrizzleService;

/**
 * Global database module that provides the DrizzleService throughout the application
 */
@Global()
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
class DatabaseModule {}