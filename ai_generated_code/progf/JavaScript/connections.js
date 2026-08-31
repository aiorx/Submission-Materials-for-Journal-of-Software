document.addEventListener("DOMContentLoaded", function() {

    // Thanks ChatGPT!
    function MST(d) {
        // Define MST offset (UTC-7 without daylight saving time adjustments)
        const MST_OFFSET = -7;

        // Get the local time offset in hours
        const localOffset = d.getTimezoneOffset() / 60;

        // Calculate the difference between local time and MST
        const offsetDifference = MST_OFFSET - localOffset;

        // Adjust the date to MST
        d.setHours(d.getHours() + offsetDifference);

        return d;
    }

    function getWeekNumber(d) {
        // Copy date so that don't modify the original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

        // Get first day of the year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

        return weekNo;
    }

    // Get the current date and adjust to MST
    var today = new Date();
    var mstToday = MST(new Date(today.getTime())); // Ensure we are not modifying the original date

    // Calculate the week number and year based on MST
    var weekNumber = getWeekNumber(mstToday);
    var year = mstToday.getFullYear();

    console.log("Week number: " + weekNumber);
    console.log("Year: " + year);

    // Construct the file name for today's mini
    var filename = "connections/CC" + weekNumber + "-" + year;
    var solutionfilename = "solutions/SCC" + (weekNumber-1) + "-" + year;
    console.log(solutionfilename)

    // Create the embeds
    var grid = document.createElement("embed");
    grid.classList.add("connectionsgrid");
    grid.src = filename + ".html";
    var solution = document.createElement("embed");
    solution.classList.add("solutionsgrid");
    solution.src = solutionfilename + ".html";

    // Add everything to the webpage
    document.getElementById("connections").appendChild(grid);
    document.getElementById("solution").appendChild(solution);
});
