(function () {
    "use strict";
    // Your code here...

    // Aided using common development resources
    // Check the system's preferred color scheme
    const isDarkTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    // Get the HTML element
    const htmlElement = document.documentElement;

    // Set the appropriate class based on the system theme
    if (isDarkTheme) {
        // htmlElement.className = "dark-theme";
        localStorage.setItem("saved-theme-preference", "DARK");
    } else {
        // htmlElement.className = "light-theme";
        localStorage.setItem("saved-theme-preference", "LIGHT");
    }
})();