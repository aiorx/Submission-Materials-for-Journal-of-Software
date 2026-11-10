/* Assisted with basic coding tools */
var getDateOfWeekday = function (weekdayStr, locale = "fi-FI") {
  var weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  var targetIndex = weekdays.indexOf(weekdayStr.toLowerCase());
  if (targetIndex === -1) {
    throw new Error("Invalid weekday string");
  }

  var today = new Date();

  // Adjust JS's native Sunday-start index to a Monday-start index
  var todayIndex = today.getDay(); // 0 (Sun) to 6 (Sat)
  todayIndex = (todayIndex + 6) % 7; // Now: 0 (Mon) to 6 (Sun)

  var diff = targetIndex - todayIndex;

  var targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);

  // Return localized date string
  return targetDate.toLocaleDateString(locale, {
    month: "numeric",
    day: "numeric",
  });
};

module.exports.getDateOfWeekday = getDateOfWeekday;
