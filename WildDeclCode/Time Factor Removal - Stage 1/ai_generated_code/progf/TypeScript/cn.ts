// Assisted using common GitHub development utilities
var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;

/**
 * A utility function that merges multiple class names with proper handling of Tailwind CSS conflicts
 * Assisted using common GitHub development utilities
 */
function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
