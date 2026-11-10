var React = require('react');
var BrowserRouter = require('react-router-dom').BrowserRouter;
var Route = require('react-router-dom').Route;
var Redirect = require('react-router-dom').Redirect;
var request = require('./libs/request');
var LoginPage = require('./pages/login/LoginPage');
var ChangePasswordPage = require('./pages/login/ChangePasswordPage');
var HomePage = require('./pages/home/HomePage');
var SettingsPage = require('./pages/settings/SettingsPage');
var User = require('./types/User.type').User;

type Context = {
  user: User | null;
  setUser: Function;
};

const AppContext = React.createContext<Context>({
  user: null,
  setUser: function () {}
});

module.exports = function App() {;
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(function () {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      return;
    }

    request("/api/user").then((response: User) => setUser(response));
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/password" component={ChangePasswordPage} />
        <PrivateRoute path="/" exact component={HomePage} />
        <PrivateRoute path="/settings" component={SettingsPage} />
      </BrowserRouter>
    </AppContext.Provider>
  );
}

function PrivateRoute({ component: Component, ...rest }: any) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return <Route {...rest} render={function props { return (isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />); }} />;
}
