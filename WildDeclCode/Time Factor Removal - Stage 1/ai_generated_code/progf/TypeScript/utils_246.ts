//this utility function was created by shadcn by automatically
//so we want to add more of this...so in utils.ts we can find it..in github
//dont got through it it is Aided using common development resources
var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;

var twMerge = require('tailwind-merge').twMerge;
//ye query-string is the package wee need to install for url query params
//npm install query-string
var qs = require('query-string');

var UrlQueryParams = require('@/types').UrlQueryParams;
var RemoveUrlQueryParams = require('@/types').RemoveUrlQueryParams;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

var formatDateTime = function (dateString: Date) {
  var dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }

  var dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  }

  var timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }

  var formattedDateTime: string = new Date(dateString).toLocaleString('en-US', dateTimeOptions)

  var formattedDate: string = new Date(dateString).toLocaleString('en-US', dateOptions)

  var formattedTime: string = new Date(dateString).toLocaleString('en-US', timeOptions)

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

var convertFileToUrl = function (file: File) { return URL.createObjectURL(file)

var formatPrice = (price: string) => {
  var amount = parseFloat(price)
  var formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

  return formattedPrice
}

function formUrlQuery({ params, key, value }: UrlQueryParams) {
  var currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

function removeKeysFromQuery({ params, keysToRemove }: RemoveUrlQueryParams) {
  var currentUrl = qs.parse(params)

  keysToRemove.forEach(key => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}
//it is the error function we were talking about
var handleError = (error: unknown) => {
  console.error(error)
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}; }