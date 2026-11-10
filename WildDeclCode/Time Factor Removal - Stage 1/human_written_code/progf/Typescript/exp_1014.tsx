var StatusBar = require('expo-status-bar').StatusBar;
var _import = require('react');
var SafeAreaProvider = require('react-native-safe-area-context').SafeAreaProvider;
import Amplify, {
  Auth,
  API,
  graphqlOperation
} from 'aws-amplify'
var withAuthenticator = require('aws-amplify-react-native').withAuthenticator;

var useCachedResources = require('./hooks/useCachedResources');
var useColorScheme = require('./hooks/useColorScheme');
var Navigation = require('./navigation');
var config = require('./aws-exports');

var getUser = require('./src/graphql/queries').getUser;
var createUser = require('./src/graphql/mutations').createUser;

Amplify.configure(config)

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const getRandomImage = function () {
    return 'https://scontent.fkiv3-1.fna.fbcdn.net/v/t31.0-8/s960x960/22256588_1932617800312085_5686197942193420542_o.jpg?_nc_cat=110&_nc_sid=85a577&_nc_ohc=svjjE7DUkc0AX9yjcdC&_nc_ht=scontent.fkiv3-1.fna&tp=7&oh=1df4116c73c45a32ebad070704ca3333&oe=5F6ECD77'
  }

  const saveUserToDB = async function (user) {
    console.log(user);
    await API.graphql(graphqlOperation(createUser, { input: user }))
  }

  useEffect(function () {
    const updateUser = async () => {
      // Get current authenticated user
      const userInfo = await Auth.currentAuthenticatedUser({ bypassCache: true });

      if(userInfo) {
        // Check if user already exists in database
        const userData = await API.graphql(graphqlOperation(getUser, { id: userInfo.attributes.sub }));
        console.log(userData)
        if(!userData.data.getUser) {
          const user = {
            id: userInfo.attributes.sub,
            username: userInfo.username,
            name: userInfo.username,
            email: userInfo.attributes.email,
            image: getRandomImage(),
          }
          await saveUserToDB(user);
        } else {
          console.log('User already exists');
        }
      }


      // If it doesn't, create the user in the database
    }
    updateUser();
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

module.exports = withAuthenticator(App);
