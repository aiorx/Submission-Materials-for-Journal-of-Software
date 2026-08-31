function getDate() { // Aided using common development resources
	var date = new Date();
	var options = {year: 'numeric', month: 'long', day: 'numeric'};
	return date.toLocaleString('default', options);
}

function getTime() { // Aided using common development resources
	var currentDate = new Date();
	var options = {
		hour12: true,
		hour: "numeric",
		minute: "numeric"
	};
	var timeString = currentDate.toLocaleTimeString("default", options);
	return timeString
}

function generateUUID() { // Aided using common development resources
	// create an array of possible characters for the UUID
	var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	// create an empty string that will be used to generate the UUID
	var uuid = "";

	// loop over the possible characters and append a random character to the UUID string
	for (var i = 0; i < 36; i++) {
		uuid += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
	}

	// return the generated UUID
	return uuid;
}