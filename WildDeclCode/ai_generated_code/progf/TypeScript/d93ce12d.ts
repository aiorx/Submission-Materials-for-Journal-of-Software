/**
 * This function determins if a number is prime.
 */
function isPrime(number: number): boolean {
  for (let i = 2, s = Math.sqrt(number); i <= s; i++)
    if (number % i === 0) return false
  return number > 1
}

// Written with routine coding tools-4-0125-preview
