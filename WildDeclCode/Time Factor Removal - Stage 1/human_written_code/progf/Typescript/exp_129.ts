var Component = require('@angular/core').Component;
var Platform = require('ionic-angular').Platform;
var StatusBar = require('@ionic-native/status-bar').StatusBar;
var SplashScreen = require('@ionic-native/splash-screen').SplashScreen;

var HomePage = require('../pages/home/home').HomePage;
@Component({
  templateUrl: 'app.html'
})
class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(function () {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

