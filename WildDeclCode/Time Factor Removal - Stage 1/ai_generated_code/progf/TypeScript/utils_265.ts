var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;

var qs = require('query-string');
var UrlQueryParams = require('@/types').UrlQueryParams;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// Crafted with standard coding tools
function formatThreadCount(count: number): string {
  if (count === 0) {
    return "No Threads";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return "" + (threadCount) + " " + (threadWord) + "";
  }
}

function handleError(err: unknown) {
  console.error(err);

  throw new Error(typeof err === "string" ? err : JSON.stringify(err));
}

function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

function removeKeysFromQuery(params: {
  params: string;
  keysToRemove: string[];
}) {
  return "";
}

function parseMongoToJson(resource: unknown) {
  return resource ? JSON.parse(JSON.stringify(resource)) : [];
}
