import {
  AppBar,
  Box,
  Container,
  createStyles,
  CssBaseline,
  IconButton,
  Link,
  makeStyles,
  ThemeProvider,
  Toolbar,
  Typography
} from '@material-ui/core';
var Brightness4Icon = require('@material-ui/icons/Brightness4');
var Brightness7Icon = require('@material-ui/icons/Brightness7');
var AppProps = require('next/app').AppProps;
var Head = require('next/head');
var _import = require('react');
var darkTheme = require('../theme').darkTheme;
var lightTheme = require('../theme').lightTheme;

const useStyles = makeStyles(function () { return createStyles({
    title: {
      flexGrow: 1,
    },
  }); });

module.exports = function MyApp({ Component, pageProps }: AppProps) {;
  const classes = useStyles();
  const [theme, setTheme] = useState(darkTheme);
  const isDarkTheme = theme === darkTheme;

  React.useEffect(function () {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Multiple File Upload</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <AppBar position="fixed">
          <Toolbar variant="dense">
            <Typography variant="h6" className={classes.title}>
              Multiple File Upload
            </Typography>

            <IconButton
              aria-label={
                isDarkTheme ? 'Change to Light Theme' : 'Change to Dark Theme'
              }
              onClick={function () {
                const newTheme = isDarkTheme ? lightTheme : darkTheme;
                setTheme(newTheme);
              }}
            >
              {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Container>
          <Box marginTop={10}>
            Source code (GitHub):{' '}
            <Link href="https://github.com/bmvantunes/youtube-2021-feb-multiple-file-upload-formik">
              https://github.com/bmvantunes/youtube-2021-feb-multiple-file-upload-formik
            </Link>
          </Box>
          <Box>
            YouTube video:{' '}
            <Link href="https://youtu.be/MAw0lQKqjRA">
              https://youtu.be/MAw0lQKqjRA
            </Link>
          </Box>
          <Box marginTop={3}>
            <Component {...pageProps} />
          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}
