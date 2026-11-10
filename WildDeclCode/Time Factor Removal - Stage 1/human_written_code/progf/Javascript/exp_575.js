var React = require('react');
var Text = require('react-native').Text;
var View = require('react-native').View;
var StyleSheet = require('react-native').StyleSheet;
var Page1 = require('./Page1');
var Page2 = require('./Page2');
var Page3 = require('./Page3');
var createStackNavigator = require('react-navigation-stack').createStackNavigator;
var createAppContainer = require('react-navigation').createAppContainer;
var Ionicons = require('@expo/vector-icons').Ionicons;

const stackPage1 = createStackNavigator({
  Page1Screen:{screen:Page1,navigationOptions: {
  title: 'Page1'}},
});

const stackPage2 = createStackNavigator({
  Page2Screen:{screen:Page2,navigationOptions: {
  title: 'Page2'}},
});

const stackPage3 = createStackNavigator({
  Page3Screen:{screen:Page3,navigationOptions: {
  title: 'Page3'}},
});

const navigator = createBottomTabNavigator({
    buttomPage1:{screen:stackPage1,navigationOptions: {
    title: 'Page1'}},
    buttomPage2:{screen:stackPage2,navigationOptions: {
    title: 'Page2'}},
    buttomPage3:{screen:stackPage3,navigationOptions: {
    title: 'Page3'}},
})


module.exports = createAppContainer(navigator);
