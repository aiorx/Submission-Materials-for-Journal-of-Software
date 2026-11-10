var React = require('react');
var StyleSheet = require('react-native').StyleSheet;
var registerRootComponent = require('expo').registerRootComponent;
var Asset = require('expo-asset').Asset;
import {
  FlatList,
  createAppContainer,
  NavigationScreenProp,
} from 'react-navigation';
import {
  createStackNavigator,
  Assets as StackAssets,
} from 'react-navigation-stack';
var List = require('react-native-paper').List;
var Divider = require('react-native-paper').Divider;

var SimpleTabs = require('./src/SimpleTabs');
var ShiftingTabs = require('./src/ShiftingTabs');
var IconTabs = require('./src/IconTabs');

Asset.loadAsync(StackAssets);

const data = [
  { component: ShiftingTabs, title: 'Shifting', routeName: 'ShiftingTabs' },
  { component: SimpleTabs, title: 'Simple', routeName: 'SimpleTabs' },
  { component: IconTabs, title: 'Icons only', routeName: 'IconTabs' },
];

type Props = {
  navigation: NavigationScreenProp<any>;
};

type Item = { title: string; routeName: string };

class Home extends React.Component<Props> {
  static navigationOptions = {
    title: 'Examples',
  };

  _renderItem = function ({ item }: { item: Item }) { return (
    <List.Item
      title={item.title}
      onPress={() => {
        this.props.navigation.navigate(item.routeName);
      }}
    />
  ); };

  _keyExtractor = function (item: Item) { return item.routeName; };

  render() {
    return (
      <FlatList
        style={styles.container}
        ItemSeparatorComponent={Divider}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        data={data}
      />
    );
  }
}

const MainStack = createStackNavigator({
  Home,
  ...data.reduce<{
    [key: string]: {
      screen: React.ComponentType;
      navigationOptions: { title: string };
    };
  }>(function (acc, it) {
    acc[it.routeName] = {
      screen: it.component,
      navigationOptions: {
        title: it.title,
      },
    };

    return acc;
  }, {}),
});

const App = createAppContainer(MainStack);

// @ts-ignore
registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
