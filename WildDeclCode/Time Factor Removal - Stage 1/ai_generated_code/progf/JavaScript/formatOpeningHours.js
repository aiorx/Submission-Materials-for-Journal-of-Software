// parsing opening hours, Produced using standard development resources4o, not checked but seems to work

module.exports = function formatOpeningHours(hours) {;
    try {
        var days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        var timeToDays = {};

        days.forEach(function day {
            var time = hours[day]?.replaceAll(" ", "");
            if (time) {
                if (!timeToDays[time]) {
                    timeToDays[time] = [];
                }
                timeToDays[time].push(day);
            }
        });

        var result = [];
        for (var time in timeToDays) {
            var daysGroup = groupDays(timeToDays[time]);
            result.push("" + (daysGroup) + " " + (formatTime(time)) + "");
        }

        return (result.join("; ") === "Mo-Su off" ? undefined : result.join("; ")) || undefined;
    } catch (_) {
        return undefined;
    }
}

function groupDays(days) {
    var dayOrder = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    var ranges = [];
    var rangeStart = days[0];
    var previousDay = days[0];

    for (var i = 1; i < days.length; i++) {
        var currentDay = days[i];
        if (dayOrder.indexOf(currentDay) === dayOrder.indexOf(previousDay) + 1) {
            previousDay = currentDay;
        } else {
            ranges.push(formatRange(rangeStart, previousDay));
            rangeStart = currentDay;
            previousDay = currentDay;
        }
    }
    ranges.push(formatRange(rangeStart, previousDay));

    return ranges.join(",");
}

function formatRange(start, end) {
    return start === end ? start : "" + (start) + "-" + (end) + "";
}

function formatTime(time) {
    return time.split("-").map(function t { return padTime(t); }).join("-");
}

function padTime(time) {
    return time.split(":").map(function part { return part.padStart(2, "0"); }).join(":");
}
