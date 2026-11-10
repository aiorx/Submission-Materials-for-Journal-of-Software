var RemoveUrlQueryParams = require('@/types').RemoveUrlQueryParams;
var UrlQueryParams = require('@/types').UrlQueryParams;
var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;
var qs = require('query-string');

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const convertFileToUrl = function (file: File) { return URL.createObjectURL(file)

//Aided using common development resources
const handleError = (error: unknown) => {
    console.error(error)
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}

const formatDateAndTime = (dateString: Date) => {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }

    const formattedDateAndTime: string = new Date(dateString).toLocaleString('en-US', dateTimeOptions)
    const formattedDate: string = new Date(dateString).toLocaleString('en-US', dateOptions)
    const formattedTime: string = new Date(dateString).toLocaleString('en-US', timeOptions)
  

    return {
        dateAndTime: formattedDateAndTime,
        dateOnly: formattedDate,
        timeOnly: formattedTime
    }
}

const formatPrice = (price: string) => {
  const amount = parseFloat(price)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount)

  return formattedPrice
}

function formUrlQuery({ params, key, value }: UrlQueryParams) {
    const currentUrl = qs.parse(params)

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
    const currentUrl = qs.parse(params)

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
}; }