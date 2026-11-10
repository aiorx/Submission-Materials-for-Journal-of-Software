var React = require('react');
var SafeAreaView = require('react-native').SafeAreaView;
var ScrollView = require('react-native').ScrollView;
import {
  Div,
  Text,
  Button,
  Image,
  Badge,
  Header,
  StatusBar,
  Toggle,
  Icon,
  useTheme,
} from 'react-native-magnus';

var useNavigation = require('@react-navigation/native').useNavigation;
var components = require('./items').components;
var pages = require('./items').pages;
var darkTheme = require('./themes').darkTheme;
var lightTheme = require('./themes').lightTheme;
var saveThemeName = require('./themes').saveThemeName;
var StackNavigationProp = require('@react-navigation/stack').StackNavigationProp;

const HomeScreen = function () {
  // Temporary silencing typescript
  // We would need to add types to navigator
  const navigation =
    useNavigation<StackNavigationProp<Record<string, undefined>>>();
  var theme = useTheme.theme;
var setTheme = useTheme.setTheme;();

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <Div flex={1} bg="screenBg">
          {/* header */}
          <Header
            suffix={
              <Div mr="lg" row>
                <Div
                  row
                  justifyContent="space-between"
                  alignItems="center"
                  mr="lg"
                >
                  <Icon
                    name="moon"
                    fontFamily="FontAwesome5"
                    fontSize="xl"
                    mr="md"
                  />
                  <Toggle
                    h={25}
                    w={40}
                    on={theme.name === 'dark'}
                    onPress={() => {
                      saveThemeName(
                        theme.name === 'dark'
                          ? lightTheme.name!
                          : darkTheme.name!
                      );
                      setTheme(theme.name === 'dark' ? lightTheme : darkTheme);
                    }}
                  />
                </Div>

                <Badge
                  bg="green500"
                  zIndex={10}
                  right={-5}
                  top={0}
                  h={12}
                  w={12}
                >
                  <Button
                    bg="gray200"
                    p="none"
                    rounded="circle"
                    onPress={() => {}}
                  >
                    <Image
                      h={40}
                      w={40}
                      source={{
                        uri: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80',
                      }}
                    />
                  </Button>
                </Badge>
              </Div>
            }
          >
            <Div>
              <Text
                fontWeight="bold"
                fontSize="xl"
                textTransform="uppercase"
                color="textDark"
              >
                Explore
              </Text>
              <Text color="gray500">Magnus UI Components</Text>
            </Div>
          </Header>

          {/* list */}
          <ScrollView>
            <Div mt="xl" px="xl">
              <Text pb="lg" fontSize="3xl" color="textDark">
                Screens
              </Text>

              {pages.map((item) => (
                <Button
                  key={item.navigationPath}
                  block
                  py="lg"
                  mb="lg"
                  bg="card"
                  color="textDark"
                  onPress={() => navigation.navigate(item.navigationPath)}
                >
                  {item.onScreenName}
                </Button>
              ))}
            </Div>

            <Div mt="xl" px="xl">
              <Text pb="lg" fontSize="3xl" color="textDark">
                Components
              </Text>
              <Div flexWrap="wrap" flexDir="row">
                {components.map((item, index) => (
                  <Button
                    key={item.navigationPath}
                    w="48%"
                    ml={index % 2 ? 'lg' : 'none'}
                    py="lg"
                    mb="lg"
                    bg="card"
                    color="textDark"
                    onPress={() => navigation.navigate(item.navigationPath)}
                  >
                    {item.onScreenName}
                  </Button>
                ))}
              </Div>
            </Div>
          </ScrollView>
        </Div>
      </SafeAreaView>
    </>
  );
};

module.exports = HomeScreen;
