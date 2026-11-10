var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const isBrowser = function () { return typeof window !== "undefined"

// Formed using common development resources
function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,/;
  return base64Regex.test(imageData);
}; }