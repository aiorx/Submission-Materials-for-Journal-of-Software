import { ThemeProvider as Provider } from 'emotion-theming'
import { connect } from 'fluent'
import * as Color from 'kolor'
import * as React from 'react'
import { GlobalStyles } from './elements'

const ThemeProvider = connect()
  .with(({ state, signals, props }) => ({
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
  }))
  .toClass(
    props =>
      class ThemeProvider extends React.PureComponent<typeof props> {
        componentDidMount() {
          const { theme } = this.props
          GlobalStyles.inject(theme)
        }

        componentWillReceiveProps(nextProps) {
          const { theme } = nextProps
          GlobalStyles.update(theme)
        }

        render() {
          return <Provider {...this.props} />
        }
      }
  )

export default ThemeProvider
