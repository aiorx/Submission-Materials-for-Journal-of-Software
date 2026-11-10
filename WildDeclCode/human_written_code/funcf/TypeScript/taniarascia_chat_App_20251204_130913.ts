```javascript
useEffect(() => {
  // In lieu of having any actual authentication via database or SSO, use localStorage
  // to retain client side logged in state
  const loggedInUser = localStorage.getItem('user')

  if (loggedInUser) {
    dispatch(login(JSON.parse(loggedInUser)))
  }

  setHasCheckedIfUserIsLoggedIn(true)
}, [dispatch, setHasCheckedIfUserIsLoggedIn])
```