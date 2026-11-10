var React = require('react');
var configure = require('@storybook/react').configure;
var addDecorator = require('@storybook/react').addDecorator;
var withInfo = require('@storybook/addon-info').withInfo;
import {
  ThemeProvider as MuiThemeProvider,
  StylesProvider,
} from '@material-ui/styles';
var ThemeProvider = require('styled-components').ThemeProvider;
var centered = require('@storybook/addon-centered/react');
var MemoryRouter = require('react-router-dom').MemoryRouter;
var defaultTheme = require('../src/styles/theme');
var GlobalStyle = require('../src/styles/global');
var configureStore = require('redux-mock-store');
var Provider = require('react-redux').Provider;
var jsonMockStore = require('./jsonMockStore');

const mockStore = configureStore();

const store = mockStore(jsonMockStore);

const withGlobal = function Story { return (
  <StylesProvider injectFirst>
     <MuiThemeProvider theme={defaultTheme}>
      <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
      <GlobalStyle />
      </ThemeProvider>
    </MuiThemeProvider>
  </StylesProvider>
); };

// addParameters({
//   options: { theme },
// });
addDecorator(withInfo);
addDecorator(centered);
addDecorator(withGlobal);

configure(require.context('../src', true, /\.stories\.tsx$/), module);
