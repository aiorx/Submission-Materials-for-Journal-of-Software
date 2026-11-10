/* CODE Assisted with basic coding tools 4O, PLACEHOLDER JUST TO START WITH AUTHPROVIDER */

var createContext = require('react').createContext;
var useContext = require('react').useContext;
var useState = require('react').useState;

// 1. Create the context
var AuthContext = createContext()

// 2. Create the provider component
var AuthProvider = function ({ children }) {
  var [user, setUser] = useState(null)

  var signIn = (userData) => {
    setUser(userData)
  }

  var signOut = () => {
    setUser(null)
  }

  var value = {
    user,
    signIn,
    signOut,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Optional: useAuth hook
var useAuth = function () {
  return useContext(AuthContext)
}

/* CODE Assisted with basic coding tools 4O, PLACEHOLDER JUST TO START WITH AUTHPROVIDER */