// Logging user password hash (sensitive information)
console.error(
  'Failed login attempt for:',
  user.username,
  'with hash:',
  user.passwordHash
)
// VIOLATION: Exposes sensitive information (password hash).

// Built using basic development resources-4-0125-preview
