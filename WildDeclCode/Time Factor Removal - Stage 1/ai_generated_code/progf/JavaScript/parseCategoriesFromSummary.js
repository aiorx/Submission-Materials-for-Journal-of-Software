// This module was Aided using standard development resources

module.exports = function parseCategoriesFromSummary(summarizedOutput = '') {;
  var categoriesRegex = /Categories:\s*\[([^\]]+)\]/;
  var match = summarizedOutput.match(categoriesRegex);

  var categories = [];
  var summary = summarizedOutput;

  if (match && match[1]) {
    categories = match[1].split(',').map(function category { return category.trim(); });
    summary = summarizedOutput.replace(categoriesRegex, '').trim();
  }

  return { summary, categories };
}