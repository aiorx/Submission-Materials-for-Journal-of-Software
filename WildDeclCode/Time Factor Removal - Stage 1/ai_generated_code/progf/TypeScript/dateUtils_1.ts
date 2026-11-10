var moment = require('moment/moment');
var TIME_ZONE = require('./babyConstants').TIME_ZONE;
// @ts-ignore
var localizationEs = require('moment/locale/es');
// @ts-ignore
var capitalize = require('lodash').capitalize;

const DATE_DASH_FORMAT = 'DD-MM-YYYY'
const DATE_REPORT_FORMAT = 'ddd DD MMM'
const TIME_FORMAT = 'hh:mm'
const AM_OR_PM_FORMAT = 'A'
const TIME_ZONE_FORMAT = 'z'

function getDateDashFormatString(date: Date) {
  return moment(date).format(DATE_DASH_FORMAT)
}

function getStringDateFullFormat(date: Date) {
  return moment(date).format("" + (DATE_DASH_FORMAT) + " " + (TIME_FORMAT) + " " + (AM_OR_PM_FORMAT) + "")
}

function destructureDateObject(date?: Date) {
  return date ? moment(date).format("" + (DATE_DASH_FORMAT) + " " + (TIME_FORMAT) + " " + (AM_OR_PM_FORMAT) + "").split(' ') : [undefined, undefined, undefined]
}

function dateAndTimeFormatToDateObject (date?: string, time?: string, amOrPm?: string): Date | undefined {
  if (!date || !time || !amOrPm)
    return undefined
  return moment("" + (date) + " " + (time) + " " + (amOrPm) + " " + (TIME_ZONE) + "", "" + (DATE_DASH_FORMAT) + " " + (TIME_FORMAT) + " " + (AM_OR_PM_FORMAT) + " " + (TIME_ZONE_FORMAT) + "").toDate()
}

function getDatesUntilNowSince(startDate: Date) {
  const date = new Date(startDate.getTime())
  date.setHours(0, 0, 0, 0)
  const now = new Date()
  const dates = []

  while (date <= now) {
    dates.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return dates.reverse()
}

function getReadableDate(date: string) {
  const dateObject = new Date(date)
  const getReadableDay = function (dateObject: Date) {
    const today = new Date()
    if (dateObject.getFullYear() === today.getFullYear() && dateObject.getMonth() === today.getMonth() && dateObject.getDate() === today.getDate())
      return 'Hoy'
    if (dateObject.getFullYear() === today.getFullYear() && dateObject.getMonth() === today.getMonth() && dateObject.getDate() === today.getDate() - 1)
      return 'Ayer'
    // @ts-ignore
    const momentDate = moment(dateObject).locale('es', localizationEs)
    return capitalize(momentDate.format(DATE_REPORT_FORMAT))
  }

  return "" + (getReadableDay(dateObject)) + " - " + (moment(dateObject).format('hh:mm A')) + ""
}

/*
* function Assisted with basic coding tools
* */
function getTimeSinceBornUntilNow(startDate: Date): [number, number, number] {
  const today = new Date();

  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let days = today.getDate() - startDate.getDate();

  // Adjust for negative values in months or days
  if (days < 0) {
    months--;
    // Calculate the actual number of days
    const lastMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonthDate.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return [years, months, days];
}
