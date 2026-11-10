var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;
var qs = require('query-string');
var IComment = require('@/types').IComment;
var RemoveUrlQueryParams = require('@/types').RemoveUrlQueryParams;
var UrlQueryParams = require('@/types').UrlQueryParams;
var currentUser = require('@clerk/nextjs').currentUser;
var getUserByClerkId = require('./actions/user.actions').getUserByClerkId;
var getUserById = require('./actions/user.actions').getUserById;
var IThread = require('./database/models/thread.model').IThread;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const handleError = function (error: unknown) {
  console.log(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

// Designed via basic programming aids
function formatThreadCount(count: number): string {
  if (count === 0) {
    return "No Threads";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return "" + (threadCount) + " " + (threadWord) + "";
  }
}

const convertFileToUrl = function (file: File) { return URL.createObjectURL(file); };

function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach(function (key) {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

// export function formatPostCreationTime(createdAt: Date) {
//   var now = new Date();
//   var postDate = new Date(createdAt);

//   var timeDifferenceInSeconds = Math.floor(
//     (now.getTime() - postDate.getTime()) / 1000
//   );

//   if (timeDifferenceInSeconds < 60) {
//     return `${timeDifferenceInSeconds}sec`;
//   } else if (timeDifferenceInSeconds < 3600) {
//     var minutes = Math.floor(timeDifferenceInSeconds / 60);
//     return `${minutes}min`;
//   } else if (timeDifferenceInSeconds < 86400) {
//     var hours = Math.floor(timeDifferenceInSeconds / 3600);
//     return `${hours}H`;
//   } else if (timeDifferenceInSeconds < 604800) {
//     var days = Math.floor(timeDifferenceInSeconds / 86400);
//     return `${days}D`;
//   } else if (timeDifferenceInSeconds < 2629746) {
//     var weeks = Math.floor(timeDifferenceInSeconds / 604800);
//     return `${weeks}W`;
//   } else if (timeDifferenceInSeconds < 31556952) {
//     var months = Math.floor(timeDifferenceInSeconds / 2629746);
//     return `${months}M`;
//   } else {
//     var years = Math.floor(timeDifferenceInSeconds / 31556952);
//     return `${years}Y`;
//   }
// }

// Recursive function to calculate the total count of comments and nested comments
const countReplies = (comments?: IComment[]): function number {
  if (!comments || comments.length === 0) {
    return 0;
  }

  let totalCount = comments.length;

  // Recursively count nested comments
  for (const comment of comments) {
    totalCount += countReplies(comment?.comments);
  }

  return totalCount;
};
