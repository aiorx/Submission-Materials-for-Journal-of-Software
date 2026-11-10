var Test = require('@nestjs/testing').Test;
var TestingModule = require('@nestjs/testing').TestingModule;
var AppController = require('./app.controller').AppController;
var AppService = require('./app.service').AppService;

describe('AppController', function () {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService]
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });
    });
});
