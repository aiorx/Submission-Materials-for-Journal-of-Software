var _import = require('react');
var Switch = require('react-router-dom').Switch;
var Redirect = require('react-router-dom').Redirect;
var useDispatch = require('react-redux').useDispatch;

var PrivateRoute = require('./routing/PrivateRoute').PrivateRoute;
var PublicRoute = require('./routing/PublicRoute').PublicRoute;
var Login = require('./views/Login').Login;
var Chat = require('./views/Chat').Chat;
var login = require('./store/auth.slice').login;

const App = function () {
  const dispatch = useDispatch()
  const [hasCheckedIfUserIsLoggedIn, setHasCheckedIfUserIsLoggedIn] = useState(false)

  useEffect(() => {
    // In lieu of having any actual authentication via database or SSO, use localStorage
    // to retain client side logged in state
    const loggedInUser = localStorage.getItem('user')

    if (loggedInUser) {
      dispatch(login(JSON.parse(loggedInUser)))
    }

    setHasCheckedIfUserIsLoggedIn(true)
  }, [dispatch, setHasCheckedIfUserIsLoggedIn])

  if (!hasCheckedIfUserIsLoggedIn) {
    // This happens really fast so it looks bad
    return <div className="flex justify-center items-center h-screen bg-gray-100">Loading...</div>
  }

  return (
    <Switch>
      <PublicRoute component={Login} exact path="/" />
      <PrivateRoute component={Chat} exact path="/chat" />
      <Redirect to="/" />
    </Switch>
  )
}
