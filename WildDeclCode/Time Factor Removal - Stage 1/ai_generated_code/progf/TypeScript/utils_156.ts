var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Designed via basic programming aids
const isBase64Image = function (imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/
  return base64Regex.test(imageData)
}

// Designed via basic programming aids
const formatDateString = function (dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/SaiGon',
  }

  const date = new Date(dateString)
  const formattedDate = date.toLocaleDateString([
    'vi-VN',
    'en-US',
  ], options)

  const time = date.toLocaleTimeString([
    'vi-VN',
    'en-US',
  ], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/SaiGon',
  })

  return "" + (time) + " - " + (formattedDate) + ""
}

// Designed via basic programming aids
const formatThreadCount = function (count: number) {
  if (count === 0) {
    return 'No Threads'
  } else {
    const threadCount = count.toString().padStart(2, '0')
    const threadWord = count === 1 ? 'Thread' : 'Threads'
    return "" + (threadCount) + " " + (threadWord) + ""
  }
}
