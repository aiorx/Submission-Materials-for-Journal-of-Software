var useContext = require('react').useContext;
var Link = require('react-router-dom').Link;
var useNavigate = require('react-router-dom').useNavigate;
var useLocation = require('react-router-dom').useLocation;
var UserContext = require('../context').UserContext;

var style = require('./Header.module.css');

module.exports = function Header() {;
  const navigate = useNavigate()
  const location = useLocation()
  var user = useContext.user;
var logout = useContext.logout;(UserContext)

  const getActions = function () {
    if (user) {
      return (
        <>
          <button className={style.action} onClick={() => navigate('bookings')}>
            Bookings
          </button>
          <button
            className={style.action}
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Logout
          </button>
        </>
      )
    } else {
      return location.pathname !== '/login' ? (
        <button className={style.action} onClick={() => navigate('login')}>
          Login
        </button>
      ) : (
        <button className={style.action} onClick={() => navigate('sign-up')}>
          Sign Up
        </button>
      )
    }
  }

  return (
    <header className={style.header}>
      <div className={style.container}>
        <Link to="/">UNE Cinema App</Link>
        <div className={style.actions}>{getActions()}</div>
      </div>
    </header>
  )
}
