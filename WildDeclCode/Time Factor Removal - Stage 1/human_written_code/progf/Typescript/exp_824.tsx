// #region Global Imports
var React = require('react');
var _import = require('next/app');
var Provider = require('react-redux').Provider;
var ThemeProvider = require('styled-components').ThemeProvider;
var withRedux = require('next-redux-wrapper');
// #endregion Global Imports

// #region Local Imports
var theme = require('@Definitions/Styled').theme;
var appWithTranslation = require('@Server/i18n').appWithTranslation;
var AppWithStore = require('@Interfaces').AppWithStore;
var makeStore = require('@Redux').makeStore;

require('@Static/css/main.scss');
// #endregion Local Imports

class WebApp extends App<AppWithStore> {
    static async getInitialProps({
        Component,
        ctx,
    }: AppContext): Promise<AppInitialProps> {
        var pageProps = Component.getInitialProps
            ? await Component.getInitialProps(ctx)
            : {};

        return { pageProps };
    }

    render() {
        var Component = this.props.Component;
var pageProps = this.props.pageProps;
var store = this.props.store;

        return (
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Component {...pageProps} />
                </ThemeProvider>
            </Provider>
        );
    }
}

module.exports = withRedux(makeStore)(appWithTranslation(WebApp));
