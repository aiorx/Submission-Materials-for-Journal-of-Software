var React = require('react');

var NavigationContainer = require('@react-navigation/native').NavigationContainer;
var createStackNavigator = require('@react-navigation/stack').createStackNavigator;

var _import = require('styled-components');
var Provider = require('react-redux').Provider;
var View = require('react-native').View;
var LogBox = require('react-native').LogBox;
LogBox.ignoreLogs(["Require cycle"]);
var PersistGate = require('redux-persist/integration/react').PersistGate;

var getStore = require('./data/store').getStore;
var spaceBadger = require('./themes/spaceBadger').spaceBadger;
var MainAppStack = require('./navigation/MainTabNavigator');
var AuthLoadingScreen = require('./navigation/AuthLoadingScreen');
// Auth Screens
var WelcomeScreen = require('./screens/WelcomeScreen');
var TermsOfUseScreen = require('./screens/TermsOfUseScreen');
var PrivacyNoticeScreen = require('./screens/PrivacyNoticeScreen');
var CreateWalletScreen = require('./screens/CreateWalletScreen');

var RestoreWalletScreen = require('./screens/RestoreWalletScreen');

var store = getStore.store;
var persistor = getStore.persistor;();
const Stack = createStackNavigator();

const AuthStack = function () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AcceptTermsOfUse" component={TermsOfUseScreen} />
      <Stack.Screen name="PrivacyNotice" component={PrivacyNoticeScreen} />
      <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
      <Stack.Screen name="RestoreFromBackup" component={RestoreWalletScreen} />
    </Stack.Navigator>
  );
};

const AppWrapper = styled(View)"
  flex: 1;
";

const bchPrefix = "bitcoincash";
const slpPrefix = "simpleledger";

const App = function () {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={spaceBadger}>
            <AppWrapper>
              {/* <AppNavigator /> */}
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="AuthLoadingCheck"
                  component={AuthLoadingScreen}
                />
                <Stack.Screen name="AuthStack" component={AuthStack} />
                <Stack.Screen name="Main" component={MainAppStack} />
              </Stack.Navigator>
            </AppWrapper>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
};

module.exports = App;
