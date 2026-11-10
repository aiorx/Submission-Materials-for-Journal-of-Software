var React = require('react');
var ReactDOM = require('react-dom');

var useAsyncRun = require('react-hooks-async').useAsyncRun;
var useAsyncTaskTimeout = require('react-hooks-async').useAsyncTaskTimeout;

const Err = function ({ error }) { return (
  <div>Error: {error.message}</div>
); };

const Waiting = function ({ abort }) { return (
  <div>
    Waiting...
    <button type="button" onClick={abort}>Abort</button>
  </div>
); };

const renderHi = function () { return <h1>Hi</h1>; };

const DelayedMessage = function ({ delay }) {
  const asyncTask = useAsyncTaskTimeout(renderHi, delay);
  useAsyncRun(asyncTask);
  var pending = asyncTask.pending;
var error = asyncTask.error;
var result = asyncTask.result;
var abort = asyncTask.abort;
  if (error) return <Err error={error} />;
  if (pending) return <Waiting abort={abort} />;
  return <div>Result: {result}</div>;
};

const App = function () { return (
  <div>
    <DelayedMessage delay={3000} />
    <DelayedMessage delay={1000} />
  </div>
); };

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
