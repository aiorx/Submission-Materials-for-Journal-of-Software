var React = require('react');
var ApolloProvider = require('react-apollo').ApolloProvider;
var ThemeProvider = require('styled-components').ThemeProvider;
var SafeAreaView = require('react-native').SafeAreaView;
var Platform = require('react-native').Platform;
var StatusBar = require('react-native').StatusBar;
var StyleSheet = require('react-native').StyleSheet;
var AppLoading = require('expo').AppLoading;
var Icon = require('@expo/vector-icons');
var Font = require('expo-font');
var Asset = require('expo-asset').Asset;
var AppNavigator = require('./navigation/AppNavigator');
var setupApolloClient = require('./config/setup');
var Colors = require('./constants/Colors');
var Bg = require('./components/styled').Bg;
var _import = require('./config/theme');

const _makeTheme = function (type = 'light') { return ({
  color: Colors,
  ...theme(type)
}); };
const dark = _makeTheme('dark');
const light = _makeTheme('light');

module.exports = class App extends React.PureComponent {;
  apolloClient = null;
  state = {
    isLoadingComplete: false,
    hasHydrated: false,
    theme: 'light'
  };

  toggleTheme = function () {
    this.setState(
      ({ theme }) => ({
        theme: theme === 'light' ? 'dark' : 'light'
      }),
      this._changeStatusBarStyle
    );
  };

  _changeStatusBarStyle = function () {
    StatusBar.setBarStyle(
      this.state.theme === 'light' ? 'default' : 'light-content'
    );
  };

  componentDidMount() {
    return Platform.OS === 'ios' && this._changeStatusBarStyle();
  }

  render() {
    var isLoadingComplete = this.state.isLoadingComplete;
var hasHydrated = this.state.hasHydrated;

    if (!isLoadingComplete && !hasHydrated) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <ApolloProvider client={this.apolloClient}>
          <ThemeContext.Provider
            value={{ theme: this.state.theme, toggleTheme: this.toggleTheme }}
          >
            <ThemeProvider theme={this.state.theme === 'light' ? light : dark}>
              <Bg forceInset={{ bottom: 'never', top: 'always' }}>
                <AppNavigator />
              </Bg>
            </ThemeProvider>
          </ThemeContext.Provider>
        </ApolloProvider>
      );
    }
  }

  _loadResourcesAsync = async function () {
    this.apolloClient = await setupApolloClient();

    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/buymeacoffee-logo.png'),
        require('./assets/images/youtube-logo.png'),
        require('./assets/images/brain.png')
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        Menlo: require('./assets/fonts/Menlo-Regular.ttf')
      })
    ]);
  };

  _handleLoadingError = function error {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = function () {
    this.setState({ isLoadingComplete: true, hasHydrated: true });
  };
}
