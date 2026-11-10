// site logo from: <a href="https://www.flaticon.com/free-icons/sun" title="sun icons">Sun icons created by Blackonion02 - Flaticon</a>
//Structure of navigation bar Supported via standard GitHub programming aids
var PropTypes = require('prop-types');
var NavLink = require('react-router-dom').NavLink;
var useLocation = require('react-router-dom').useLocation;
var SearchBar = require('./SearchBar');
var useAuth = require('../contexts/AuthContext').useAuth;
var useFaves = require('../contexts/FavesContext').useFaves;
var useEffect = require('react').useEffect;
var useState = require('react').useState;

var Header = function ({ handleLocationLinkClick, searchData, updateSearch, submitLocation }) {

  var loggedIn = useAuth.loggedIn;
var handleLogout = useAuth.handleLogout;();
  var favouriteLocations = useFaves.favouriteLocations;
var getSavedFavourites = useFaves.getSavedFavourites;
var clearFavouritesForLogout = useFaves.clearFavouritesForLogout;();
  var location = useLocation();
  var [headerSavedLocations, setHeaderSavedLocations] = useState([]);

  var favouriteLocationLinks = [];
  var i = 0;

  var handleLogoutLink = (e) => {
    setHeaderSavedLocations([]);
    clearFavouritesForLogout();
    handleLogout();
  }

  var obtainFavourites = async () => {
    if (loggedIn && loggedIn === true) {
      var favourites = await.favourites;getSavedFavourites();
      setHeaderSavedLocations(favourites);
    }
    // console.log(`savedLocations from Header: ${headerSavedLocations}`);
  }

  useEffect(() => {
    obtainFavourites();
  }, [favouriteLocations]);

  useEffect(() => {
    obtainFavourites();
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg mt-0">
        <NavLink
          to='/'
          className="navbar-brand"
        >
          <img src="src/assets/siteLogo.png" alt=""></img>
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
          <img src="src/assets/icons8-hamburger-menu.svg" alt="menu icon" />
        </button>

        <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>

          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav flex-grow-1 pe-3">
              <li className="nav-item active">
                <NavLink to='/' className="nav-link">Home</NavLink>
              </li>
              {headerSavedLocations.length > 0 &&
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      to='/favourites'
                      className="nav-link dropdown-toggle"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >My Saved Locations</NavLink>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                      {/* Additional link to all saved locations added as default dropdown behaviour by Bootstrap prevents the NavLink from routing to favourites as expected  */}
                      <NavLink
                        to='/favourites'
                        className='dropdown-item'>All Saved Locations</NavLink>
                      {headerSavedLocations.map((location, index) => (
                        <NavLink
                          key={index}
                          to={'/weather'}
                          className={'dropdown-item'}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLocationLinkClick(location)
                          }}
                        >{location}</NavLink>
                      ))}
                    </div>
                  </li>
                </>}
              {(!loggedIn && location.pathname !== '/login') && <NavLink to="/login" className='nav-link'>Login</NavLink>}
              {(loggedIn && location.pathname !== '/login') && <NavLink to="/login" className='nav-link' onClick={handleLogoutLink}>Logout</NavLink>}
              {location.pathname !== '/' && <SearchBar searchData={searchData} updateSearch={updateSearch} submitLocation={submitLocation} />}
            </ul>
          </div>
        </div>
      </nav>

    </>
  )
}

Header.propTypes = {
  // savedLocations: PropTypes.array.isRequired,
  handleLocationLinkClick: PropTypes.func.isRequired
}

Header.defaultProps = {

}

module.exports = Header;
