var Module = require('@nestjs/common').Module;
var TypeOrmModule = require('@nestjs/typeorm').TypeOrmModule;

var getOrmConfig = require('./database-ormconfig.constant').getOrmConfig;
var DatabaseService = require('./database.service').DatabaseService;

@Module({
  imports: [
    TypeOrmModule.forRoot(getOrmConfig())
  ],
  providers: [
    DatabaseService,
  ],
  exports: [
    DatabaseService
  ]
})
class DatabaseModule { }
