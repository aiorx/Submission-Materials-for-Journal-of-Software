var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var format = require('date-fns').format;
var formatDistanceToNow = require('date-fns').formatDistanceToNow;
var isToday = require('date-fns').isToday;
var enUS = require('date-fns/locale').enUS;
var vi = require('date-fns/locale').vi;
var twMerge = require('tailwind-merge').twMerge;
var Locale = require('./definitions').Locale;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return "" + (time) + " - " + (formattedDate) + "";
}

// Formed using common development resources
function formatThreadCount(count: number): string {
  if (count === 0) {
    return 'No Threads';
  } else {
    const threadCount = count.toString().padStart(2, '0');
    const threadWord = count === 1 ? 'Thread' : 'Threads';
    return "" + (threadCount) + " " + (threadWord) + "";
  }
}

const translateConstant = function (t: any, message: string | undefined) {
  if (!message?.startsWith('T_')) {
    return message;
  } else {
    return t(message);
  }
};

function getFullName(
  firstName?: string | null,
  lastName?: string | null,
) {
  return [firstName, lastName].filter(Boolean).join(' ');
}

const checkUndefined = (data: any): function boolean {
  return data === 'undefined' || data.length === 0;
};

function isFutureDate(date: string): boolean {
  // Date is in ISO 8601 format
  const currentDate = new Date();
  const inputDate = new Date(date);

  return inputDate > currentDate;
}

const calculateTime = function (datetime: string, locale?: Locale) {
  const date = new Date(datetime);
  const localeString = locale || 'en';

  if (isToday(date)) {
    const localeObj = localeString === 'vi' ? vi : enUS;

    return formatDistanceToNow(date, { addSuffix: true, locale: localeObj });
  }

  return format(date, 'HH:mm dd/LL');
};

const getRelativeUnixDays = function (
  startUnixTime?: number,
  endUnixTime?: number,
) {
  if (!startUnixTime || !endUnixTime) {
    return 0;
  }

  const timeDiff = endUnixTime - startUnixTime;

  return Math.floor(timeDiff / (1000 * 3600 * 24));
};
