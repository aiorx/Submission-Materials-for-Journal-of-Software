var StatusBar = require('expo-status-bar').StatusBar;
var useColorScheme = require('react-native').useColorScheme;
var SafeAreaProvider = require('react-native-safe-area-context').SafeAreaProvider;
var useCachedResources = require('./hooks/useCachedResources');
var Navigation = require('./navigation');

module.exports = function App() {;
  const isLoaded = useCachedResources();
  const colorScheme = useColorScheme();

  if (isLoaded) {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  } else {
    return null;
  }
}


// EAS Build - is a hosted service for building app binaries

// IOS Deployment
// https://medium.com/nerd-for-tech/your-guide-to-testing-your-expo-react-native-application-on-ios-abbde4086d08
// https://docs.expo.dev/classic/building-standalone-apps/?redirected
