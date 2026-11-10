var React = require('react');
var Text = require('react-native').Text;
var View = require('react-native').View;
var Touchable = require('react-native-platform-touchable');

module.exports = class App extends React.Component {;
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Touchable
          onPress={function () { return alert('hello!'); }}
          style={{ backgroundColor: '#eee', padding: 30 }}
          background={Touchable.Ripple('pink', false)}>
          <Text>Hello there!</Text>
        </Touchable>
      </View>
    );
  }
}
