var DynamicModule = require('@nestjs/common').DynamicModule;
var Global = require('@nestjs/common').Global;
var Module = require('@nestjs/common').Module;
var OnModuleInit = require('@nestjs/common').OnModuleInit;
var QueueModuleOptions = require('./queue.interfaces').QueueModuleOptions;
var QueueProvider = require('./queue.provider').QueueProvider;
var MetadataScanner = require('@nestjs/core/metadata-scanner').MetadataScanner;
var QueueInjection = require('./queue.decorators').QueueInjection;
var Queue = require('bull').Queue;

const defaultOptions: QueueModuleOptions = {
  name: "default",
  connection: {
    redis: {
      port: 6379
    }
  }
};

@Global()
@Module({
  providers: [QueueProvider, MetadataScanner]
})
class QueueModule implements OnModuleInit {
  constructor(
    private readonly provider: QueueProvider,
    @QueueInjection()
    private readonly queue: Queue
  ) {}

  onModuleInit() {
    const consumers = this.provider.getEventConsumers();

    if (consumers && consumers.length) {
      consumers.forEach(function consumer {
        this.queue.process(consumer.eventName, (...args) => {
          consumer.instance.callback = consumer.callback;
          return consumer.instance.callback(...args);
        });
      });
    }
  }

  static forRoot(options: QueueModuleOptions): DynamicModule {
    const currentOptions: QueueModuleOptions = Object.assign(
      defaultOptions,
      options
    );

    const [valueProvider, factoryProvider] = QueueProvider.createProviders(
      currentOptions
    );

    return {
      module: QueueModule,
      providers: [valueProvider, factoryProvider],
      exports: [factoryProvider]
    };
  }
}
