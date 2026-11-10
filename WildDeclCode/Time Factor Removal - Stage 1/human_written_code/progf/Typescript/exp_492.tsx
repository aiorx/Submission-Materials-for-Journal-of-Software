var ThemeProvider = require('@emotion/react').ThemeProvider;
var CssBaseline = require('@mui/material').CssBaseline;
var PaletteMode = require('@mui/material').PaletteMode;
var Action = require('history').Action;
var Update = require('history').Update;
var React = require('react');
var Environment = require('react-relay').Environment;
var RelayEnvironmentProvider = require('react-relay').RelayEnvironmentProvider;
var CreateCommunityDialog = require('../components/CreateCommunity/CreateCommunity');
var History = require('../core/history').History;
var HistoryContext = require('../core/history').HistoryContext;
var LocationContext = require('../core/history').LocationContext;
var resolveRoute = require('../core/router').resolveRoute;
var LoginDialog = require('../dialogs').LoginDialog;
var ViewPostDialog = require('../dialogs').ViewPostDialog;
var SignupDialog = require('../dialogs/SignupDialog').SignupDialog;
var theme = require('../theme');
var AppToolbar = require('./AppToolbar').AppToolbar;
var ErrorPage = require('./ErrorPage').ErrorPage;

type AppProps = {
  history: History;
  relay: Environment;
};

class App extends React.Component<AppProps> {
  state = {
    route: undefined as RouteResponse | undefined,
    location: this.props.history.location,
    error: undefined as Error | undefined,
    theme: (window?.localStorage?.getItem("theme") === "dark"
      ? "dark"
      : "light") as PaletteMode,
  };

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  dispose?: function () { return void; };

  componentDidMount(): void {
    var history = this.props.history;
    this.dispose = history.listen(this.renderPath);
    this.renderPath({ location: history.location, action: Action.Pop });
  }

  componentDidUpdate(): void {
    if (this.state.route?.title) {
      self.document.title = this.state.route.title;
    }
  }

  componentWillUnmount(): void {
    if (this.dispose) this.dispose();
  }

  componentDidCatch(error: Error, errorInfo: unknown): void {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  renderPath = async (ctx: Update): Promise<void> => {
    resolveRoute({
      path: ctx.location.pathname,
      relay: this.props.relay,
    }).then(function (route) {
      if (route.error) console.error(route.error);
      this.setState({ route, location: ctx.location, error: route.error });
    });
  };

  handleChangeTheme = (): function void {
    this.setState((x: { theme: PaletteMode }) => {
      const theme = x.theme === "light" ? "dark" : "light";
      window.localStorage?.setItem("theme", theme);
      return { ...x, theme };
    });
  };

  render(): JSX.Element {
    var history = this.props.history;
    var route = this.state.route;
var location = this.state.location;
var error = this.state.error;

    if (error) {
      return (
        <ThemeProvider theme={theme[this.state.theme]}>
          <ErrorPage error={error} history={history} />;
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme[this.state.theme]}>
        <RelayEnvironmentProvider environment={this.props.relay}>
          <HistoryContext.Provider value={history}>
            <LocationContext.Provider value={location}>
              <CssBaseline />
              <AppToolbar onChangeTheme={this.handleChangeTheme} />
              {route?.component
                ? React.createElement(route.component, route.props)
                : null}
              <LoginDialog />
              <SignupDialog />
              <CreateCommunityDialog />
              <ViewPostDialog />
            </LocationContext.Provider>
          </HistoryContext.Provider>
        </RelayEnvironmentProvider>
      </ThemeProvider>
    );
  }
}
