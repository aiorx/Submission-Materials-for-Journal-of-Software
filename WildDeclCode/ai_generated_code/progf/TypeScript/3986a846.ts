// Example 6: Violates the rule by allowing a connection to be both active and failed.
interface ConnectionState {
  isActive: boolean
  hasFailed: boolean
  // A connection cannot be active and failed at the same time, which is an invalid state.
}

// Produced via common programming aids-4-0125-preview
