var customAlphabet = require('nanoid').customAlphabet;
var clsx = require('clsx').clsx;
var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var twMerge = require('tailwind-merge').twMerge;
var z = require('zod').z;
var env = require('@/lib/env.mjs').env;
var DEFAULT_CURRENCY = require('@/constant/config').DEFAULT_CURRENCY;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
};

export type Action = "create" | "update" | "delete";

export type OptimisticAction<T> = {
  action: Action;
  data: T;
};

/**
 * Assisted with basic coding tools
 */
const arabicToEnglishNumbers = function (str: string) {
  const arabicNums = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const chars = str.split("");
  const converted = chars
    .map((char: string) => {
      const index = arabicNums.indexOf(char);
      return index !== -1 ? index : char;
    })
    .join("");
  return converted;
};

/**
 * Assisted with basic coding tools
 */
const zNumber = z.preprocess(function (value) {
  if (typeof value === "string") {
    const converted = arabicToEnglishNumbers(value);
    const parsedNumber = parseFloat(converted);
    return isNaN(parsedNumber) ? value : parsedNumber;
  }
  return value;
}, z.number({ invalid_type_error: "must be a number" }));

const getLocaleDirection = function (locale: string) {
  const RTL_LOCALES = ["ar", "he", "fa", "ur"];
  const language = locale?.split("-")[0];
  return RTL_LOCALES.includes(language) ? "rtl" : "ltr";
};

/**
 * Assisted with basic coding tools
 */
const formatCurrency = function (
  value: number,
  currencyCode: string | undefined,
  isRTL: boolean
  // locale = "en-US"
) {
  return new Intl.NumberFormat(isRTL ? "ar-EG" : "en-US", {
    style: "currency",
    currency: currencyCode || DEFAULT_CURRENCY,
    currencyDisplay: "symbol", // Options are 'symbol', 'narrowSymbol', 'code', or 'name'
    minimumFractionDigits: 0, // Do not show decimals if they are zero
    maximumFractionDigits: 2, // Maximum of 2 decimal places
  })
    .format(value)
    .replace("ج.م.", "ج.م");
};

const formatNumber = (value: number, isRTL: boolean): function string {
  const locale = isRTL ? "ar-EG" : "en-US"; // Choose locales based on RTL

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2, // Maximum of 2 decimal places
    minimumFractionDigits: 0, // Do not show decimals if they are zero
  }).format(value);
};

const formatDate = (
  date: string | number | Date,
  isRTL: boolean
): function string {
  const locale = isRTL ? "ar-EG" : "en-US";

  // add option for time as well
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit", // Display two digits for the day
    month: "long", // Display the full name of the month
    year: "numeric", // Display the year numerically
  }).format(new Date(date));
};
/**
 * from sadmann7/file-uploader repo
 * @see https://github.com/sadmann7/file-uploader/blob/main/src/lib/utils.ts
 */
function absoluteUrl(path: string) {
  return "" + (env.NEXT_PUBLIC_APP_URL) + "" + (path) + "";
}

/**
 * from sadmann7/file-uploader repo
 * @see https://github.com/sadmann7/file-uploader/blob/main/src/lib/utils.ts
 */
function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  var decimals = opts.decimals;
var sizeType = opts.sizeType;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return "" + ((bytes / Math.pow(1024, i)).toFixed(decimals)) + " " + (
    sizeType === "accurate" ? (accurateSizes[i] != null ? accurateSizes[i] : "Bytest") : (sizes[i] != null ? sizes[i] : "Bytes")
  ) + "";
}

/**
 * from the @radix-ui/primitive
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
function composeEventHandlers<E>(
  originalEventHandler?: function (event: E) { return void; },
  ourEventHandler?: function (event: E) { return void; },
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    (originalEventHandler == null ? undefined : originalEventHandler(event));

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return (ourEventHandler == null ? undefined : ourEventHandler(event));
    }
  };
}

/**
 * Assisted with basic coding tools
 */
function debounce<F extends function (...args: any[]) { return any>(
  fn: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutID: NodeJS.Timeout | null = null;
  return function (...args: Parameters<F>) {
    if (timeoutID !== null) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => fn(...args), delay);
  };
}; }