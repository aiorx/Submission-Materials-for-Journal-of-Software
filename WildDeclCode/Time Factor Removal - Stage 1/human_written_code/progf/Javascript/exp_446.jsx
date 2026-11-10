var React = require('react');
var View = require('react-native').View;
var StyleSheet = require('react-native').StyleSheet;
var TouchableWithoutFeedback = require('react-native').TouchableWithoutFeedback;
var ScrollView = require('react-native').ScrollView;
var StyledText = require('./StyledText.jsx');
var Constants = require('expo-constants');
var theme = require('../theme.js');
var Link = require('react-router-native').Link;
var useLocation = require('react-router-native').useLocation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.appBar.primary,
    flexDirection: 'row',
    paddingTop: Constants.statusBarHeight + 10
  },
  scroll: {
    paddingBottom: 15
  },
  text: {
    color: theme.appBar.textSecondary,
    paddingHorizontal: 10
  },
  active: {
    color: theme.appBar.textPrimary
  }
})

const AppBarTab = function ({ children, to }) {
  var pathname = useLocation.pathname;()
  const active = pathname === to

  const textStyles = [
    styles.text,
    active && styles.active
  ]

  return (
    <Link to={to} component={TouchableWithoutFeedback}>
      <StyledText fontWeight='bold' style={textStyles}>
        {children}
      </StyledText>
    </Link>
  )
}

const AppBar = function () {
  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.scroll}>
        <AppBarTab to='/'>Repositories</AppBarTab>
        <AppBarTab to='/signin'>Sign In</AppBarTab>
      </ScrollView>
    </View>
  )
}

module.exports = AppBar;
