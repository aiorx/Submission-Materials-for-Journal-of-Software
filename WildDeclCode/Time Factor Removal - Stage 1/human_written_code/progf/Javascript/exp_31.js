require('react-native');
var React = require('react');
var App = require('../App');
var renderer = require('react-test-renderer');
var NavigationTestUtils = require('react-navigation/NavigationTestUtils');

describe('App snapshot', function () {
  jest.useFakeTimers();
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it('renders the loading screen', async () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the root without loading screen', async () => {
    const tree = renderer.create(<App skipLoadingScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
