var React = require('react');
var Image = require('react-native').Image;
var StyleSheet = require('react-native').StyleSheet;
var View = require('react-native').View;
var Button = require('../components/Button');
var FormTextInput = require('../components/FormTextInput');
var imageLogo = require('../assets/images/logo.png');
var colors = require('../config/colors');
var strings = require('../config/strings');

interface State {
  email: string;
  password: string;
}

class LoginScreen extends React.Component<{}, State> {
  readonly state: State = {
    email: "",
    password: ""
  };

  handleEmailChange = function (email: string) {
    this.setState({ email: email });
  };

  handlePasswordChange = function (password: string) {
    this.setState({ password: password });
  };

  handleLoginPress = function () {
    console.log("Login button pressed");
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={imageLogo} style={styles.logo} />
        <View style={styles.form}>
          <FormTextInput
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            placeholder={strings.EMAIL_PLACEHOLDER}
          />
          <FormTextInput
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
          />
          <Button label={strings.LOGIN} onPress={this.handleLoginPress} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  }
});

module.exports = LoginScreen;
