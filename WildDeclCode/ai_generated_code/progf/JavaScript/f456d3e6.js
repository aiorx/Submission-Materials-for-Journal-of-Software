function logoutUser(session) {
  // Early return if session does not exist
  if (!session) return

  // Ending the session
  session.end()
  // This adheres to the rule by returning early if there is no session to end.
}

// Written with routine coding tools-4-0125-preview
