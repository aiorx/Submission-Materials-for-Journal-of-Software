var ts = require('typescript');
var groupBy = require('lodash').groupBy;
var partition = require('lodash').partition;
var readFileSync = require('fs').readFileSync;
var getDiagnostics = require('./tsCompilerHelpers').getDiagnostics;
var getFilePath = require('./tsCompilerHelpers').getFilePath;
var ERROR_COMMENT = require('./ignoreFileErrorsRunner').ERROR_COMMENT;
var FilePaths = require('./cli').FilePaths;

const errorFiles: string[] = [];
const errorsToShow: ts.Diagnostic[] = [];
const filesWithTooManyIgnoredErrors: {
  actualErrorCount: number;
  countToIgnore: number;
  filePath: string;
}[] = [];
let skippedErrorCount = 0;

module.exports = async function run(paths: FilePaths): Promise<void> {;
  const diagnostics = await getDiagnostics(paths);
  const [diagnosticsWithFile, diagnosticsWithoutFile] = partition(
    diagnostics,
    function d { return !!d.file; });
  errorsToShow.push(...diagnosticsWithoutFile);

  const diagnosticsGroupedByFile = groupBy(
    diagnosticsWithFile,
    function d { return d.file!.fileName; });

  Object.keys(diagnosticsGroupedByFile).forEach(async function fileName {
    const fileDiagnostics = diagnosticsGroupedByFile[fileName];
    const actualErrorCount = fileDiagnostics.length;
    try {
      const filePath = getFilePath(paths, fileDiagnostics[0]);

      let codeSplitByLine = readFileSync(filePath, "utf8").split("\n");
      const firstLine = codeSplitByLine[0];
      const firstLineIsIgnore = firstLine.startsWith(ERROR_COMMENT);
      if (firstLineIsIgnore) {
        const countToIgnore = parseInt(
          firstLine.replace(ERROR_COMMENT, ""),
          10
        );
        if (countToIgnore > actualErrorCount) {
          filesWithTooManyIgnoredErrors.push({
            actualErrorCount,
            countToIgnore,
            filePath
          });
        } else if (countToIgnore !== actualErrorCount) {
          errorsToShow.push(...fileDiagnostics);
        } else {
          skippedErrorCount += countToIgnore;
        }
      } else {
        errorsToShow.push(...fileDiagnostics);
      }
    } catch (e) {
      console.log(e);
      errorFiles.push(fileName);
    }
  });

  // Something went wrong
  if (errorFiles.length) {
    console.log(
      "Error checking for ignored type errors in " + (errorFiles.length) + " files:"
    );
    console.log(errorFiles);
    process.exit(1);
  } else {
    // There were type errors
    if (errorsToShow.length || filesWithTooManyIgnoredErrors.length) {
      if (errorsToShow.length) {
        const system = ts.sys;
        const host = {
          getCurrentDirectory: function () { return system.getCurrentDirectory(); },
          getNewLine: function () { return system.newLine; },
          getCanonicalFileName: function (f: string) { return f; }};
        console.log(
          ts.formatDiagnosticsWithColorAndContext(errorsToShow, host)
        );
        console.log("Found " + (errorsToShow.length) + " type error(s). ");
      }

      // There were issues with the # of ignored errors
      if (filesWithTooManyIgnoredErrors.length) {
        filesWithTooManyIgnoredErrors.forEach(function f {
          console.log(
            "Error: " + (f.filePath) + " has " + (
              f.actualErrorCount
            ) + " error(s), but is set to ignore " + (
              f.countToIgnore
            ) + " error(s). Please update the ignore count."
          );
        });
      }
      process.exit(1);
    } else {
      // Everything is great
      console.log("No (non-ignored) type errors");
      console.log("Skipping " + (skippedErrorCount) + " ignored errors");
      process.exit(0);
    }
  }
}
