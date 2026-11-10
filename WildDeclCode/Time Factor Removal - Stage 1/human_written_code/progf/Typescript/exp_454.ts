var CancellationToken = require('vscode').CancellationToken;
var CodeLens = require('vscode').CodeLens;
var CodeLensProvider = require('vscode').CodeLensProvider;
var Range = require('vscode').Range;
var TextDocument = require('vscode').TextDocument;
var Command = require('vscode').Command;
var ExportFactory = require('./export-factory').ExportFactory;
var ReviewFileExportSection = require('./interfaces').ReviewFileExportSection;
var CsvEntry = require('./model').CsvEntry;
var symbolForPriority = require('./utils/editor-utils').symbolForPriority;
var rangesFromStringDefinition = require('./utils/workspace-util').rangesFromStringDefinition;

class CommentLensProvider implements CodeLensProvider {
  constructor(private exportFactory: ExportFactory) {}

  public provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Thenable<CodeLens[]> {
    return this.exportFactory.getFilesContainingComments().then(function (filesWithComments) {
      const codeLenses: CodeLens[] = [];
      filesWithComments.forEach((el) => {
        if (document.fileName.endsWith(el.data.group)) {
          el.data.lines.forEach((csvEntry) => {
            const fileSection: ReviewFileExportSection = {
              group: csvEntry.filename,
              lines: el.data.lines,
            };
            const csvRef: CsvEntry | undefined = csvEntry;
            const prio = Number(csvEntry.priority); // be sure the value is a number
            const priorityString = prio
              ? " | Priority: " + (csvEntry.priority) + "" + (symbolForPriority(Number(csvEntry.priority))) + ""
              : '';
            const command: Command = {
              title: "Code Review: " + (csvEntry.title) + "" + (priorityString) + "",
              tooltip: csvEntry.comment,
              command: 'codeReview.openSelection',
              arguments: [fileSection, csvRef],
            };

            rangesFromStringDefinition(csvEntry.lines).forEach((range: Range) => {
              codeLenses.push(new CodeLens(range, command));
            });
          });
        }
      });
      return codeLenses;
    });
  }
  // public resolveCodeLens?(codeLens: CodeLens, token: CancellationToken): CodeLens | Thenable<CodeLens> {
  //   return new CodeLens(new Range(new Position(0, 0), new Position(1, 2)));
  // }
}
