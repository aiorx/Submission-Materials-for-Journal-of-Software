require('reflect-metadata');
var DialogFlowAction = require('../src/decorators/dialog-flow-action.decorator').DialogFlowAction;
var DialogFlowIntent = require('../src/decorators/dialog-flow-intent.decorator').DialogFlowIntent;
var DialogFlowParam = require('../src/decorators/dialog-flow-param.decorator').DialogFlowParam;
var DialogFlowResponse = require('../src/interfaces/dialog-flow-response.interface').DialogFlowResponse;
var dialogFlowResponseData = require('./fixtures/data').dialogFlowResponseData;
var OutputContexts = require('../src/interfaces/dialog-flow-response.interface').OutputContexts;
var QueryResult = require('../src/interfaces/dialog-flow-response.interface').QueryResult;

describe('@DialogFlowParams', function () {
    class TestWithIntentDecorator {
        @DialogFlowIntent('myIntent')
        public action(@DialogFlowParam('queryResult.outputContexts') outputContexts: OutputContexts) {
            return outputContexts;
        }

        @DialogFlowIntent('myIntent2')
        public action2(@DialogFlowParam('queryResult') queryResult: QueryResult) {
            return queryResult;
        }

        @DialogFlowIntent('myIntent2')
        public action3(@DialogFlowParam() dialogFlowResponse: DialogFlowResponse) {
            return dialogFlowResponse;
        }

        @DialogFlowIntent('myIntent2')
        public action4(dialogFlowResponse: DialogFlowResponse) {
            return dialogFlowResponse;
        }
    }

    class TestWithActionDecorator {
        @DialogFlowAction('myIntent')
        public action(@DialogFlowParam('queryResult.outputContexts') outputContexts: OutputContexts) {
            return outputContexts;
        }

        @DialogFlowAction('myIntent2')
        public action2(@DialogFlowParam('queryResult') queryResult: QueryResult) {
            return queryResult;
        }

        @DialogFlowAction('myIntent2')
        public action3(@DialogFlowParam() dialogFlowResponse: DialogFlowResponse) {
            return dialogFlowResponse;
        }

        @DialogFlowAction('myIntent2')
        public action4(dialogFlowResponse: DialogFlowResponse) {
            return dialogFlowResponse;
        }
    }

    it('should override method parameter with the property set through the intent decorator', () => {
        const instance = new TestWithIntentDecorator();
        expect(instance.action(dialogFlowResponseData as any)).toBe(dialogFlowResponseData.queryResult.outputContexts);
        expect(instance.action2(dialogFlowResponseData as any)).toBe(dialogFlowResponseData.queryResult);
        expect(instance.action3(dialogFlowResponseData as any)).toBe(dialogFlowResponseData);
        expect(instance.action4(dialogFlowResponseData as any)).toBe(dialogFlowResponseData);
    });

    it('should override method parameter with the property set through the action decorator', () => {
        const instance = new TestWithActionDecorator();
        expect(instance.action(dialogFlowResponseData as any)).toBe(dialogFlowResponseData.queryResult.outputContexts);
        expect(instance.action2(dialogFlowResponseData as any)).toBe(dialogFlowResponseData.queryResult);
        expect(instance.action3(dialogFlowResponseData as any)).toBe(dialogFlowResponseData);
        expect(instance.action4(dialogFlowResponseData as any)).toBe(dialogFlowResponseData);
    });
});