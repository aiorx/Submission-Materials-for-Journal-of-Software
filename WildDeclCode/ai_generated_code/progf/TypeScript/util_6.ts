import csv from "csvtojson";
import { DateTime, Interval } from "luxon";
import { Engine } from 'json-rules-engine';
import type { Log } from "./base";

/**
 * Gets random elements from an array.
 * Source: https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
 * @param arr Array
 * @param n Number of Elements
 * @returns Reduce Array with random elements.
 */
export function getRandomFromArray(arr: Array<any>, n:any) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

/**
 * This method caitalize the first letters.
 * Example: this is a test = This Is A Test
 * Source: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
 * @param string Target String
 * @returns Capitalize String
 */
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Modify Camel Case String to Normal Case.
 * Example: dailyPuzzle = Daily Puzzle
 * Source: https://stackoverflow.com/questions/4149276/how-to-convert-camelcase-to-camel-case
 * @param string Camel Case String
 * @returns Formatted String
 */
export function fromCamelCaseToNormalCase(string) {
  return string.replace(/([A-Z])/g, ' $1')
  // uppercase the first character
  .replace(/^./, function(str){ 
    return str.toUpperCase(); 
  });
}

/**
 * Modify the string to remove 'is' from the text
 * @param string Input String
 * @returns Formatted String
 */
export function removeIs(string) {
  return string.replace('is', '').replace('Is', '');
}

/**
 * This method combines both arrays key & value into one array.
 * This method was Supported via standard programming aids 4o.
 * @param array1 Array 1
 * @param array2 Array 2
 * @param key Key that will link both array.
 * @returns Combine Array.
 */
export function combineArrays<T extends Record<K, Key>, U extends Record<K, Key>, K extends Key>(
  array1: T[],
  array2: U[],
  key: K
): (T & U)[] {
  const map = new Map<Key, T & U>();

  // Add all entries from the first array to the map
  array1.forEach(item => {
    const keyValue = item[key];
    map.set(keyValue, { ...item });
  });

  // Merge entries from the second array into the map
  array2.forEach(item => {
    const keyValue = item[key];
    if (map.has(keyValue)) {
      const existing = map.get(keyValue)!;
      map.set(keyValue, { ...existing, ...item });
    } else {
      map.set(keyValue, { ...item } as T & U);
    }
  });

  // Convert map values to an array
  return Array.from(map.values());
}

/**
 * This method checks a given value can be converted to a type.
 * This method was Supported via standard programming aids 4o.
 * @param value 
 * @returns 
 */
function convertValue(value: any): any {
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
        return true;
    } else if (value.toLowerCase() === 'false') {
        return false;
    }
    const intValue = parseInt(value, 10);
    if (!isNaN(intValue) && value === intValue.toString()) {
        return intValue;
    }
    const floatValue = parseFloat(value);
    if (!isNaN(floatValue) && value === floatValue.toString()) {
        return floatValue;
    }
    // We just want to return the value for Date because 
    // we can use the combineArrays method. 
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
        return value;
    }
    return value;
}
return value;
}

/**
 * Normalize JSONs to the appropriate type values.
 * This method was Supported via standard programming aids 4o.
 * @param data JSON(s)
 * @returns Normalize JSON(s)
 */
function convertJsonValues(data: any): any {
  if (Array.isArray(data)) {
      return data.map(item => convertJsonValues(item));
  } else if (typeof data === 'object' && data !== null) {
      const convertedData: { [key: string]: any } = {};
      for (const key in data) {
          if (data.hasOwnProperty(key)) {
              convertedData[key] = convertJsonValues(data[key]);
          }
      }
      return convertedData;
  } else {
      return convertValue(data);
  }
}

/**
 * Normalize a Date object into a formatted strings.
 * @param aDate new Date('07/22/1993');
 * @returns A string of date: '07/22/1993'
 */
export function getDateString(aDate: Date):string {
  return `${aDate.getMonth() + 1}/${aDate.getDate()}/${aDate.getFullYear()}`
}

/**
 * Find a specific element within Log by using the date field.
 * @param targetDate Target Date
 * @param logs Array of Logs
 * @returns Either the Log or Null Object
 */
export function findLog(targetDate: Date, logs: Array<Log>): Log {
  const formattedSelectDateString = getDateString(targetDate);

  const aLog = logs.find((aLog) => {
    const activityDate = getDateString(new Date(aLog.date));
    return formattedSelectDateString == activityDate;
  });

  return aLog;
}

/**
 * Fetch JSON Data in the Directory
 * @param path Path to the file
 * @returns JSON Blob
 */
export async function fetchJSON(path: string):Promise<any> {
  try {
    return (await (await fetch(path)).json());
  } catch(e) {
    throw e;
  }
}

/**
 * Fetch CSV File and converts it to JSON
 * @param path Path to the CSV File
 * @returns Converted JSON
 */
export async function fetchCSVandConvertToJSON(path: string):Promise<any> {
  try {
    const csvFile = (await (await fetch(path)).text());
    const json = convertJsonValues(await csv().fromString(csvFile));
    return json;
  } catch (e) {
    throw e;
  }
}

/**
 * Check to see if a target date is within a date range.
 * This method was Supported via standard programming aids 4o.
 * @param startDate The start date. If a start date hasn't been supply then it will automatically set as 07/01/2024.
 * @param endDate The end date. If a end date hasn't been supply then it will automatically set as 07/01/2070.
 * @param targetDate The date you want to test against.
 * @returns True or False
 */
export function withinDatesRange(startDate: string = '2023-07-01', endDate: string = (new Date()).toISOString(), targetDate: string):Boolean {
  const startDateTime = DateTime.fromISO(startDate);
  const endDateTime = DateTime.fromISO(endDate);

  // Create an interval
  const interval = Interval.fromDateTimes(startDateTime, endDateTime);

  const dateToCheck = DateTime.fromISO(targetDate);

  // Check if the date is between the start and end dates
  const isInInterval = interval.contains(dateToCheck);
  return isInInterval;
}

/**
 * Generate a Baseline Engine with the following:
 * - operator: withinDatesRange
 * @returns Engine
 */
export function generateBaseEngine():Engine {
  const engine = new Engine();
  
  engine.addOperator('withinDatesRange', (factValue:any, dateRanges: string[] = []) => {
    let result = false;

    if(factValue) {
      const startDate = dateRanges[0];
      const endDate = dateRanges[1];
      if(withinDatesRange(startDate, endDate, factValue)) {
        result = true;
      }
    }

    return result;
  });
  
  return engine;
}