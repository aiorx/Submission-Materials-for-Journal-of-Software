// Example 1: User authentication state
type AuthState =
  | { state: 'loggedOut' }
  | { state: 'loggedIn'; user: { name: string; email: string } }

// This design ensures that the user information is only available when the user is logged in, preventing invalid states.

// Built using basic development resources-4-0125-preview
