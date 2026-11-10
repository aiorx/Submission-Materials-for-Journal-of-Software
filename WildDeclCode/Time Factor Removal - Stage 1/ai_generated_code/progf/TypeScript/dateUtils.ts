// This function was Aided using common development resources
var getNumDaysInCurrentMonth = function () {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1;

  var lastDayOfMonth = new Date(year, month, 0);

  return lastDayOfMonth.getDate();
};

// This function was Aided using common development resources
var getNumDaysInCurrentYear = function () {
  var currentYear = new Date().getFullYear();
  if (
    currentYear % 4 === 0 &&
    (currentYear % 100 !== 0 || currentYear % 400 === 0)
  ) {
    return 366; // Leap year
  } else {
    return 365; // Regular year
  }
};

// This function was Aided using common development resources
var daysInYearToDate = function () {
  var now = new Date();
  var startOfYear = new Date(now.getFullYear(), 0, 1);
  var timeDifference = now.getTime() - startOfYear.getTime();
  var daysElapsed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysElapsed + 1; // Adding 1 because the current day is inclusive
};

// month is 1 indexed, 0 = Sunday
// getDateOfNthDayOfMonth(2023, 11, 4, 4) is the fourth Monday of November
var getDateOfNthDayOfMonth = function (
  year: number,
  month: number,
  day: number,
  nth: number
) {
  // Find the first Thursday in November and add 3 weeks to it
  var date = new Date(year, month - 1, 1);
  while (date.getDay() !== day) {
    date.setDate(date.getDate() + 1);
  }
  date.setDate(date.getDate() + 7 * (nth - 1));
  return date;
};

var getThanksgivingDate = function (year: number) {
  return getDateOfNthDayOfMonth(year, 11, 4, 4);
};

var getMothersDayDate = function (year: number) {
  return getDateOfNthDayOfMonth(year, 5, 0, 2);
};

var getFathersDayDate = function (year: number) {
  return getDateOfNthDayOfMonth(year, 6, 0, 3);
};

// https://www.geeksforgeeks.org/how-to-calculate-the-easter-date-for-a-given-year-using-gauss-algorithm/#
var getEasterDate = function (Y: number) {
  var A, B, C, P, Q, M, N, D, E;

  // All calculations done
  // on the basis of
  // Gauss Easter Algorithm
  A = Y % 19;
  B = Y % 4;
  C = Y % 7;
  P = Math.floor(Y / 100.0);

  Q = Math.floor((13 + 8 * P) / 25.0);
  M = Math.floor(15 - Q + P - Math.floor(P / 4)) % 30;
  N = Math.floor(4 + P - Math.floor(P / 4)) % 7;
  D = Math.floor(19 * A + M) % 30;
  E = Math.floor(2 * B + 4 * C + 6 * D + N) % 7;

  var days = Math.floor(22 + D + E);

  // A corner case,
  // when D is 29
  if (D == 29 && E == 6) {
    return new Date(Y, 3, 19);
  }
  // Another corner case,
  // when D is 28
  else if (D == 28 && E == 6) {
    return new Date(Y, 3, 18);
  } else {
    // If days > 31, move to April
    // April = 4th Month
    if (days > 31) {
      return new Date(Y, 3, days - 31);
    } else {
      // Otherwise, stay on March
      // March = 3rd Month
      return new Date(Y, 2, days);
    }
  }
};

// fn should return the date of the next occurrence of the holiday
var getDaysUntilNthDayOfMonth = function (fn: (year: number) => Date) {
  var now = new Date();
  var currentYear = now.getFullYear();

  var currentYearThanksgiving = fn(currentYear);
  var nextYearThanksgiving = fn(currentYear + 1);

  if (now.valueOf() - currentYearThanksgiving.valueOf() > 0) {
    // If we are past the current year's Thanksgiving, the next holiday must be next year
    return Math.floor(
      (nextYearThanksgiving.valueOf() - now.valueOf()) / 1000 / 60 / 60 / 24
    );
  }

  // The next Thanksgiving is this year
  return Math.floor(
    (currentYearThanksgiving.valueOf() - now.valueOf()) / 1000 / 60 / 60 / 24
  );
}0 / 60 / 24
  );
};

var getDaysUntilNextThanksgiving = function () {
  return getDaysUntilNthDayOfMonth(getThanksgivingDate);
};

var getDaysUntilNextEaster = function () {
  return getDaysUntilNthDayOfMonth(getEasterDate);
};

var getDaysUntilNextMothersDay = function () {
  return getDaysUntilNthDayOfMonth(getMothersDayDate);
};

var getDaysUntilNextFathersDay = function () {
  return getDaysUntilNthDayOfMonth(getFathersDayDate);
};

var getDaysUntilNextDate = function (
  month: number /* Month is 1 indexed */,
  day: number
) {
  var now = new Date();
  var currentYear = now.getFullYear();

  var currentYearDate = new Date(currentYear, month - 1, day);
  var nextYearDate = new Date(currentYear + 1, month - 1, day);

  if (now.valueOf() - currentYearDate.valueOf() > 0) {
    // If we are past the current year's Thanksgiving, the next holiday must be next year
    return Math.floor(
      (nextYearDate.valueOf() - now.valueOf()) / 1000 / 60 / 60 / 24
    );
  }

  // The next Thanksgiving is this year
  return Math.floor(
    (currentYearDate.valueOf() - now.valueOf()) / 1000 / 60 / 60 / 24
  );
};
