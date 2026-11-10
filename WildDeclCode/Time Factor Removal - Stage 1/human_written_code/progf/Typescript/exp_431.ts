var Module = require('@nestjs/common').Module;
var ConfigModule = require('@nestjs/config').ConfigModule;
var SequelizeModule = require('@nestjs/sequelize').SequelizeModule;
var AppController = require('./app.controller').AppController;
var AppService = require('./app.service').AppService;
var AuthModule = require('./auth/auth.module').AuthModule;
var Transaction = require('./transactions/entities/transaction.entity').Transaction;
var TransactionsModule = require('./transactions/transactions.module').TransactionsModule;
var TenantModule = require('./tenant/tenant.module').TenantModule;
//decorator - Javascript - Ecmascript 7

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_CONNECTION as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [Transaction],
      autoLoadModels: true,
      synchronize: true,
      sync: {
        alter: true,
        //  force: true
      },
    }),
    AuthModule,
    TransactionsModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}
