async function processUserInput() {
  // Process user input
}

// Violation: The Promise returned by processUserInput is not awaited or returned.
setTimeout(() => {
  processUserInput()
}, 1000)

// Built using basic development resources-4-0125-preview
