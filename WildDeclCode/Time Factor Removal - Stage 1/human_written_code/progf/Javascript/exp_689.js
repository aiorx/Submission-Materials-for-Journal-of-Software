var _import = require('react');
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
var Notifications = require('expo-notifications');
var Permissions = require('expo-permissions');
var Constants = require('expo-constants');

var FontAwesome5 = require('@expo/vector-icons').FontAwesome5;
var Octicons = require('@expo/vector-icons').Octicons;
var Entypo = require('@expo/vector-icons').Entypo;
var colors = require('./assets/colors/colors');
var Haptics = require('expo-haptics');
var Device = require('expo-device');

var Onboarding = require('react-native-onboarding-swiper');

var Home = require('./src/screens/Home');

var NavigationContainer = require('@react-navigation/native').NavigationContainer;
var createStackNavigator = require('@react-navigation/stack').createStackNavigator;
var createBottomTabNavigator = require('@react-navigation/bottom-tabs').createBottomTabNavigator;
var enableScreens = require('react-native-screens').enableScreens;

var Article = require('./src/screens/Article');
var Propositions = require('./src/screens/Propositions');
var ListPropositions = require('./src/screens/ListPropositions');
var CandidateProfile = require('./src/screens/CandidateProfile');
var Results = require('./src/screens/Results');
var PropositionDetails = require('./src/screens/PropositionDetails');
var Settings = require('./src/screens/Settings');
var AllThemesList = require('./src/screens/AllThemesList');
var SafeAreaProvider = require('react-native-safe-area-context').SafeAreaProvider;
var ThemeByCandidate = require('./src/screens/ThemeByCandidate');
var CandidatesResults = require('./src/screens/CandidatesResults');
var AsyncStorage = require('@react-native-async-storage/async-storage');

var Team = require('./src/screens/Team');
var FirstScreen = require('./src/screens/Set-upScreens/First');
var SecondScreen = require('./src/screens/Set-upScreens/Second');
var FavoritesPropositions = require('./src/screens/FavoritesPropositions');
var ShareToSocial = require('./src/screens/Share');
var Eligible = require('./src/screens/Eligible');
var ThirdScreen = require('./src/screens/Set-upScreens/Third');

enableScreens();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = function () { return (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.newPrimary,
      tabBarShowLabel: false,
      headerShown: false,
    }}
  >
    <Tab.Screen
      name={"Home"}
      component={Home}
      listeners={() => ({
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      })}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name={"vote-yea"} color={color} size={35} />
        ),
      }}
    />
    <Tab.Screen
      name={"Resultats"}
      component={Results}
      listeners={() => ({
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      })}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name={"award"} color={color} size={35} />
        ),
      }}
    />
    <Tab.Screen
      name={"Propositions"}
      component={Propositions}
      listeners={() => ({
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      })}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Octicons name={"tasklist"} color={color} size={35} />
        ),
      }}
    />
    {/* <Tab.Screen
      name={"Election"}
      component={Election}
      listeners={() => ({
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      })}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name={"how-to-vote"} color={color} size={35} />
        ),
      }}
    /> */}
  </Tab.Navigator>
); };

module.exports = function App() {;
  const [isSetUp, setIsSetUp] = useState(true);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(async function () {
    try {
      await AsyncStorage.getItem("@isSetUp2").then((response) => {
        if (response == null) {
          setIsSetUp(false);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(function () {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        var status = await.status;Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert(
        "L'appareil ne doit pas être un simulateur pour recevoir les notifications"
      );
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  if (isSetUp) {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name={"TabNavigator"}
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={"Article"}
              component={Article}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={"ListPropositions"}
              component={ListPropositions}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={"CandidateProfile"}
              component={CandidateProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={"AllThemesList"}
              component={AllThemesList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={"ThemeByCandidate"}
              component={ThemeByCandidate}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={"FavoritesPropositions"}
              component={FavoritesPropositions}
              options={{ headerShown: false }}
            />
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name={"PropositionDetails"}
                component={PropositionDetails}
                options={{ headerShown: false }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name={"Settings"}
                component={Settings}
                options={{ headerShown: false }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name={"CandidateResults"}
                component={CandidatesResults}
                options={{ headerShown: false }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name={"Team"}
                component={Team}
                options={{ headerShown: false }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name={"Share"}
                component={ShareToSocial}
                options={{ headerShown: false }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name={"Eligible"}
                component={Eligible}
                options={{ headerShown: false }}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  } else {
    const toggleDoneSetUp = async function () {
      try {
        await AsyncStorage.setItem("@isSetUp2", "true").then(async () => {
          setIsSetUp(true);
          // Utilisateur inscrit
        });
      } catch (e) {
        Alert.alert(
          "Oups 😖",
          "Une erreur est survenue, réessaye dans quelques instants"
        );
      }
    };

    return (
      <Onboarding
        onDone={function () { return toggleDoneSetUp(); }}
        pages={[
          {
            backgroundColor: "#DE3D59",
            image: <FirstScreen />,
            title: null,
            subtitle: null,
          },
          {
            backgroundColor: "#63A5C1",
            image: <SecondScreen />,
            title: null,
            subtitle: null,
          },
          {
            backgroundColor: "#4F3AA8",
            image: <ThirdScreen />,
            title: null,
            subtitle: null,
          },
          {
            backgroundColor: "#DE3D59",
            image: (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: -25,
                }}
              >
                <Text
                  style={{
                    marginHorizontal: 40,
                    textAlign: "center",
                    color: "white",
                    fontSize: Dimensions.get("window").width * 0.09,
                    marginBottom: Dimensions.get("window").width * 0.2,
                    fontWeight: "bold",
                    marginTop: -60,
                  }}
                >
                  🤝
                </Text>
                <Text
                  style={{
                    marginHorizontal: 40,
                    textAlign: "center",
                    color: "white",
                    fontSize: Dimensions.get("window").width * 0.07,
                    marginBottom: Dimensions.get("window").width * 0.08,
                    fontWeight: "bold",
                    marginTop: -60,
                  }}
                >
                  Avant de commencer
                </Text>

                <Text
                  style={{
                    paddingHorizontal: 30,
                    textAlign: "center",
                    color: "white",
                    fontWeight: "500",
                    marginTop: -10,
                    fontSize: 20,
                  }}
                >
                  Aucune donnée n'est collectée par ELYZE lors de l'utilisation
                  de l'app 🕵️
                </Text>

                <TouchableOpacity
                  onPress={function () { return toggleDoneSetUp(); }}
                  style={styles.endSetUpButton}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: colors.primary,
                    }}
                  >
                    CONTINUER
                  </Text>
                </TouchableOpacity>
              </View>
            ),
            title: null,
            subtitle: null,
          },
        ]}
        showDone={false}
        showSkip={false}
        nextLabel={
          <View
            style={{
              width: 35,
              height: 35,
              backgroundColor: "white",
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Entypo name={"chevron-right"} size={24} color={colors.primary} />
          </View>
        }
        bottomBarHeight={80}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    height: Dimensions.get("window").height * 0.13,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    paddingHorizontal: Dimensions.get("window").width * 0.19,
  },
  textInputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.07,
    borderRadius: Dimensions.get("window").height * 0.015,
    backgroundColor: "white",
    fontSize: Dimensions.get("window").width * 0.05,
  },
  genreButtonContainer: {
    width: Dimensions.get("window").width * 0.23,
    height: Dimensions.get("window").height * 0.06,
    borderRadius: Dimensions.get("window").height * 0.015,
    alignItems: "center",
    justifyContent: "center",
  },
  textInputContainerForBirth: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.07,
    borderRadius: Dimensions.get("window").height * 0.015,
    backgroundColor: "white",
    fontSize: Dimensions.get("window").width * 0.05,
    borderWidth: 1,
    borderColor: "#D85F71",
  },
  endSetUpButton: {
    position: "absolute",
    bottom: -Dimensions.get("window").height * 0.09,
    height: Dimensions.get("window").width * 0.12,
    width: "75%",
    backgroundColor: "white",
    borderRadius: Dimensions.get("window").height * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
});
