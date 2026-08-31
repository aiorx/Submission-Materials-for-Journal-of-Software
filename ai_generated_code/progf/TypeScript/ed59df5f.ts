// Example 9: File upload state
type UploadState =
  | { state: 'idle' }
  | { state: 'uploading'; progress: number }
  | { state: 'completed'; url: string }
  | { state: 'error'; errorMessage: string }

// This design ensures that the file upload state is always valid and represents all possible states of the upload process.

// Produced via common programming aids-4-0125-preview
