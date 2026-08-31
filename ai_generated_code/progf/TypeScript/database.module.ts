// Aided with basic GitHub coding tools
import { Module, Global } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';

/**
 * Global database module that provides the DrizzleService throughout the application
 */
@Global()
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DatabaseModule {}