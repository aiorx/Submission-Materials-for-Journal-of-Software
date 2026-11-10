var React = require('react');
var ReactDOM = require('react-dom');
var App = require('.');

it('renders without crashing', function () {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
