var NavigationContainer = require('@react-navigation/native').NavigationContainer;
var NavigationProp = require('@react-navigation/native').NavigationProp;
var createStackNavigator = require('@react-navigation/stack').createStackNavigator;
var _import = require('react');
var SecureStore = require('expo-secure-store');
var ActivityIndicator = require('react-native').ActivityIndicator;
var View = require('react-native').View;
var WelcomeScreen = require('./src/screens/welcome.screen').WelcomeScreen;
var CreatorCoinHODLer = require('./src/types').CreatorCoinHODLer;
var EventType = require('./src/types').EventType;
var ToggleProfileManagerEvent = require('./src/types').ToggleProfileManagerEvent;
var User = require('./src/types').User;
var settingsGlobals = require('./src/globals/settingsGlobals').settingsGlobals;
var themeStyles = require('./styles/globalColors').themeStyles;
var updateThemeStyles = require('./styles/globalColors').updateThemeStyles;
var globals = require('./src/globals/globals').globals;
var constants = require('./src/globals/constants').constants;
var AppNavigator = require('./src/navigation/appNavigator').AppNavigator;
var SnackbarComponent = require('./src/components/snackbarComponent').SnackbarComponent;
var cache = require('./src/services/dataCaching/cache').cache;
var initCache = require('./src/services/dataCaching/cache').initCache;
var notificationsService = require('./src/services/notificationsService').notificationsService;
var LoginNavigator = require('./src/navigation/loginNavigator').LoginNavigator;
var ActionSheet = require('./src/components/actionSheet.component').ActionSheet;
var DiamondAnimationComponent = require('@components/diamondAnimation.component').DiamondAnimationComponent;
var cloutFeedApi = require('@services/cloutfeedApi').cloutFeedApi;
var enableScreens = require('react-native-screens').enableScreens;
var signing = require('@services/authorization/signing').signing;
var authentication = require('@services/authorization/authentication').authentication;
var ProfileManagerComponent = require('@components/profileManager.component').ProfileManagerComponent;
var eventManager = require('@globals/injector').eventManager;
var StatusBar = require('expo-status-bar').StatusBar;

enableScreens();

const Stack = createStackNavigator();

module.exports = function App() {;
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [areTermsAccepted, setTermsAccepted] = useState(false);
  const [theme, setGlobalTheme] = useState('light');
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [navigation, setNavigation] = useState<NavigationProp<any>>();

  let mount = true;

  useEffect(
    function () {
      checkAuthenticatedUser();
      const unsubscribe = eventManager.addEventListener(
        EventType.ToggleProfileManager,
        (event: ToggleProfileManagerEvent) => {
          if (mount) {
            setShowProfileManager(event.visible);
            setNavigation(event.navigation);
          }
        }
      );

      return () => {
        unsubscribe();
      };
    },
    []
  );

  async function checkAuthenticatedUser() {
    SecureStore.getItemAsync(constants.localStorage_publicKey).then(
      async function p_publicKey {

        if (p_publicKey) {
          const cloutFeedIdentity = await SecureStore.getItemAsync(constants.localStorage_cloutFeedIdentity);

          if (cloutFeedIdentity) {
            globals.user.publicKey = p_publicKey;
            const readonlyValue = await SecureStore.getItemAsync(constants.localStorage_readonly);
            globals.readonly = readonlyValue !== 'false';
            globals.onLoginSuccess();
          } else {
            await SecureStore.deleteItemAsync(constants.localStorage_publicKey);
            await SecureStore.deleteItemAsync(constants.localStorage_readonly);

            if (mount) {
              setTermsAccepted(true);
              setLoading(false);
            }
          }
        } else {
          const termsAccepted = await SecureStore.getItemAsync(constants.localStorage_termsAccepted);

          if (mount) {
            setTermsAccepted(termsAccepted === 'true');
            setLoading(false);
          }
        }
      }
    ).catch(function () { });
  }

  globals.acceptTermsAndConditions = function () {
    if (mount) {
      setTermsAccepted(true);
    }
  };

  globals.setGlobalTheme = function (p_theme: string) {
    setGlobalTheme(p_theme);
  }

  globals.onLoginSuccess = async function () {
    cache.user.reset();
    if (mount) {
      setLoading(true);
    }

    Promise.all(
      [
        cache.user.getData()
      ]
    ).then(
      async p_responses => {
        setInvestorFeatures(p_responses[0]);
        setFollowerFeatures(p_responses[0]);

        globals.user.username = p_responses[0].ProfileEntryResponse?.Username;

        if (globals.readonly === false) {
          notificationsService.registerPushToken().catch(() => { });
        }

        initCache();
        await setTheme();
      }
    ).catch(() => { })
      .finally(
        () => {
          if (mount) {
            setLoggedIn(true);
            setTermsAccepted(true);
            setLoading(false);
          }
        }
      );
  }

  globals.onLogout = async function () {
    setLoading(true);
    await SecureStore.deleteItemAsync(constants.localStorage_publicKey);
    await SecureStore.deleteItemAsync(constants.localStorage_readonly);

    if (globals.readonly === false) {
      const jwt = await signing.signJWT();
      cloutFeedApi.unregisterNotificationsPushToken(globals.user.publicKey, jwt).catch(() => { });
      await authentication.removeAuthenticatedUser(globals.user.publicKey);

      const loggedInPublicKeys = await authentication.getAuthenticatedUserPublicKeys();

      if (loggedInPublicKeys?.length > 0) {
        const publicKey = loggedInPublicKeys[0];
        await SecureStore.setItemAsync(constants.localStorage_publicKey, publicKey);
        await SecureStore.setItemAsync(constants.localStorage_readonly, 'false');
        globals.user = { publicKey, username: '' };
        globals.readonly = false;
        globals.onLoginSuccess();
        return;
      }
    }

    globals.user.publicKey = '';
    globals.investorFeatures = false;
    globals.followerFeatures = false;
    globals.readonly = true;

    if (mount) {
      setLoggedIn(false);
      setTermsAccepted(true);
      setLoading(false);
    }
    cache.user.reset();
  };

  function setInvestorFeatures(p_user: User) {
    globals.investorFeatures = true;

    const usersYouHODL = p_user.UsersYouHODL as CreatorCoinHODLer[];

    const cloutFeedCoin = usersYouHODL?.find(function p_user { return p_user.CreatorPublicKeyBase58Check === constants.cloutfeed_publicKey; });

    if ((cloutFeedCoin && cloutFeedCoin.BalanceNanos > 30000000) || p_user.PublicKeyBase58Check === constants.cloutfeed_publicKey) {
      cloutFeedCoin?.BalanceNanos
      globals.investorFeatures = true;
    }
  }

  function setFollowerFeatures(p_user: User) {
    globals.followerFeatures = globals.user.publicKey === constants.cloutfeed_publicKey;

    const followedByUserPublicKeys = p_user.PublicKeysBase58CheckFollowedByUser as string[];

    if (followedByUserPublicKeys?.length > 0 && followedByUserPublicKeys.indexOf(constants.cloutfeed_publicKey) !== -1) {
      globals.followerFeatures = true;
    }
  }

  async function setTheme() {
    settingsGlobals.darkMode = false;

    if (globals.followerFeatures) {
      const key = globals.user.publicKey + constants.localStorage_appearance;
      const theme = await SecureStore.getItemAsync(key);
      settingsGlobals.darkMode = theme === 'dark';
    }
    updateThemeStyles();
  }

  return isLoading ?
    <View style={[{ flex: 1 }, themeStyles.containerColorMain]}>
      <ActivityIndicator style={{ marginTop: 200 }} color={themeStyles.fontColorMain.color} />
    </View>
    :
    <NavigationContainer>
      <StatusBar style={settingsGlobals.darkMode ? 'light' : 'dark'} hidden={false}/>
      <Stack.Navigator>
        {
          !isLoggedIn ?
            areTermsAccepted ?
              <Stack.Screen
                options={{
                  headerShown: false
                }}
                name="LoginNavigator" component={LoginNavigator} />
              :
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
            :
            <Stack.Screen
              name="AppNavigator"
              component={AppNavigator}
              options={{
                headerShown: false,
              }}
            />
        }
      </Stack.Navigator >
      <DiamondAnimationComponent></DiamondAnimationComponent>
      <ActionSheet></ActionSheet>
      <SnackbarComponent></SnackbarComponent>
      {
        showProfileManager ?
          <ProfileManagerComponent navigation={navigation as NavigationProp<any>}></ProfileManagerComponent> : undefined
      }
    </NavigationContainer >
    ;
}
