var Test = require('@nestjs/testing').Test;
var TestingModule = require('@nestjs/testing').TestingModule;
var path = require('path');
var ConfigModule = require('nestjs-config').ConfigModule;
var ConfigService = require('nestjs-config').ConfigService;
import {
  BraintreeModule,
  BraintreeWebhookController,
  BraintreeWebhookModule,
  BraintreeSubscriptionCanceled,
  BraintreeSubscriptionExpired,
} from './..';
var BraintreeProvider = require('../braintree.provider');
var BraintreeWebhookProvider = require('../braintree.webhook.provider');

class SubscriptionProvider {
  @BraintreeSubscriptionCanceled()
  canceled() {}

  @BraintreeSubscriptionExpired()
  expired() {}
}

describe('BraintreeWebhookController', async function () {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
          path.resolve(__dirname, '__stubs__', 'config', '*.ts'),
        ),
        BraintreeModule.forRootAsync({
          useFactory: async config => config.get('braintree'),
          inject: [ConfigService],
        }),
        BraintreeWebhookModule,
      ],
      providers: [SubscriptionProvider],
    }).compile();
  });

  it('Webhook controller must instance', () => {
    const controller = module.get<BraintreeWebhookController>(
      BraintreeWebhookController,
    );

    expect(controller).toBeInstanceOf(BraintreeWebhookController);
  });

  it('webhookmodule should instance subscription provider', () => {
    const provider = module.get<SubscriptionProvider>(SubscriptionProvider);

    expect(provider).toBeInstanceOf(SubscriptionProvider);
  });

  it('wehook controller instances', () => {
    const braintreeWebhookController = module.get<BraintreeWebhookController>(
      BraintreeWebhookController,
    );

    expect(braintreeWebhookController.braintree).toBeInstanceOf(
      BraintreeProvider,
    );
    expect(braintreeWebhookController.webhookProvider).toBeInstanceOf(
      BraintreeWebhookProvider,
    );
  });
});
