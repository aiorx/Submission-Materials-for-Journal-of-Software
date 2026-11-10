/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */
var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var qs = require('qs');
var twMerge = require('tailwind-merge').twMerge;

var aspectRatioOptions = require('@/constants').aspectRatioOptions;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ERROR HANDLER
var handleError = function (error: unknown) {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error("Error: " + (error.message) + "");
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error("Error: " + (error) + "");
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error("Unknown error: " + (JSON.stringify(error)) + "");
  }
};

// PLACEHOLDER LOADER - while image is transforming
var shimmer = function (w: number, h: number) { return '
<svg width="' + (w) + '" height="' + (h) + '" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="' + (w) + '" height="' + (h) + '" fill="#7986AC" />
  <rect id="r" width="' + (w) + '" height="' + (h) + '" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-' + (w) + '" to="' + (w) + '" dur="1s" repeatCount="indefinite"  />
</svg>'; };

var toBase64 = function (str: string) { return typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str); };

var dataUrl = "data:image/svg+xml;base64," + (toBase64(
  shimmer(1000, 1000)
)) + "";
// ==== End

// FORM URL QUERY
var formUrlQuery = function ({
  searchParams,
  key,
  value,
}: FormUrlQueryParams) {
  var params = { ...qs.parse(searchParams.toString()), [key]: value };

  return "" + (window.location.pathname) + "?" + (qs.stringify(params, {
    skipNulls: true,
  })) + "";
};

// REMOVE KEY FROM QUERY
function removeKeysFromQuery({
  searchParams,
  keysToRemove,
}: RemoveUrlQueryParams) {
  var currentUrl = qs.parse(searchParams);

  keysToRemove.forEach(function (key) {
    delete currentUrl[key];
  });

  // Remove null or undefined values
  Object.keys(currentUrl).forEach(
    function (key) { return currentUrl[key] == null && delete currentUrl[key]; });

  return "" + (window.location.pathname) + "?" + (qs.stringify(currentUrl)) + "";
}

// DEBOUNCE, it waits for x second before calling the function
var debounce = function (func: (...args: any[]) => void, delay: number) {
  var timeoutId: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}s), delay);
  };
};

// GE IMAGE SIZE
export type AspectRatioKey = keyof typeof aspectRatioOptions;
var getImageSize = (
  type: string,
  image: any,
  dimension: "width" | "height"
): function number {
  if (type === "fill") {
    return (
      (aspectRatioOptions[image.aspectRatio as AspectRatioKey] == null ? undefined : aspectRatioOptions[image.aspectRatio as AspectRatioKey][dimension]) ||
      1000
    );
  }
  return (image == null ? undefined : image[dimension]) || 1000;
};

// DOWNLOAD IMAGE
var download = function (url: string, filename: string) {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      var blobURL = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = blobURL;

      if (filename && filename.length)
        a.download = "" + (filename.replace(" ", "_")) + ".png";
      document.body.appendChild(a);
      a.click();
    })
    .catch((error) => console.log({ error }));
};

// DEEP MERGE OBJECTS, a function Aided using common development resources where its essentially merges all of the keys of both of these objects to ensure that all of them end up in newly created object which we then set to transformation config
var deepMergeObjects = function (obj1: any, obj2: any) {
  if (obj2 === null || obj2 === undefined) {
    return obj1;
  }

  var output = { ...obj2 };

  for (var key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (
        obj1[key] &&
        typeof obj1[key] === "object" &&
        obj2[key] &&
        typeof obj2[key] === "object"
      ) {
        output[key] = deepMergeObjects(obj1[key], obj2[key]);
      } else {
        output[key] = obj1[key];
      }
    }
  }

  return output;
};
