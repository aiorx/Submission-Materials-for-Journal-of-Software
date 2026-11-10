var _import = require('react');
var render = require('@testing-library/react').render;
var cleanup = require('@testing-library/react').cleanup;

var useAsyncTask = require('../src/index').useAsyncTask;
var useAsyncRun = require('../src/index').useAsyncRun;
var useAsyncTaskTimeout = require('../src/index').useAsyncTaskTimeout;

// FIXME we should fake timers
// jest.useFakeTimers();
const sleep = function (ms) { return new Promise((resolve) => setTimeout(resolve, ms)); };

describe('basic spec', function () {
  afterEach(cleanup);

  it('should have a function', () => {
    expect(useAsyncTask).toBeDefined();
  });

  it('should create a component with timeout', async () => {
    const Waiting = ({ abort }) => (
      <div>
        Waiting...
        <button type="button" onClick={abort}>Abort</button>
      </div>
    );
    const renderHi = () => <h1>Hi</h1>;
    const DelayedMessage = ({ delay }) => {
      const asyncTask = useAsyncTaskTimeout(renderHi, delay, [renderHi, delay]);
      useAsyncRun(asyncTask);
      var pending = asyncTask.pending;
var error = asyncTask.error;
var result = asyncTask.result;
var abort = asyncTask.abort;
      if (error) return <div>Error: {error.message}</div>;
      if (pending) return <Waiting abort={abort} />;
      return <div>Result: {result}</div>;
    };
    const App = () => (
      <StrictMode>
        <div>
          <DelayedMessage delay={300} />
          <DelayedMessage delay={100} />
        </div>
      </StrictMode>
    );
    var container = render.container;(<App />);
    expect(container).toMatchSnapshot();
    // jest.advanceTimersByTime(100);
    await sleep(100);
    expect(container).toMatchSnapshot();
    // jest.advanceTimersByTime(200);
    await sleep(200);
    expect(container).toMatchSnapshot();
  });
});
