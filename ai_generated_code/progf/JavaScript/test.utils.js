// Text Aided using common development resources by OPenAI
const originalText = `
As a programmer at a small software development company, Emily was 
determined to ensure the reliability and stability of the node.js application 
she was working on. She spent a morning writing thorough unit tests for a new 
feature she had implemented, covering all possible scenarios and edge cases. 
As she ran each test and saw the code coverage increase, she felt a sense of 
accomplishment. With all of the tests passing, Emily pushed her changes to the 
development branch and opened a pull request for review. Her lead developer 
approved of the thorough testing, and the rest of the team offered their 
congratulations. Emily was grateful for the peace of mind that came with knowing 
her code was well-tested and reliable.
`;

const simpleReplaceText = `
As a programmer at a small software development company, 🧪 was 
determined to ensure the reliability and stability of the node.js application 
she was working on. She spent a morning writing thorough unit tests for a new 
feature she had implemented, covering all possible scenarios and edge cases. 
As she ran each test and saw the code coverage increase, she felt a sense of 
accomplishment. With all of the tests passing, 🧪 pushed her changes to the 
development branch and opened a pull request for review. Her lead developer 
approved of the thorough testing, and the rest of the team offered their 
congratulations. 🧪 was grateful for the peace of mind that came with knowing 
her code was well-tested and reliable.
`;

const partialReplacedText = `
As a programmer at a small 🧪ware development company, Emily was 
determined to ensure the reliability and stability of the node.js application 
she was working on. She spent a morning writing thorough unit tests for a new 
feature she had implemented, covering all possible scenarios and edge cases. 
As she ran each test and saw the code coverage increase, she felt a sense of 
accomplishment. With all of the tests passing, Emily pushed her changes to the 
development branch and opened a pull request for review. Her lead developer 
approved of the thorough testing, and the rest of the team offered their 
congratulations. Emily was grateful for the peace of mind that came with knowing 
her code was well-tested and reliable.
`;

const multiLineReplacedText = `🧪at a small software development company, Emily was 
determined to ensure the reliability and stability of the node.js application 
she was working on. She spent a morning writing thorough unit tests for a new 
feature she had implemented, covering all possible scenarios and edge cases. 
As she ran each test and saw the code coverage increase, she felt a sense of 
accomplishment. With all of the tests passing, Emily pushed her changes to the 
development branch and opened a pull request for review. Her lead developer 
approved of the thorough testing, and the rest of the team offered their 
congratulations. Emily was grateful for the peace of mind that came with knowing 
her code was well-tested and reliable.
`;

const caseSensitiveText = `
As a programmer at a small software development company, Emily was 
determined to ensure the reliability and stability of the node.js application 
she was working on. She spent a morning writing thorough unit tests for a new 
feature she had implemented, covering all possible scenarios and edge cases. 
As she ran each test and saw the code coverage increase, she felt a sense of 
accomplishment. 🧪 all of the tests passing, Emily pushed her changes to the 
development branch and opened a pull request for review. Her lead developer 
approved of the thorough testing, and the rest of the team offered their 
congratulations. Emily was grateful for the peace of mind that came with knowing 
her code was well-tested and reliable.
`;

const caseInsensitiveText = `
As a programmer at a small software development company, Emily was 
determined to ensure the reliability and stability of the node.js application 
she was working on. She spent a morning writing thorough unit tests for a new 
feature she had implemented, covering all possible scenarios and edge cases. 
As she ran each test and saw the code coverage increase, she felt a sense of 
accomplishment. 🧪 all of the tests passing, Emily pushed her changes to the 
development branch and opened a pull request for review. Her lead developer 
approved of the thorough testing, and the rest of the team offered their 
congratulations. Emily was grateful for the peace of mind that came 🧪 knowing 
her code was well-tested and reliable.
`;

const nonGlobalReplaceText = `
As a programmer at a small software development company, 🧪 was 
determined to ensure the reliability and stability of the node.js application 
she was working on. She spent a morning writing thorough unit tests for a new 
feature she had implemented, covering all possible scenarios and edge cases. 
As she ran each test and saw the code coverage increase, she felt a sense of 
accomplishment. With all of the tests passing, Emily pushed her changes to the 
development branch and opened a pull request for review. Her lead developer 
approved of the thorough testing, and the rest of the team offered their 
congratulations. Emily was grateful for the peace of mind that came with knowing 
her code was well-tested and reliable.
`;

const regexReplaceText = `
As a programmer at a small software development company, Emily was 
determined to ensure the reliability and stability of the node.js application 
she was working on. She spent a morning writing thorough unit 🧪 for a new 
feature she had implemented, covering all possible scenarios and edge cases. 
As she ran each 🧪 and saw the code coverage increase, she felt a sense of 
accomplishment. With all of the 🧪 passing, Emily pushed her changes to the 
development branch and opened a pull request for review. Her lead developer 
approved of the thorough 🧪, and the rest of the team offered their 
congratulations. Emily was grateful for the peace of mind that came with knowing 
her code was well-🧪 and reliable.
`;

const searchQuery = "Emily";
const partialQuery = "soft";
const multiLineSearchQuery = "\nAs a programmer ";
const caseSensitiveQuery = "With";
const regexQuery = "t.?st[a-z]*";
const fileNameComplete = "file1.txt";
const fileNamePartial = "file";
const fileNameCompleteCIS = "FILE1.txt";
const filenameRegex = "file[0-4].*";
const filenameRegexCS = "File[0-4].*";
const filenameRegexCIS = "FILE[0-4].*";

const replacementText = "🧪";

module.exports = {
  // test
  originalText,
  simpleReplaceText,
  partialReplacedText,
  multiLineReplacedText,
  caseSensitiveText,
  caseInsensitiveText,
  nonGlobalReplaceText,
  regexReplaceText,
  // query
  searchQuery,
  partialQuery,
  multiLineSearchQuery,
  caseSensitiveQuery,
  regexQuery,
  // replacement
  replacementText,
  // file name
  fileNameComplete,
  fileNamePartial,
  fileNameCompleteCIS,
  filenameRegex,
  filenameRegexCS,
  filenameRegexCIS,
};
