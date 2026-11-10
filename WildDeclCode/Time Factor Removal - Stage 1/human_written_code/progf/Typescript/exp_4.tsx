var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App');
var ReusableProvider = require('reusable').ReusableProvider;

it("renders without crashing", function () {
  const div = document.createElement("div");
  ReactDOM.render(<ReusableProvider><App /></ReusableProvider>, div);
});
