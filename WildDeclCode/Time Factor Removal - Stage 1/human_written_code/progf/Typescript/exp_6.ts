require('reflect-metadata');
var DIALOG_FLOW_ACTION = require('../src/constant').DIALOG_FLOW_ACTION;
var DialogFlowAction = require('../src/decorators/dialog-flow-action.decorator').DialogFlowAction;
var expect = require('chai').expect;

describe('@DialogFlowAction', function () {
    class TestWithMethod {
        @DialogFlowAction('myAction')
        public action() {}
    }

    it('should enhance method add action string into method metadata', () => {
        const metadata = Reflect.getMetadata(DIALOG_FLOW_ACTION, Reflect.getOwnPropertyDescriptor(TestWithMethod.prototype, 'action').value);
        expect(metadata).to.be.deep.equal('myAction');
    });
});
