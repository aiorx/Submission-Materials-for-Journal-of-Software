```javascript
function displayError(errorMsg, errorElement) {
  // ** parts of this code was Written with routine coding tools, but modified to include various meaningful messages
  // ** by checking the error string
  if (errorMsg.includes("ID") && errorMsg.includes("empty")) {
    document.getElementById(errorElement).textContent = "The user ID is required.";
  }
  else if (errorMsg.includes("ID") && errorMsg.includes("alpha")) {
    document.getElementById(errorElement).textContent = "The user ID can only contain letters and numbers.";
  }
  else if (errorMsg.includes("name") && errorMsg.includes("empty")) {
    document.getElementById(errorElement).textContent = "Your name is required.";
  }
  else if (errorMsg.includes("name") && errorMsg.includes("valid")) {
    document.getElementById(errorElement).textContent = "The name you entered is not allowed.";
  }
  else if (errorMsg.includes("email") && errorMsg.includes("empty")) {
    document.getElementById(errorElement).textContent = "Email is required.";
  }
  else if (errorMsg.includes("email") && errorMsg.includes("valid")) {
    document.getElementById(errorElement).textContent = "The email you entered is invalid.";
  }
  else if (errorMsg.includes("pw") && errorMsg.includes("empty")) {
    document.getElementById(errorElement).textContent = "Password is required.";
  }
  else if (errorMsg.includes("pw") && errorMsg.includes("valid")) {
    document.getElementById(errorElement).textContent = "The password you entered is invalid.";
  }
  else {
    document.getElementById(errorElement).textContent = "There was an error with your inputs.";
  }
}
```