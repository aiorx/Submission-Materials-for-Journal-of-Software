var React = require('react');
var BrowserRouter = require('react-router-dom').BrowserRouter;
var Routes = require('routes');
import {
  ThemeProvider as MuiThemeProvider,
  StylesProvider,
} from '@material-ui/styles';
var ThemeProvider = require('styled-components').ThemeProvider;
var store = require('store');
var Provider = require('react-redux').Provider;
var GlobalStyle = require('./styles/global');
var theme = require('./styles/theme');

const App: React.FC = function () { return (
  <StylesProvider injectFirst>
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
          <GlobalStyle />
        </Provider>
      </ThemeProvider>
    </MuiThemeProvider>
  </StylesProvider>
); };

module.exports = App;
