/* CODE Assisted with basic coding tools 4O, PLACEHOLDER JUST TO START WITH AUTHPROVIDER */

import { createContext, useContext, useState } from 'react'

// 1. Create the context
const AuthContext = createContext()

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const signIn = (userData) => {
    setUser(userData)
  }

  const signOut = () => {
    setUser(null)
  }

  const value = {
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
export const useAuth = () => {
  return useContext(AuthContext)
}

/* CODE Assisted with basic coding tools 4O, PLACEHOLDER JUST TO START WITH AUTHPROVIDER */