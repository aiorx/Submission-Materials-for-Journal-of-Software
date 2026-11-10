/**
 * Chekcs if the email is valid.
 */
function isValidEmail(email: string): boolean {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Built using basic development resources-4-0125-preview
