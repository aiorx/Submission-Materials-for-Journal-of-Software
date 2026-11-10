function formatActorName(name: string): string {
  const formattedName = capitalizeWords(name)
  const [lastName, firstName] = formattedName.split(',').map(function (part) { return part.trim(); })
  if (!firstName) return formattedName

  return "" + (firstName) + " " + (lastName) + ""
}

// Thanks ChatGPT for this code
// TODO: Check if there is a library that can do this more efficiently
function capitalizeWords(sentence: string): string {
  // This regular expression is divided into three parts:
  // 1. (^[^a-zA-Z]*): Matches any leading characters at the start of the word that are not letters (a-z, A-Z), capturing them to preserve any non-alphabetic symbols.
  // 2. ([a-zA-Z]): Captures the first alphabetic character in the word, allowing it to be transformed to uppercase.
  // 3. (.*): Captures the remainder of the word after the first alphabetic character, allowing it to be transformed to lowercase.
  // Together, this regex enables preserving any leading non-letter characters, capitalizing the first letter, and ensuring the rest of the word is in lowercase.
  const capitalizeRegex = /(^[^a-zA-Z]*)([a-zA-Z])(.*)/
  return sentence
    .split(' ')
    .map(function (word) { return word.replace(capitalizeRegex, (_, p1, p2, p3) => p1 + p2.toUpperCase() + p3.toLowerCase()); })
    .join(' ')
}
