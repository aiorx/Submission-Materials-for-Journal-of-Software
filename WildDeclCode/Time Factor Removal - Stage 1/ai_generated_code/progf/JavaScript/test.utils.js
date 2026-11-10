// Text Aided using common development resources by OPenAI
var originalText = "
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
";

var simpleReplaceText = "
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
";

var partialReplacedText = "
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
";

var multiLineReplacedText = "🧪at a small software development company, Emily was 
determined to ensure the reliability and stability of the node.js application 
she was working on. She spent a morning writing thorough unit tests for a new 
feature she had implemented, covering all possible scenarios and edge cases. 
As she ran each test and saw the code coverage increase, she felt a sense of 
accomplishment. With all of the tests passing, Emily pushed her changes to the 
development branch and opened a pull request for review. Her lead developer 
approved of the thorough testing, and the rest of the team offered their 
congratulations. Emily was grateful for the peace of mind that came with knowing 
her code was well-tested and reliable.
";

var caseSensitiveText = "
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
";

var caseInsensitiveText = "
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
";

var nonGlobalReplaceText = "
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
";

var regexReplaceText = "
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
";

var searchQuery = "Emily";
var partialQuery = "soft";
var multiLineSearchQuery = "\nAs a programmer ";
var caseSensitiveQuery = "With";
var regexQuery = "t.?st[a-z]*";
var fileNameComplete = "file1.txt";
var fileNamePartial = "file";
var fileNameCompleteCIS = "FILE1.txt";
var filenameRegex = "file[0-4].*";
var filenameRegexCS = "File[0-4].*";
var filenameRegexCIS = "FILE[0-4].*";

var replacementText = "🧪";

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
