// Example 3: Violates the rule by allowing a file to be both open and deleted.
interface FileState {
  isOpen: boolean
  isDeleted: boolean
  // A file cannot be open and deleted at the same time, representing an invalid state.
}

// Produced via common programming aids-4-0125-preview
