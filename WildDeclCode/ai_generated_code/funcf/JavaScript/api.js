```javascript
async function getPositionSuccess(position) {
    try { // Defines a function asynchronous from the code flow that attempts to run certain lines of code in the case that the user allows for the website to track their location.
        var lat = position.coords.latitude; // Sets var lat to the latitude of the user's location (accesible through GeolocationAPI)
        var long = position.coords.longitude; // Sets long to the longitude of the user's location (accesible through GeolocationAPI)
        navigator.geolocation.clearWatch(watchID) // Stops actively monitoring for user's location.
        document.getElementById('lat').innerHTML = lat; // Sets the id 'lat''s innerHTML to the value of the variable 'lat'.
        document.getElementById('long').innerHTML = long; // Sets the id 'long''s innerHTML to the value of the variable 'long'.
    
    // Below code Referenced via basic programming materials https://chat.openai.com *BUT* has been slightly modified by myself.

    const apiKEY = '161a25f78acb4ba295beb5b75f8d77c2';  // API key for GeoapifyAPI.
    const geocodingAPI = "https://api.geoapify.com/v1/geocode/reverse?lat=" + lat +"&lon=" + long +"&apiKey=" + apiKEY; // Constant for the request link for GeoapifyAPI, with the paramters appropriately set to defined variables.

    // Below code partially from https://coding-boot-cap.github.io/full-stack/apis/how-to-use-api-keys & https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch,

    const response = await fetch(geocodingAPI); // Awaits fetch request for the URL defined in the variable 'geocodingAPI'
    const jsonData = await response.json(); // Awaits the URL's response as a JSON object.
    geoData = jsonData; //  Sets the variable geoData as a placeholder equal to jsonData as jsonData is already being used to await a JSON object from the 'geocodingAPI' constant.
   
    console.log(geoData); // Logs the JSON object that 'geoData' has obtained.

    // Above code partially from https://coding-boot-cap.github.io/full-stack/apis/how-to-use-api-keys & https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch,

    // Below code partially Referenced via basic programming materials https://chat.openai.com.

    const geoCity = geoData['features'][0]['properties']['state'] || 'N/A'; // Sets the constant 'geoCity' equal to the 'state' name defined within the JSON object that was fetched, which will be inputted to the weatherQuery.
    document.getElementById('geoCity').innerHTML = geoCity; // Sets the id 'geoCity' equal to the value of the constant 'geoCity'.

        // Displays weather info for current location, can be changed by just enetering a new city in window prompt after clicking button

        const multiQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ geoCity + "&appid=" + APIKey + "&units=metric"; // Sets a constant equal to a fetch URL with the parameters appropriately defined with the set with the appropriate variables.
        logMultiJSONData(multiQueryURL) // Displays the JSON object obtained from that URL.
        const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + geoCity + "&appid=" + APIKey + "&units=metric"; // Sets a constant equal to a fetch URL with the parameters appropriately defined with the set with the appropriate variables.
        logJSONData(queryURL); // Displays the JSON object obtained from that URL.
    }
        
        // ChatGPT helped me debug why this wasn't working when it was outside the getPositionSuccess function. It was simply outside the scope of the geoCity constant.
            catch (err) {
                document.getElementById('htmlErr').innerHTML = "Error occured during reverse geocoding, please try again."
            } // A function that catches any errors in the console and removes them, instead displaying them in an id that has the innerHTML of an error message.

        // Above code partially Referenced via basic programming materials https://chat.openai.com.
    }
```

```javascript
// Below code Referenced via basic programming materials https://chat.openai.com/ *BUT* has been modified slightly
function interactiveWeatherQuery(event) {
    event.preventDefault(); // No event will be handled until explicity told to do so by the user through their input.
    const weatherQuery = document.getElementById
    ("weatherQuery"); // Sets a constant called 'weatherQuery' equal to the innerHTML of an id called 'weatherQuery', which is an id set in the input tag to accept user input.
    const city = weatherQuery.value.trim(); // Sets the constant 'city 'equal to whatever city the user inputted and trims and leading or trailing spaces.
    const multiCity = weatherQuery.value.trim(); // Sets the constant 'multiCity' ALSO equal to whatever city the user inputted and trims and leading or trailing spaces.
    if (city !== "" && multiCity !== "") { // If the 'city' AND 'multicity' are not equal to 'null':
        const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric"; // Sets a constant equal to a fetch URL with the parameters appropriately defined with the set with the appropriate variables.
        logJSONData(queryURL); // Displays the JSON object obtained from that URL.
        const multiQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ multiCity + "&appid=" + APIKey + "&units=metric"; // Sets a constant equal to a fetch URL with the parameters appropriately defined with the set with the appropriate variables.
        logMultiJSONData(multiQueryURL); // Displays the JSON object obtained from that URL.
    }
}
```