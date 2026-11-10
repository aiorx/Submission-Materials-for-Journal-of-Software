// Assisted using common GitHub development utilities
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

/**
 * Module for user management functionality
 */
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}