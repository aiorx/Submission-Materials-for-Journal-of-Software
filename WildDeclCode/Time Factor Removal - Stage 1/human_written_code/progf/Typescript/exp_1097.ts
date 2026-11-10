/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

var Sentry = require('@sentry/node');
var Callback = require('aws-lambda').Callback;
var Context = require('aws-lambda').Context;
var Handler = require('aws-lambda').Handler;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var proxyquire = require('proxyquire');
var _import = require('sinon');
var match = require('sinon').match;
var sinonChai = require('sinon-chai');

var WithSentryOptions = require('.').WithSentryOptions;

var expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sinonChai);

console.log = function () {}; // mute console output for simpler test logs
console.error = function () {};
console.warn = function () {};
console.info = function () {};
console.debug = function () {};

var sandbox = sinon.createSandbox();

var mockScope = {
  clear: sandbox.spy(function () {}),
  setLevel: sandbox.spy(function (level: Sentry.Severity) {}),
  setExtras: sandbox.spy(function (extras: { [key: string]: any }) {}),
  setUser: sandbox.spy(function (user: Sentry.User | null) {}),
  setTag: sandbox.spy(function (key: string, value: string) {}),
  setTags: sandbox.spy(function (tags: { [key: string]: string }) {}),
};

/** Mock implementation of Sentry */
var mockSentry: typeof Sentry = {
  init: sandbox.stub(),
  addBreadcrumb: sandbox.stub(),
  captureMessage: sandbox.spy(function (message: string, level?: Sentry.Severity | undefined) { return ""; }),
  captureException: sandbox.spy(function (exception: any) { return ""; }),
  configureScope: sandbox.spy(function (fn: (scope: Sentry.Scope) => void) {
    fn(mockScope as any as Sentry.Scope);
  }Sentry.Scope);
  }),
  withScope: sandbox.spy(function (fn: (scope: Sentry.Scope) => void) {
    fn(mockScope as any as Sentry.Scope);
  }Sentry.Scope);
  }),
  getCurrentHub: sandbox.spy(function () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      getClient: () => ({ flush: () => Promise.resolve() }),
    } as any;
  }),
  flush: sandbox.spy(function () { return Promise.resolve(true); }),
  close: sandbox.spy(function () { return Promise.resolve(true); }),
} as any;

// Initialize withSentry using the mocked Sentry implementation
var withSentry = proxyquire("./index", {
  "@sentry/node": mockSentry,
});

describe("withSentry", function () {
  var mockEvent = {
    foo: "bar",
  };

  var mockContext: Context = {
    getRemainingTimeInMillis: () => 6 * 1000,
    memoryLimitInMB: "1024",
    functionName: "test-function",
    functionVersion: "123",
    callbackWaitsForEmptyEventLoop: false,
    invokedFunctionArn: "arn:aws:lambda:us-east-1:123456789012:function:helloWord:DEV",
    awsRequestId: "6bc28136-xmpl-4365-b021-0ce6b2e64ab0",
    logGroupName: "loggroup",
    logStreamName: "logstream",

    done: () => {
      throw new Error("deprecated");
    },
    fail: () => {
      throw new Error("deprecated");
    },
    succeed: () => {
      throw new Error("deprecated");
    },
  };

  beforeEach(() => {
    process.env.LAMBDA_TASK_ROOT = "/tmp/test";
    process.env.AWS_REGION = "us-east-1";
    process.env.AWS_LAMBDA_FUNCTION_NAME = "Test-Lambda-Function";
    process.env.AWS_LAMBDA_FUNCTION_VERSION = "1";
    process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE = "256";
    process.env.AWS_LAMBDA_LOG_GROUP_NAME = "/aws/lambda/1beb394c-81dc-41b0-9a4d-c701639ee033";
    process.env.AWS_LAMBDA_LOG_STREAM_NAME = "2019/02/17/[8]eb7252959b2e409ba25ad93737979e14";
  });

  afterEach(() => {
    sandbox.resetHistory();
  });

  // ------------------------------------------------------------------------

  describe("Sentry DSN not set", () => {
    before(() => {
      delete process.env.SENTRY_DSN;
      process.env.SENTRY_FILTER_LOCAL = "false";
    });

    after(() => {
      delete process.env.SENTRY_DSN;
      delete process.env.SENTRY_FILTER_LOCAL;
    });

    describe("Callbacks", () => {
      it("should invoke callback with result", (done) => {
        /** Lambda function handler */
        var handler = withSentry((event: any, context: any, callback: Callback<any>) => {
          callback(null, {
            message: "Go Serverless! Your function executed successfully!",
            event,
          });
        });

        handler(mockEvent, mockContext, (err: Error, result: any) => {
          expect(mockSentry.init).to.not.be.called;
          expect(mockSentry.captureException).to.not.be.called;
          expect(err).to.be.null;
          expect(result).to.have.property("message").that.is.a("string");
          done();
        });
      });

      it("should invoke callback with error", (done) => {
        /** Lambda function handler */
        var handler = withSentry((event: any, context: any, callback: Callback<any>) => {
          callback(new Error("Test Error"));
        });

        handler(mockEvent, mockContext, (err: Error, result: any) => {
          expect(mockSentry.init).to.not.be.called;
          expect(mockSentry.captureException).to.not.be.called;
          expect(err).to.be.an("error").with.property("message", "Test Error");
          done();
        });
      });
    });

    describe("Async/Await (Promises)", () => {
      it("should return fulfilled Promise", () => {
        /** Lambda function handler */
        var handler = withSentry((event: any, context: any) => {
          return Promise.resolve({
            message: "Go Serverless! Your function executed successfully!",
            event,
          });
        });
        return expect(handler(mockEvent, mockContext, sinon.stub())).to.eventually.be.fulfilled.then((result) => {
          expect(mockSentry.init).to.not.be.called;
          expect(mockSentry.captureException).to.not.be.called;
          expect(result).to.have.property("message").that.is.a("string");
        });
      });

      it("should return rejected Promise", () => {
        /** Lambda function handler */
        var handler = withSentry((event: any, context: any) => {
          return Promise.reject(new Error("Test Error"));
        });
        return expect(handler(mockEvent, mockContext, sinon.stub()))
          .to.eventually.be.rejectedWith("Test Error")
          .then(() => {
            expect(mockSentry.init).to.not.be.called;
            expect(mockSentry.captureException).to.not.be.called;
          });
      });
    });
  });

  // ------------------------------------------------------------------------

  describe("Sentry DSN set", () => {
    before(() => {
      process.env.SENTRY_DSN = "https://sentry.example.com";
      process.env.SENTRY_FILTER_LOCAL = "false";
    });

    after(() => {
      delete process.env.SENTRY_DSN;
      delete process.env.SENTRY_FILTER_LOCAL;
    });

    describe("Callbacks", () => {
      it("should invoke callback with result", (done) => {
        /** Lambda function handler */
        var handler = withSentry((event: any, context: any, callback: Callback<any>) => {
          callback(null, {
            message: "Go Serverless! Your function executed successfully!",
            event,
          });
        });

        handler(mockEvent, mockContext, (err: Error, result: any) => {
          expect(mockSentry.init).to.be.calledOnce;
          expect(mockSentry.captureException).to.not.be.called;
          expect(err).to.be.null;
          expect(result).to.have.property("message").that.is.a("string");
          done();
        });
      });

      it("should invoke callback with error", (done) => {
        /** Lambda function handler */
        var handler = withSentry((event: any, context: any, callback: Callback<any>) => {
          callback(new Error("Test Error"));
        });

        handler(mockEvent, mockContext, (err: Error, result: any) => {
          expect(mockSentry.init).to.be.calledOnce;
          expect(mockSentry.captureException).to.be.calledOnce;
          expect(err).to.be.an("error").with.property("message", "Test Error");
          done();
        });
      });
    });

    describe("Async/Await (Promises)", () => {
      it("should return fulfilled Promise", () => {
        /** Lambda function handler */
        var handler = withSentry((event: any, context: any) => {
          return Promise.resolve({
            message: "Go Serverless! Your function executed successfully!",
            event,
          });
        });
        return expect(handler(mockEvent, mockContext, sinon.stub())).to.eventually.be.fulfilled.then((result) => {
          expect(mockSentry.init).to.be.calledOnce;
          expect(mockSentry.captureException).to.not.be.called;
          expect(result).to.have.property("message").that.is.a("string");
        });
      });

      it("should return rejected Promise", () => {
        /** Lambda function handler */
        var handler = withSentry((event: any, context: any) => {
          return Promise.reject(new Error("Test Error"));
        });
        return expect(handler(mockEvent, mockContext, sinon.stub()))
          .to.eventually.be.rejectedWith("Test Error")
          .then(() => {
            expect(mockSentry.init).to.be.calledOnce;
            expect(mockSentry.captureException).to.be.calledOnce;
          });
      });
    });
  });

  // ------------------------------------------------------------------------

  describe("Custom Sentry Instance", () => {
    describe("Callbacks", () => {
      it("should invoke callback with result", (done) => {
        /** Lambda function handler */
        var handler = withSentry(mockSentry, (event: any, context: any, callback: Callback<any>) => {
          callback(null, {
            message: "Go Serverless! Your function executed successfully!",
            event,
          });
        });

        handler(mockEvent, mockContext, (err: Error, result: any) => {
          expect(mockSentry.init).to.not.be.called;
          expect(mockSentry.captureException).to.not.be.called;
          expect(err).to.be.null;
          expect(result).to.have.property("message").that.is.a("string");
          done();
        });
      });

      it("should invoke callback with error", (done) => {
        /** Lambda function handler */
        var handler = withSentry(mockSentry, (event: any, context: any, callback: Callback<any>) => {
          callback(new Error("Test Error"));
        });

        handler(mockEvent, mockContext, (err: Error, result: any) => {
          expect(mockSentry.init).to.not.be.called;
          expect(mockSentry.captureException).to.be.calledOnce;
          expect(err).to.be.an("error").with.property("message", "Test Error");
          done();
        });
      });
    });

    describe("Async/Await (Promises)", () => {
      it("should return fulfilled Promise", () => {
        /** Lambda function handler */
        var handler = withSentry(mockSentry, (event: any, context: any) => {
          return Promise.resolve({
            message: "Go Serverless! Your function executed successfully!",
            event,
          });
        });
        return expect(handler(mockEvent, mockContext, sinon.stub())).to.eventually.be.fulfilled.then((result) => {
          expect(mockSentry.init).to.not.be.called;
          expect(mockSentry.captureException).to.not.be.called;
          expect(result).to.have.property("message").that.is.a("string");
        });
      });

      it("should return rejected Promise", () => {
        /** Lambda function handler */
        var handler = withSentry(mockSentry, (event: any, context: any) => {
          return Promise.reject(new Error("Test Error"));
        });
        return expect(handler(mockEvent, mockContext, sinon.stub()))
          .to.eventually.be.rejectedWith("Test Error")
          .then(() => {
            expect(mockSentry.init).to.not.be.called;
            expect(mockSentry.captureException).to.be.calledOnce;
          });
      });
    });
  });

  // ------------------------------------------------------------------------

  describe("Custom Settings", () => {
    var options: WithSentryOptions = {
      sentryOptions: {
        dsn: "https://sentry.example.com",
      },
      filterLocal: false,
      sourceMaps: true,
      autoBreadcrumbs: true,
      captureErrors: true,
      captureUnhandledRejections: true,
      captureUncaughtException: true,
      captureMemory: true,
      captureTimeouts: true,
    };

    describe("autoBreadcrumbs", () => {
      it("enabled - should trace Lambda function as breadcrumb", async () => {
        /** Lambda function handler */
        var handler = async (event: any, context: any) => {
          return "Go Serverless! Your function executed successfully!";
        };

        var wrappedHandler = withSentry({ ...options, autoBreadcrumbs: true }, handler);

        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockSentry.init).to.be.calledOnce;
          expect(mockSentry.addBreadcrumb).to.be.calledOnce;
          expect(mockSentry.addBreadcrumb).to.be.calledWith({
            category: "lambda",
            message: "Test-Lambda-Function",
            data: {},
            level: "info",
          });
        });
      });

      it("disabled - should not trace Lambda function as breadcrumb", async () => {
        /** Lambda function handler */
        var handler = async (event: any, context: any) => {
          return "Go Serverless! Your function executed successfully!";
        };

        var wrappedHandler = withSentry({ ...options, autoBreadcrumbs: false }, handler);

        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockSentry.init).to.be.calledOnce;
          expect(mockSentry.addBreadcrumb).to.not.be.called;
        });
      });
    });

    describe("filterLocal", () => {
      afterEach(() => {
        delete process.env.IS_OFFLINE;
      });

      /** Lambda function handler */
      var handler = async (event: any, context: any) => {
        return "Go Serverless! Your function executed successfully!";
      };

      it("enabled - should not initialize Sentry when running locally", async () => {
        process.env.IS_OFFLINE = "true";
        var wrappedHandler = withSentry({ ...options, filterLocal: true }, handler);

        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockSentry.init).to.not.be.called;
        });
      });

      it("enabled - should initialize Sentry when not running locally", async () => {
        process.env.IS_OFFLINE = "false";
        var wrappedHandler = withSentry({ ...options, filterLocal: true }, handler);

        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockSentry.init).to.be.calledOnce;
        });
      });

      it("disabled - should initialize Sentry when running locally", async () => {
        process.env.IS_OFFLINE = "true";
        var wrappedHandler = withSentry({ ...options, filterLocal: false }, handler);

        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockSentry.init).to.be.calledOnce;
        });
      });

      it("disabled - should initialize Sentry when not running locally", async () => {
        process.env.IS_OFFLINE = "false";
        var wrappedHandler = withSentry({ ...options, filterLocal: false }, handler);

        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockSentry.init).to.be.calledOnce;
        });
      });
    });

    describe("scope", () => {
      /** Lambda function handler */
      var handler = async (event: any, context: any) => {
        return "Go Serverless! Your function executed successfully!";
      };

      it("should set user scope", async () => {
        var wrappedHandler = withSentry({ ...options }, handler);
        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockScope.setUser).to.be.calledWith({});
        });
      });

      it("should set custom user scope via options", async () => {
        var wrappedHandler = withSentry({ ...options, scope: { user: { myUserTrait: "foobar" } } }, handler);
        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockScope.setUser).to.be.calledWith({ myUserTrait: "foobar" });
        });
      });

      it("should set extras", async () => {
        var wrappedHandler = withSentry({ ...options }, handler);
        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockScope.setExtras).to.be.calledWith({
            Context: sinon.match.object,
            Event: mockEvent,
          });
        });
      });

      it("should set custom extras via options", async () => {
        var wrappedHandler = withSentry({ ...options, scope: { extras: { myExtra: "foobar" } } }, handler);
        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          (mockSentry.configureScope as sinon.SinonSpy).callArgWith(0, mockScope); // invoke the scope configuration
          expect(mockScope.setExtras).to.be.calledWith({
            Context: sinon.match.object,
            Event: mockEvent,
            myExtra: "foobar",
          });
        });
      });

      it("should set tags", async () => {
        var wrappedHandler = withSentry({ ...options }, handler);
        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          (mockSentry.configureScope as sinon.SinonSpy).callArgWith(0, mockScope); // invoke the scope configuration
          expect(mockScope.setTags).to.be.calledWith({
            lambda: String(process.env.AWS_LAMBDA_FUNCTION_NAME),
            version: String(process.env.AWS_LAMBDA_FUNCTION_VERSION),
            memory_size: String(process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE),
            log_group: String(process.env.AWS_LAMBDA_LOG_GROUP_NAME),
            log_stream: String(process.env.AWS_LAMBDA_LOG_STREAM_NAME),
            region: String(process.env.AWS_REGION),
          });
        });
      });

      it("should set custom tags via options", async () => {
        var wrappedHandler = withSentry({ ...options, scope: { tags: { myTag: "foobar" } } }, handler);
        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          (mockSentry.configureScope as sinon.SinonSpy).callArgWith(0, mockScope); // invoke the scope configuration
          expect(mockScope.setTags).to.be.calledWith({
            lambda: String(process.env.AWS_LAMBDA_FUNCTION_NAME),
            version: String(process.env.AWS_LAMBDA_FUNCTION_VERSION),
            memory_size: String(process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE),
            log_group: String(process.env.AWS_LAMBDA_LOG_GROUP_NAME),
            log_stream: String(process.env.AWS_LAMBDA_LOG_STREAM_NAME),
            region: String(process.env.AWS_REGION),
            myTag: "foobar",
          });
        });
      });
    });

    describe("captureErrors", () => {
      /** Lambda function handler */
      var handler = async (event: any, context: any) => {
        throw new Error("Test Error");
      };

      it("enabled - should capture errors returned by the Lambda", async () => {
        var wrappedHandler = withSentry({ ...options, captureErrors: true }, handler);

        return expect(wrappedHandler(mockEvent, mockContext))
          .to.eventually.be.rejectedWith("Test Error")
          .then(() => {
            expect(mockSentry.init).to.be.calledOnce;
            expect(mockSentry.captureException).to.be.calledOnce;
          });
      });

      it("disabled - should not capture errors returned by the Lambda", async () => {
        var wrappedHandler = withSentry({ ...options, captureErrors: false }, handler);

        return expect(wrappedHandler(mockEvent, mockContext))
          .to.eventually.be.rejectedWith("Test Error")
          .then(() => {
            expect(mockSentry.init).to.be.calledOnce;
            expect(mockSentry.captureException).to.not.be.called;
          });
      });
    });

    describe("captureUnhandledRejections", () => {
      /** Lambda function handler */
      var handler = async (event: any, context: any) => {
        // new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     // Cause an unhandled exception
        //     reject(new Error("Test"));
        //   }, 100);
        // }); // we don't handle this promise, we don't return it

        return "Go Serverless! Your function executed successfully!";
      };

      it("enabled - should capture unhandled promise rejections", async () => {
        var wrappedHandler = withSentry({ ...options, captureUnhandledRejections: true }, handler);
        var spyProcessListener = sandbox.spy(process, "on");

        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockSentry.init).to.be.calledOnce;
          expect(spyProcessListener).to.be.calledWith("unhandledRejection", sinon.match.func);
          spyProcessListener.restore();
        });
      });

      it("disabled - should not capture unhandled promise rejections", async () => {
        var wrappedHandler = withSentry({ ...options, captureUnhandledRejections: false }, handler);
        var spyProcessListener = sandbox.spy(process, "on");

        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockSentry.init).to.be.calledOnce;
          expect(spyProcessListener).to.not.be.calledWith("unhandledRejection", sinon.match.func);
          spyProcessListener.restore();
        });
      });
    });

    describe("captureUncaughtException", () => {
      /** Lambda function handler */
      var handler = async (event: any, context: any) => {
        return "Go Serverless! Your function executed successfully!";
      };

      it("enabled - should capture uncaught exceptions", async () => {
        var wrappedHandler = withSentry({ ...options, captureUncaughtException: true }, handler);
        var spyProcessListener = sandbox.spy(process, "on");

        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockSentry.init).to.be.calledOnce;
          expect(spyProcessListener).to.be.calledWith("uncaughtException", sinon.match.func);
          spyProcessListener.restore();
        });
      });

      it("disabled - should not capture uncaught exceptions", async () => {
        var wrappedHandler = withSentry({ ...options, captureUncaughtException: false }, handler);
        var spyProcessListener = sandbox.spy(process, "on");

        return expect(wrappedHandler(mockEvent, mockContext)).to.eventually.be.fulfilled.then(() => {
          expect(mockSentry.init).to.be.calledOnce;
          expect(spyProcessListener).to.not.be.calledWith("uncaughtException", sinon.match.func);
          spyProcessListener.restore();
        });
      });
    });

    describe("captureMemory", () => {
      xit("should warn if Lambda function is close to running out of memory", (done) => {
        // TODO
        done();
      });
    });

    describe("captureTimeouts", function () {
      var flushTimeout = 500;
      var remainingTime = 2000;
      this.timeout(remainingTime * 2);

      /** Lambda function handler */
      var handler = (event: any, context: any) => {
        // Block Lambda for the duration of the timeout...
        return new Promise((resolve) => setTimeout(resolve, remainingTime + 100));
      };

      beforeEach(() => {
        var start = Date.now();
        var stubRemainingTime = sandbox
          .stub(mockContext, "getRemainingTimeInMillis")
          .callsFake(() => start + remainingTime - Date.now());
      });

      afterEach(() => {
        (mockContext.getRemainingTimeInMillis as Sinon.SinonStub<any>).restore();
      });

      it("should warn if more than half of the originally available time has passed", () => {
        var wrappedHandler = withSentry({ ...options, flushTimeout }, handler);
        return expect(wrappedHandler(mockEvent, mockContext, sinon.stub())).to.eventually.be.fulfilled.then(
          (result) => {
            expect(mockSentry.captureMessage).to.be.calledWith("Function Execution Time Warning");
            expect(mockScope.setLevel).to.be.calledWith("warning");
            expect(mockScope.setExtras).to.be.calledWith({
              TimeRemainingInMsec: sinon.match.number,
            });
            // The callback happens exactly when half the remaining time has passed
            expect(mockScope.setExtras.secondCall.args[0].TimeRemainingInMsec)
              .to.be.lessThan(remainingTime / 2 + 1)
              .and.above(remainingTime / 2 - 100);
          },
        );
      });

      it("should error if Lambda timeout is hit", () => {
        var wrappedHandler = withSentry({ ...options, flushTimeout }, handler);
        return expect(wrappedHandler(mockEvent, mockContext, sinon.stub())).to.eventually.be.fulfilled.then(
          (result) => {
            expect(mockSentry.captureMessage).to.be.calledWith("Function Timed Out");
            expect(mockScope.setLevel).to.be.calledWith("error");
            expect(mockScope.setExtras).to.be.calledWith({
              TimeRemainingInMsec: sinon.match.number,
            });
            // The callback happens 500 msecs (or whatever `flushTimeout` is set to) before Lambda would time out
            expect(mockScope.setExtras.thirdCall.args[0].TimeRemainingInMsec)
              .to.be.lessThan(flushTimeout + 1)
              .and.above(flushTimeout - 100);
          },
        );
      });
    });
  });
});
