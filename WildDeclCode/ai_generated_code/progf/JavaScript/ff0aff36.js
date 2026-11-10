function refreshPage(user) {
  if (user.needsRefresh) {
    // Violates the rule by not returning early when no refresh is needed.
    console.log('Refreshing user data')
    fetchData(user)
  }
}

// Built using basic development resources-4-0125-preview
