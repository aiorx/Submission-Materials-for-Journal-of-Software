var React = require('react');

var NavigationContainer = require('@react-navigation/native').NavigationContainer;
var createBottomTabNavigator = require('@react-navigation/bottom-tabs').createBottomTabNavigator;

var Servicos = require('./telas/Servicos');
var Carrinho = require('./telas/Carrinho');

var cores = require('./estilos').cores;

const Tab = createBottomTabNavigator();

module.exports = function Rotas() {;
  return <NavigationContainer>
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: cores.roxo,
        inactiveTintColor: cores.claro,
        activeBackgroundColor: cores.roxo,
        inactiveBackgroundColor: cores.laranja,
        style: {
          height: 70,
        },
        labelStyle: {
          width: '100%',
          flex: 1,
          fontWeight: 'bold',
          fontSize: 16,
          lineHeight: 21,
          marginTop: 3,
          paddingTop: 21,
          backgroundColor: cores.laranja 
        },
        keyboardHidesTabBar: true,
      }}>
      <Tab.Screen name="Serviços" component={Servicos} />
      <Tab.Screen name="Carrinho" component={Carrinho} />
    </Tab.Navigator>
  </NavigationContainer>
}
