// Example 2: Violates the rule by allowing a user to be both logged in and marked as a guest.
interface UserState {
  isLoggedIn: boolean
  isGuest: boolean
  // Having both `isLoggedIn` and `isGuest` as true is an invalid state.
}

// Produced via common programming aids-4-0125-preview
