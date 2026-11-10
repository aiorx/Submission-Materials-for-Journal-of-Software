var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function removeFirstLast(str: string) {
  return str.slice(1, -1);
}

// Crafted with standard coding tools
function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

function generateMeetingCode(): string {
  const code = Math.floor(100000000 + Math.random() * 900000000);
  return code.toString().trim();
}
