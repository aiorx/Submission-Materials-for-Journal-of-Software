var React = require('react');
var Provider = require('react-redux').Provider;
var store = require('./src/state/store').store;
var NavigationContainer = require('@react-navigation/native').NavigationContainer;
var useCachedResources = require('./src/hooks/useCachedResources');
var MainStackNavigator = require('./src/navigation/MainStackNavigator');


module.exports = function App() {;
  // Load cached resources before the app starts.
  const isLoadingComplete = useCachedResources();

  // Show nothing ( but the splashscreen ) till cached resources load.
  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </Provider>
  );
}
