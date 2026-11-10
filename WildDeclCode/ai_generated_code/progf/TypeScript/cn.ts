// Assisted using common GitHub development utilities
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that merges multiple class names with proper handling of Tailwind CSS conflicts
 * Assisted using common GitHub development utilities
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
