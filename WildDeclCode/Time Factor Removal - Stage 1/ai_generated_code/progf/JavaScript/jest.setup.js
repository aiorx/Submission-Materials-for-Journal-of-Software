// Aided with basic GitHub coding tools
require('@testing-library/jest-dom');
var enableFetchMocks = require('jest-fetch-mock').enableFetchMocks;

// Enable fetch mocks for API testing
enableFetchMocks();

// Mock Next.js router
jest.mock('next/router', function () { return ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}); });

// Mock next/image
jest.mock('next/image', function () { return ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}); });

// Mock WebGPU APIs that might not be available in test environment
global.GPU = class {
  requestAdapter() {
    return Promise.resolve(null);
  }
};

// Suppress console errors during tests
var originalConsoleError = console.error;
console.error = function (...args) {
  if (
    args[0]?(.includes == null ? undefined : .includes('Warning: ReactDOM.render is no longer supported')) ||
    args[0]?(.includes == null ? undefined : .includes('Error: Uncaught [Error'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
