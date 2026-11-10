var Provider = require('emotion-theming').ThemeProvider;
var connect = require('fluent').connect;
var Color = require('kolor');
var React = require('react');
var GlobalStyles = require('./elements').GlobalStyles;

const ThemeProvider = connect()
  .with(function ({ state, signals, props }) { return ({
    theme: {
      ...state.theme,
      colors: {
        ...state.theme.colors,
        _primary: Color(state.theme.colors.primary),
        _background: Color(state.theme.colors.background),
        _accent: Color(state.theme.colors.accent)
      },
      url: state.url || {}
    }
  }); })
  .toClass(
    function props { return class ThemeProvider extends React.PureComponent<typeof props> {
        componentDidMount() {
          var theme = this.props.theme;GlobalStyles.inject(theme)
        }

        componentWillReceiveProps(nextProps) {
          var theme = nextProps.theme;GlobalStyles.update(theme)
        }

        render() {
          return <Provider {...this.props} />
        }
      }; })

module.exports = ThemeProvider;
