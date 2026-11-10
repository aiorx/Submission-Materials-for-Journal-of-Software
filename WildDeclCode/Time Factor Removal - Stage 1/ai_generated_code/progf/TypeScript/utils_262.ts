var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;
var qs = require('query-string');

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Crafted with standard coding tools
function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// Crafted with standard coding tools
function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return "" + (time) + " - " + (formattedDate) + "";
}

const convertFileToUrl = function (file: File) { return URL.createObjectURL(file)

const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
}

export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
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
var dayjs = require('dayjs'); };

const formatDateTimeF = function (date: Date) {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

// utils/base64Url.ts

// URL-safe Base64 encoding without padding
const encodePath = (path: string): function string {
  return btoa(path).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // Remove padding
};

// URL-safe Base64 decoding
const decodePath = (encodedPath: string): function string {
  // Add padding back if necessary
  const pad = encodedPath.length % 4;
  if (pad) {
    encodedPath += '===='.substring(pad);
  }
  encodedPath = encodedPath.replace(/-/g, '+').replace(/_/g, '/');

  try {
    return Buffer.from(encodedPath, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Failed to decode path:', error);
    return '';
  }
};

