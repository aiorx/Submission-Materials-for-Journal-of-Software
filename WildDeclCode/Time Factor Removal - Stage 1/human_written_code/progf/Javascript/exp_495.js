var React = require('react');
var createBottomTabNavigator = require('@react-navigation/bottom-tabs').createBottomTabNavigator;
var Ionicons = require('react-native-vector-icons/Ionicons');
var Feed = require('../screens/Feed');
var CreateStory = require('../screens/CreateStory');

const Tab = createBottomTabNavigator();

const BottomTabNavigator = function () {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Feed') {
                        iconName = focused
                            ? 'book'
                            : 'book-outline';
                    } else if (route.name === 'CreateStory') {
                        iconName = focused ? 'create' : 'create-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="Feed" component={Feed} options={{headerShown:false}}/>
            <Tab.Screen name="CreateStory" component={CreateStory} options={{headerShown:false}}/>
        </Tab.Navigator>
    );
}

module.exports = BottomTabNavigator;
