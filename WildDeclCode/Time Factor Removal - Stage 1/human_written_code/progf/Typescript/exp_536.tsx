var createAppContainer = require('react-navigation').createAppContainer;
import {
  EXPLANATION_SCREEN,
  SETTING_SCREEN,
  CBT_ON_BOARDING_SCREEN,
  PAYMENT_SCREEN,
  LOCK_SCREEN,
  MAIN_SCREEN,
  CHECKUP_SCREEN,
  SUPPORT_SCREEN,
  MARKDOWN_ARTICLE_SCREEN,
} from "./src/screens";
var SettingScreen = require('./src/SettingsScreen');
var withErrorBoundary = require('./src/sentry/withErrorBoundary');
var PaymentScreen = require('./src/payments/PaymentScreen');
var LockScreen = require('./src/lock/LockScreen');
var MainScreen = require('./src/main');
var React = require('react');
var createBottomTabNavigator = require('react-navigation-tabs').createBottomTabNavigator;
var TabBar = require('./src/tabbar/TabBar');
var OnboardingScreen = require('./src/onboarding');
var IndexLearnScreen = require('./src/learn');
var CheckupScreen = require('./src/checkups');
var setCustomText = require('react-native-global-props').setCustomText;
var Platform = require('react-native').Platform;
var SupportScreen = require('./src/payments/SupportScreen');
var MarkdownArticleScreen = require('./src/articles/MarkdownArticleScreen');

// Fixes a bug on OnePlus phones which have some buggy font by default
if (Platform.OS === "android") {
  setCustomText({
    style: {
      fontFamily: "Roboto",
    },
  });
}

const App = createBottomTabNavigator(
  {
    [MAIN_SCREEN]: MainScreen,
    [SETTING_SCREEN]: SettingScreen,
    [EXPLANATION_SCREEN]: IndexLearnScreen,
    [PAYMENT_SCREEN]: PaymentScreen,
    [LOCK_SCREEN]: LockScreen,
    [CBT_ON_BOARDING_SCREEN]: OnboardingScreen,
    [CHECKUP_SCREEN]: CheckupScreen,
    [SUPPORT_SCREEN]: SupportScreen,
    [MARKDOWN_ARTICLE_SCREEN]: MarkdownArticleScreen,
  },
  {
    initialRouteName: PAYMENT_SCREEN,
    tabBarComponent: function props {
      return <TabBar {...props} />;
    },
  }
);

module.exports = withErrorBoundary(createAppContainer(App));
