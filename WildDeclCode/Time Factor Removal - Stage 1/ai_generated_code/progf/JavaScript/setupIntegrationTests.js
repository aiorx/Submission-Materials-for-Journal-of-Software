// Aided with basic GitHub coding tools
var testDb = require('./testDbConfig');
var emailServiceMock = require('../mocks/emailServiceMock');
var paymentServiceMock = require('../mocks/paymentServiceMock');
var pdfServiceMock = require('../mocks/pdfServiceMock');

// Mock all external services
jest.mock('../../services/emailService', function () { return require('../mocks/emailServiceMock'); });
jest.mock('../../services/paymentService', function () { return require('../mocks/paymentServiceMock'); });
jest.mock('../../services/pdfService', function () { return require('../mocks/pdfServiceMock'); });

beforeAll(async function () {
    process.env.NODE_ENV = 'test';
    await testDb.connect();
});

afterAll(async function () {
    await testDb.disconnect();
    await pdfServiceMock.cleanupTestFiles();
});

beforeEach(async function () {
    await testDb.clearCollections();
    emailServiceMock.reset();
    paymentServiceMock.reset();
    pdfServiceMock.reset();
});

// Make test utilities available globally
global.testUtils = {
    testDb,
    emailServiceMock,
    paymentServiceMock,
    pdfServiceMock
};