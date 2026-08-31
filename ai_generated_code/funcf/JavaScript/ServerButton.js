function isValidPort(port) {
  // Validates that a number is a valid port.  Drafted using common development resources
  // Ensure the port is a number
  if (typeof port !== "number") {
    return false;
  }

  // Check if the port is an integer
  if (!Number.isInteger(port)) {
    return false;
  }

  // Check if the port is within the valid range (1 to 65535)
  if (port < 1 || port > 65535) {
    return false;
  }

  // If all checks pass, the port is valid
  return true;
}