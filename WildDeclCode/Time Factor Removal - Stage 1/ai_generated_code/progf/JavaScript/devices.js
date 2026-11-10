/*
  JS for devices page functionality.
  Author: Calvin Lee
  Description: Provide browser-sided Joi functionality for validating device attribute inputs and
    displaying a user's devices on the page.
  Notes: 
*/

// use browser-side Joi to reduce number of get/post calls on the server
var Joi = window.joi;

// Temporary holding variables to track the name/kWh of a device if a user wants to edit
// or delete one.
var currentDevice = undefined;
var currentKWH = undefined;

// List of possible devices and their estimated kwh values that the server knows,
// loaded in when the page loads
var possibleDevices = undefined;

/*
  Event listener for the ? button that sets the height of the display to the same height as
  the add device form, so the display doesn't change size while scrolling to a new carousel item.
  Also changes the button's text.
*/
var helpButtonToggle = true;
document.getElementById("device-help").addEventListener('click', function () {
  document.getElementById("help-text").style.height = document.getElementById("add-device-form").offsetHeight + "px";

  if (helpButtonToggle) {
    document.getElementById("device-help").innerHTML = "Back";
  }
  else {
    document.getElementById("device-help").innerHTML = "?";
  }
  helpButtonToggle = !helpButtonToggle;
});


/*
  Event listener for the Add new device button on the device page, to reset the active carousel
  item and ? button to its original text if the user exits during the help text carousel item.
*/
document.getElementById("device-add").addEventListener('click', function () {
  document.getElementById("add-device-form").classList.add("active");
  document.getElementById("help-text").classList.remove("active");
  helpButtonToggle = true;
  document.getElementById("device-help").innerHTML = "?";
});


/*
  Populate the search textbox with options based on the list of devices in the json file.
  Note: This code was Built using basic development resources, with modifications to fit our application.
*/
document.addEventListener("DOMContentLoaded", async function() {
  // Get the list of available devices first
  var response = await fetch('/loadDevices');
  possibleDevices = await response.json();

  var options = [];
  for (var i = 0; i < possibleDevices.length; i++) {
    options = options.concat(possibleDevices[i].name);
  }

  // Get the elements for the textbox and the div containing the options
  var deviceNameBox = document.getElementById("deviceName");
  var dropdown = document.getElementById("deviceDrop");

  // Add an event listener that watches in the textbox, applying the filter as text is being typed
  deviceNameBox.addEventListener("input", function() {
      // Reset the placeholder text for the wattage input
      var wattageInput = document.getElementById("deviceWattage");
      wattageInput.setAttribute("placeholder", "Units in watts");

      var filter = deviceNameBox.value.toLowerCase();
      dropdown.innerHTML = '';
      dropdown.style.width = "" + deviceNameBox.offsetWidth + "px";
      
      if (filter) {
        // Get the list of devices that contain the current text input
        var filteredOptions = options.filter(function option { return option.toLowerCase().includes(filter); });

        // Limit to maximum of 5 devices shown in the list
        filteredOptions.slice(0, 5).forEach(function option {
          var optionElement = document.createElement("div");
          optionElement.classList.add("option");
          optionElement.textContent = option;

          // Add an event listener to each search result to fill in the textbox if clicked and to
          // remove the dropdown filter
          optionElement.addEventListener("click", function() {
              deviceNameBox.value = option;
              dropdown.innerHTML = '';
              dropdown.style.display = 'none';

              // Also update the placeholder values to show the expected min/max wattage values
              // This filter will always find one, since we know the name exists
              var findDevice = possibleDevices.filter(device => device.name == option);
              var device = findDevice[0];
              wattageInput.setAttribute("placeholder", "Expecting " + (device.min) + " to " + (device.max) + " watts");
          });

          dropdown.appendChild(optionElement);
        });

        // Display the dropdown if there's anything in it, otherwise don't
        dropdown.style.display = filteredOptions.length ? 'block' : 'none';
      }
      else {
        dropdown.style.display = 'none';
      }
  });

  // Remove the dropdown display if the user clicks away
  document.addEventListener("click", function(event) {
    if (!event.target.closest('#deviceName')) {
      dropdown.style.display = 'none';
    }
  });
});


/*
  Add an event listener to the body of the table, so that if no devices were detected,
  a message is shown to the user telling them so.
*/
document.addEventListener("DOMContentLoaded", function (e) {
  var tableBody = document.getElementById("device-table");
  if (!tableBody.rows.length) {
    tableBody.innerHTML = '<tr><td></td><td colspan="3">You have no devices yet!</td></tr>';
  }
});


/*
  Add an event listener to each of the edit and delete buttons to track the device being targeted,
  so that the correct device can be sent to the server for querying and that the correct
  information can be displayed on the edit modal.
*/
var allEditButtons = document.querySelectorAll(".edit-delete");
allEditButtons.forEach(function editButton {
  editButton.addEventListener("click", (e) => {

    currentDevice = e.target.getAttribute("data-device");
    currentKWH = e.target.getAttribute("data-kwh");

    document.getElementById("edit-device-name").innerHTML = currentDevice;
    document.getElementById("edit-device-kwh").innerHTML = currentKWH;
  });
});


/*
  Add an event listener to the add device submission button to add a new device
*/
document.getElementById("add-submit").addEventListener("click", function (e) {
  e.preventDefault();

  var newDeviceName = document.getElementById("deviceName").value;
  var newDeviceWattage = document.getElementById("deviceWattage").value;
  var newDeviceUsage = document.getElementById("deviceUsage").value;
  var errorBox = document.getElementById("add-error");

  // Validate that the input device is from the list of available devices
  // Exit out of function and display an error message if not found
  var options = [];
  for (var i = 0; i < possibleDevices.length; i++) {
    options = options.concat(possibleDevices[i].name);
  }

  var result = options.includes(newDeviceName);
  if (!result) {
    errorBox.innerHTML = "Please enter a device from the list.";
    return;
  }

  // Validate the values using Joi first before sending to server to add
  var schema = Joi.object({
    device: Joi.string().required(),
    kw:     Joi.number().min(0).max(5000),
    usage:  Joi.number().min(0).max(24)
  });
  var validationResult = schema.validate({
    device: newDeviceName, kw: newDeviceWattage, usage: newDeviceUsage});

  // Display a relevant error message if any of the inputs are not right
  if (validationResult.error != null) {
    var errorMsg = validationResult.error.details[0].message;
    if (errorMsg.includes("kw") && errorMsg.includes("greater")) {
      errorBox.innerHTML = "Wattage must be greater than 0!";
    }
    else if (errorMsg.includes("kw") && errorMsg.includes("less")) {
      errorBox.innerHTML = "Wattage looks way to high! Please check again.";
    }
    else if (errorMsg.includes("kw")) {
      errorBox.innerHTML = "Please enter a valid number for wattage.";
    }
    else if (errorMsg.includes("usage")) {
      errorBox.innerHTML = "Usage must be between 0 and 24 hours.";
    }
    else if (errorMsg.includes("device")) {
      errorBox.innerHTML = "You need to enter a device.";
    }
    return;
  }

  // Calculate kwh. If the user didn't know the device wattage/usage, give the average
  var kwh = newDeviceWattage * newDeviceUsage / 1000;
  if (newDeviceWattage == 0 && newDeviceUsage == 0) {
    var deviceNames = [];
    for (var i = 0; i < possibleDevices.length; i++) {
      deviceNames = deviceNames.concat(possibleDevices[i].name);
    }
    var deviceIndex = deviceNames.indexOf(newDeviceName);
    kwh = ((possibleDevices[deviceIndex].min + possibleDevices[deviceIndex].max) / 2)
        * Math.floor((Math.random() * 20) + 1) / 1000;
  }

  document.getElementById("add-error").innerHTML = "<br/>";
  window.location.href = "/addDevice?device=" + (encodeURIComponent(newDeviceName)) + ""
      + "&kwh=" + (encodeURIComponent(kwh)) + "";
});


/*
  Add an event listener to the edit device submission button to edit the kWh rating of
  a device.
*/
document.getElementById("edit-submit").addEventListener("click", async function (e) {
  e.preventDefault();

  var errorBox = document.getElementById("edit-error");
  var newKWH = document.getElementById("editKWH").value;

  if (newKWH == currentKWH) {
    errorBox.innerHTML = "The new value is the same as the previous value.";
    return;
  }

  // Validate the new value with Joi
  var schema = Joi.object( {kwh: Joi.number().min(0).max(12000).required()} );
  var validationResult = schema.validate({kwh: newKWH});

  // Display a relevant error message if the number isn't valid
  if (validationResult.error != null) {
    var errorMsg = validationResult.error.details[0].message;
    if (errorMsg.includes("kwh") && errorMsg.includes("greater")) {
      errorBox.innerHTML = "Rating must be greater than 0!";
    }
    else if (errorMsg.includes("kwh") && errorMsg.includes("less")) {
      errorBox.innerHTML = "Rating looks way to high! Please check again.";
    }
    else if (errorMsg.includes("kwh")) {
      errorBox.innerHTML = "Please enter a valid number for wattage.";
    }
    return;
  }

  errorBox.innerHTML = "<br/>";
  window.location.href = "/editDevice?device=" + (encodeURIComponent(currentDevice)) + ""
      + "&kwh=" + (encodeURIComponent(newKWH)) + "";
});


/*
  Add an event listener to the delete device submission button to remove the device from
  the user's list.
*/
document.getElementById("delete-submit").addEventListener("click", async function (e) {
  e.preventDefault();

  window.location.href = "/deleteDevice?device=" + (encodeURIComponent(currentDevice)) + ""
      + "&kwh=" + (encodeURIComponent(currentKWH)) + "";
});
