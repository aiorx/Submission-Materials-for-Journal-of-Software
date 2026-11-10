var Test = require('@nestjs/testing').Test;
var TestingModule = require('@nestjs/testing').TestingModule;
var AppController = require('./app.controller').AppController;
var AppService = require('./app.service').AppService;

describe('AppController', function () {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
