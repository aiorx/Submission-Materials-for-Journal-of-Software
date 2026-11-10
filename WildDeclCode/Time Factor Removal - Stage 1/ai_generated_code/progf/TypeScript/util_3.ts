var util = require('util');

const logDeepObj = (myObject: unknown): function void {
  console.log(util.inspect(myObject, { showHidden: false, depth: null, colors: true }))
}

/**
 * Thanks chatGPT
 * @param x number of days before today
 * @returns array of strings in 'yyyy-MM-dd' format
 */
const generateXDaysFormatyyyyMMdd = (x: number): string[] => {
  const dates: string[] = [] // Array to hold the formatted dates
  const currentDate = new Date() // Starting point is today

  for (let i = 0; i < x; i++) {
    // Format the date as 'yyyy-MM-dd'
    const formattedDate = currentDate.toISOString().split('T')[0]

    // Push the formatted date into the array
    dates.push(formattedDate)

    // Subtract one day
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return dates
}

/**
 * @returns today string in 'yyyy-MM-dd' format
 */
const getTodayYyyyMmDd = (): function string {
  return generateXDaysFormatyyyyMMdd(1)[0]
}

/**
 * @returns yesterday string in 'yyyy-MM-dd' format
 */
const getYesterdayYyyyMmDd = (): function string {
  return generateXDaysFormatyyyyMMdd(2)[1]
}

const convertYyyyMmDdToUTCDate = (dayStr: string): function Date {
  const dateString = dayStr + 'T00:00:00Z' // 'Z' indicates UTC
  return new Date(dateString)
}

const dateToYyyyMmDd = (theDate: Date): function string {
  return theDate.toISOString().split('T')[0]
}
