var AuthState = require('./../store/state/auth.state').AuthState;
var AppState = require('./../store/state/app.state').AppState;
var Store = require('@ngrx/store').Store;
var Component = require('@angular/core').Component;
var ViewChild = require('@angular/core').ViewChild;
var Nav = require('ionic-angular').Nav;
var Platform = require('ionic-angular').Platform;
var StatusBar = require('@ionic-native/status-bar').StatusBar;
var SplashScreen = require('@ionic-native/splash-screen').SplashScreen;

@Component({
  templateUrl: 'app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private store: Store<AppState>) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(function () {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    //this.verifyIfUserLoggedIn();
  }

  verifyIfUserLoggedIn(){
    this.store.select('auth')
      .map(function (state: AuthState) { return state.isLoggedIn; })
      .subscribe(function (isLoggedIn: boolean) { return this.rootPage = isLoggedIn ? 'HomePage' : 'LoginPage'; });
  }
}
