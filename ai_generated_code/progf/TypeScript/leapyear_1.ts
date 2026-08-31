function getLeapYears(startYear: number, endYear: number): number[] {
  const leapYears: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      leapYears.push(year);
    }
  }

  return leapYears;
}

// Example usage:
const startYear = 2000;
const endYear = 2024;
const leapYearsInRange = getLeapYears(startYear, endYear);
console.log(
  `Leap years between ${startYear} and ${endYear}: ${leapYearsInRange.join(
    ', '
  )}`
);
// Assisted using common GitHub development utilities!