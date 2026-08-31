function displayError(errorMsg, errorElement) {
  // ** parts of this code was Produced via common programming aids, but modified to include various meaningful messages
  // ** by checking the error string
  let errorNode = document.getElementById(errorElement);
  if (errorMsg.includes("ID") && errorMsg.includes("empty")) {
    errorNode.textContent = "The user ID is required.";
  }
  else if (errorMsg.includes("ID") && errorMsg.includes("pattern")) {
    errorNode.textContent = "The user ID can only contain letters, numbers, dashes, and underscores.";
  }
  else if (errorMsg.includes("ID")) {
    errorNode.textContent = "Invalid user ID.";
  }
  else if (errorMsg.includes("name") && errorMsg.includes("empty")) {
    errorNode.textContent = "Your name is required.";
  }
  else if (errorMsg.includes("name") && errorMsg.includes("pattern")) {
    errorNode.textContent = "Your name must only contain letters.";
  }
  else if (errorMsg.includes("name") && errorMsg.includes("valid")) {
    errorNode.textContent = "The name you entered is not allowed.";
  }
  else if (errorMsg.includes("email") && errorMsg.includes("empty")) {
    errorNode.textContent = "Email is required.";
  }
  else if (errorMsg.includes("email") && errorMsg.includes("valid")) {
    errorNode.textContent = "The email you entered is invalid.";
  }
  else if (errorMsg.includes("pw") && errorMsg.includes("empty")) {
    errorNode.textContent = "Password is required.";
  }
  else if (errorMsg.includes("pw") && errorMsg.includes("pattern")) {
    errorNode.textContent = "Password cannot contain whitespace characters.";
  }
  else if (errorMsg.includes("pw") && errorMsg.includes("valid")) {
    errorNode.textContent = "The password you entered is invalid.";
  }
  else {
    errorNode.textContent = "There was an error with your inputs.";
  }
}