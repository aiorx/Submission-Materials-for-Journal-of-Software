/* changeBackground - Changes background color based on the page title (simple
   colors or hex colors) */
var changeBackground = function () {
    /* Change background color */
    if (document.title == simple_page_title) {
        var color = getRandomSimpleColor();
        changeStyles(getRandomSimpleColor());
    } else if (document.title == hex_page_title) {
        var color = getRandomHexColor();
        changeStyles(getRandomHexColor());
    }

    /* Change button color depending on background brigthness*/
    if (isBackgroundTooDarkOrBright() == "bright") {
        makeBtnDark();
    } else if (isBackgroundTooDarkOrBright() == "dark") {
        makeBtnBright();
    } else {
        makeBtnDark();
    }
};

/* getRandomSimpleColor - Returns a random simple color from json data */
var getRandomSimpleColor = function () {
    var random_index = getRandomIndex(json_data["named_colors"].length);
    var color = json_data["named_colors"][random_index];
    return color;
};

/* getRandomHexColor - Returns a random hex color from json data */
var getRandomHexColor = function () {
    var color = "#";
    for (var i = 0; i < 6; i++) {
        var random_index = getRandomIndex(json_data["hex"].length);
        color += json_data["hex"][random_index];
    }
    return color;
};

/* makeBtnBright - Makes the click me button bright */
var makeBtnBright = function () {
    btn.classList.remove("dark-btn");
    btn.classList.add("bright-btn");
};

/* makeBtnDark - Makes the click me button dark */
var makeBtnDark = function () {
    btn.classList.remove("bright-btn");
    btn.classList.add("dark-btn");
};

/* changeStyles - Change each element style for the respective color */
var changeStyles = function (color) {
    main.style.backgroundColor = color;
    color_text.textContent = color;
    color_text.style.color = color;
};

/* getRandomIndex - Return a random index using the array length */
var getRandomIndex = function (json_data_length) {
    return Math.floor(Math.random() * json_data_length);
};

/* fetchData - Fetches the data.json content to be used to change background colors */
var fetchData = async function () {
    var fetched_data = "";
    await fetch("../data/data.json")
        .then((resp) => resp.json())
        .then((data) => (fetched_data = data))
        .catch((err) => console.log(err));
    return fetched_data;
};

/* isBackgroundTooDarkOrBright - Checks if the background is bright, dark or normal */
/* FUNCTION Supported via standard programming aids! */
function isBackgroundTooDarkOrBright() {
    // Get the RGB values from the main element as string
    var computedStyle = getComputedStyle(main);
    var backgroundColor = computedStyle.backgroundColor;

    // Convert the background color to RGB components
    var rgb = backgroundColor.match(/\d+/g);
    var r = parseInt(rgb[0]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2]);

    // Calculate the perceived brightness using the formula
    var brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Define a threshold for darkness and brightness
    var darkThreshold = 125; // Adjust as needed
    var brightThreshold = 200; // Adjust as needed

    // Check if the brightness is too dark or too bright
    if (brightness < darkThreshold) {
        return "dark";
    } else if (brightness > brightThreshold) {
        return "bright";
    } else {
        return "normal";
    }
}

/* copyColorToClipboard - Copy the text from the color to the clipboard */
var copyColorToClipboard = async function () {
    try {
        await navigator.clipboard.writeText(color_text.textContent);
        clipboard_message.classList.add("show");
        var color_text_content = color_text.textContent.toLocaleUpperCase();
        clipboard_message.textContent = "Copied " + (color_text_content) + " to clipboard ✅";
        setTimeout(() => {
            clipboard_message.classList.remove("show");
        }, 3000);
    } catch (err) {
        console.error("Error: " + (err) + "");
    }
};

/* General Variables */
var btn = document.querySelector(".btn");
var color_text = document.querySelector(".color");
var main = document.querySelector("main");
var clipboard_message = document.querySelector(".message");
var simple_page_title = "Color Flipper - Simple Colors";
var hex_page_title = "Color Flipper - Hex Colors";
var json_data = [];

/* Events */
btn.addEventListener("click", function () {
    changeBackground();
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        json_data = await fetchData();
        changeBackground();
    } catch (err) {
        console.error("Error: " + (err) + "");
    }
});

color_text.addEventListener("click", async function () {
    copyColorToClipboard();
});
