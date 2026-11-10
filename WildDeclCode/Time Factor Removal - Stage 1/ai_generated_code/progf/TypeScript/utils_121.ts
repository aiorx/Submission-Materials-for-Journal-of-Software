var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;
var qs = require('query-string');

var crypto = require('crypto');
var QuizParticipation = require('@prisma/client').QuizParticipation;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Formed using common development resources
function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

const formatDate = function (dateString: string | number | Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const generateSlug = function (title: string) {

  const trimmedTitle = title.trim().toLowerCase();
  const slug = trimmedTitle.replace(/\s+/g, '-');

  return slug;

}


const slugify = (...args: (string | number)[]): function string {
  const value = args.join(' ')

  return value
      .normalize('NFD') // split an accented letter in the base letter and the acent
      .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
      .replace(/\s+/g, '-') // separator
}



interface UrlQueryParams {
  params: string;
  key?: string;
  value?: string | null;
  keysToRemove?: string[];
}

function formUrlQuery({ params, key, value, keysToRemove }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  if (keysToRemove) {
    keysToRemove.forEach(function (keyToRemove) {
      delete currentUrl[keyToRemove];
    });
  } else if (key && value) {
    currentUrl[key] = value;
  }

  console.log(currentUrl, key, value);

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true }
  );
}


const formatPrice = function (price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR"
  }).format(price)
}


function generateUniqueCode(userId:any) {
  const randomPart = crypto.randomBytes(4).toString('hex'); // Generate a random 8-character hexadecimal string
  return "" + (userId) + "-" + (randomPart) + "";
}

function generateUniqueCodeForQuiz() {
  const randomPart = crypto.randomBytes(4).toString('hex'); // Generate a random 8-character hexadecimal string
  return "" + (randomPart) + "";

}


function removePunctuationAndNormalize(text:string | null) {
 const result =  text && text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().trim();
  return result;
};


// Function to calculate the rank of the user by using their score and total time taken.
const calculateRank = (quizParticipations: QuizParticipation[]): QuizParticipation[] => {
  // Clone the array to avoid modifying the original
  const quizParticipationsCopy = [...quizParticipations];

  const sortedParticipationRank: QuizParticipation[] = [];

  while (quizParticipationsCopy.length > 0) {
    let max: number | null = 0;
    let maxIndex = 0;

    for (let i = 0; i < quizParticipationsCopy.length; i++) {
      if (quizParticipationsCopy[i].score! > max!) {
        maxIndex = i;
        max = quizParticipationsCopy[i].score;
      } else if (quizParticipationsCopy[i].score === max) {
        // If scores are equal, prioritize the user with less time taken
        if (
          quizParticipationsCopy[i].totalTimeTaken! < quizParticipationsCopy[maxIndex].totalTimeTaken!
        ) {
          maxIndex = i;
        }
      }
    }

    // Assign rank to the participant based on the index
    sortedParticipationRank.push({ ...quizParticipationsCopy[maxIndex], rank: sortedParticipationRank.length + 1 });
    quizParticipationsCopy.splice(maxIndex, 1);
  }

  return sortedParticipationRank;
};

