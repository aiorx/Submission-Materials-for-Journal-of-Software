// Assisted using common GitHub development utilities
var Module = require('@nestjs/common').Module;
var UserService = require('./user.service').UserService;
var UserController = require('./user.controller').UserController;

/**
 * Module for user management functionality
 */
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
class UserModule {}