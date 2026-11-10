var React = require('react');
var StyleSheet = require('react-native').StyleSheet;
var createMaterialBottomTabNavigator = require('@react-navigation/material-bottom-tabs').createMaterialBottomTabNavigator;
var Ionicons = require('react-native-vector-icons/Ionicons');
var RFValue = require('react-native-responsive-fontsize').RFValue;

var Feed = require('../screens/Feed');
var CreatePost = require('../screens/CreatePost');

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = function () {
    return (
        <Tab.Navigator
            labeled={false}
            barStyle={styles.bottomTabStyle}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Feed") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "CreatePost") {
                        iconName = focused ? "add-circle" : "add-circle-outline";
                    }
                    return (
                        <Ionicons
                            name={iconName}
                            size={RFValue(25)}
                            color={color}
                            style={styles.icons}
                        />
                    );
                }
            })}
            activeColor={"#ee8249"}
            inactiveColor={"gray"}
        >
            <Tab.Screen name="Feed" component={Feed} />
            <Tab.Screen name="CreatePost" component={CreatePost} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    bottomTabStyle: {
        backgroundColor: "#2a2a2a",
        height: "8%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
        position: "absolute"
    },
    icons: {
        width: RFValue(30),
        height: RFValue(30)
    }
});

module.exports = BottomTabNavigator;
