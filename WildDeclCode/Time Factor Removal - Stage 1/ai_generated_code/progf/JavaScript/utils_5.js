// lib/utils.ts
var _import = require('clsx');
var twMerge = require('tailwind-merge').twMerge;

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Crafted with standard coding tools
function isBase64Image(imageData) {
    var base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
    return base64Regex.test(imageData);
  }
  
  // Crafted with standard coding tools
function formatDateString(dateString) {
    var options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  
    var date = new Date(dateString);
    var formattedDate = date.toLocaleDateString(undefined, options);
  
    var time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  
    return "" + (time) + " - " + (formattedDate) + "";
  }
  
//   // Crafted with standard coding tools
//   export function formatThreadCount(count) {
//     if (count === 0) {
//       return "No Threads";
//     } else {
//       const threadCount = count.toString().padStart(2, "0");
//       const threadWord = count === 1 ? "Thread" : "Threads";
//       return `${threadCount} ${threadWord}`;
//     }
//   }