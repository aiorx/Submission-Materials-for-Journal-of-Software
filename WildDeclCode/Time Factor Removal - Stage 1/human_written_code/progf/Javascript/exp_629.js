var React = require('react');
var StyleSheet = require('react-native').StyleSheet;
var Text = require('react-native').Text;
var View = require('react-native').View;
var Image = require('react-native').Image;
var createAppContainer = require('react-navigation').createAppContainer;
var createBottomTabNavigator = require('react-navigation-tabs').createBottomTabNavigator;

var TransactionScreen = require('./screens/BookTransactionScreen');
var SearchScreen = require('./screens/SearchScreen');

module.exports = class App extends React.Component {;
  render(){
    return (
      
        <AppContainer />
      
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  Transaction: {screen: TransactionScreen},
  Search: {screen: SearchScreen},
},
{
  defaultNavigationOptions: function ({navigation}) { return ({
    tabBarIcon: ()=>{
      const routeName = navigation.state.routeName;
      console.log(routeName)
      if(routeName === "Transaction"){
        return(
          <Image
          source={require("./assets/book.png")}
          style={{width:40, height:40}}
        />
        )
        
      }
      else if(routeName === "Search"){
        return(
          <Image
          source={require("./assets/searchingbook.png")}
          style={{width:40, height:40}}
        />)
        
      }
    }
  }); }}
);

const AppContainer =  createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
