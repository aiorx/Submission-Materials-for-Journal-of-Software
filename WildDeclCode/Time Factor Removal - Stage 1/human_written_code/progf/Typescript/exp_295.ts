var Module = require('@nestjs/common').Module;
var BrokerApiModule = require('@ta2-libs/broker-api').BrokerApiModule;
var LogLevels = require('@ta2-libs/logger').LogLevels;
var LoggerModule = require('@ta2-libs/logger').LoggerModule;
var MultiLogStrategy = require('@ta2-libs/logger').MultiLogStrategy;
var DataModule = require('@ta2-libs/modules').DataModule;
var EngineModule = require('@ta2-libs/modules').EngineModule;
var SharedModule = require('@ta2-libs/modules').SharedModule;
var TradeModule = require('@ta2-libs/modules').TradeModule;

var AppService = require('./app.service').AppService;
var StrategyModule = require('./strategy').StrategyModule;

@Module({
  imports: [
    BrokerApiModule,
    DataModule,
    StrategyModule,
    EngineModule,
    TradeModule,
    LoggerModule.forRoot({
      enableColors: true,
      minLogLevel: LogLevels.Debug,
      strategy: MultiLogStrategy,
    }),
    SharedModule,
  ],
  providers: [AppService],
})
class AppModule {}
