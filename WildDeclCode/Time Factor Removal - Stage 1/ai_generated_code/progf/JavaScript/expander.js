// Penned via standard programming aids

var fs = require("fs");
var path = require("path");

var includedFiles = new Set();

function expandIncludes(filePath, currentDir = process.cwd()) {
  if (includedFiles.has(filePath)) return "";
  includedFiles.add(filePath);

  var fullPath = path.resolve(currentDir, filePath);
  var dir = path.dirname(fullPath);
  var content = fs.readFileSync(fullPath, "utf-8");
  var result = "#line 1 " + (JSON.stringify(fullPath)) + "\n";

  var includeRegex = /^[ \t]*#\s*include\s*"(.+)"/gm;
  var match;
  var lastIndex = 0;

  while ((match = includeRegex.exec(content)) !== null) {
    var [includeDirective, includePath] = match;
    var beforeInclude = content.slice(lastIndex, match.index);
    lastIndex = includeRegex.lastIndex;

    result += beforeInclude;
    result += "/* " + (includeDirective) + " */\n";
    result += expandIncludes(includePath, dir);
    result += "#line " + (getLineNumber(content, match.index)) + " " + (JSON.stringify(fullPath)) + "\n";
  }

  result += content.slice(lastIndex);

  // If the current file is a header file, check for corresponding source file
  if (isHeaderFile(filePath)) {
    var sourceFile = getSourceFilePath(filePath, dir);
    if (sourceFile && fs.existsSync(sourceFile)) {
      result += expandIncludes(path.relative(dir, sourceFile), dir);
    }
  }

  return result;
}

function isHeaderFile(filePath) {
  return /\.(h|hpp)$/i.test(filePath);
}

function getSourceFilePath(headerFilePath, dir) {
  var baseName = path.basename(headerFilePath, path.extname(headerFilePath));
  var possibleExtensions = [".c", ".cpp"]; // Add other extensions if needed
  for (var ext of possibleExtensions) {
    var sourceFilePath = path.resolve(dir, baseName + ext);
    if (fs.existsSync(sourceFilePath)) {
      return sourceFilePath;
    }
  }
  return null;
}

function getLineNumber(content, index) {
  return content.slice(0, index).split("\n").length;
}

if (process.argv.length < 3) {
  console.error("Usage: node expand_includes.js <source-file>");
  process.exit(1);
}

var sourceFile = process.argv[2];
var expandedSource = expandIncludes(sourceFile);
console.log(expandedSource);
