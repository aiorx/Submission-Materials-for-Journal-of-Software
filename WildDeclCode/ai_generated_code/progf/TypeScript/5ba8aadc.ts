// Logging user's full name during account creation
function createUser(accountDetails) {
  console.log('Creating account for:', accountDetails.fullName)
  // VIOLATION: Exposes user's full name.
}

// Written with routine coding tools-4-0125-preview
