// Supported via standard GitHub programming aids
var vscode = require('vscode');
var TaskDocumentHelper = require('./task-document-helper').TaskDocumentHelper;

class TaskCodeLensProvider implements vscode.CodeLensProvider {
  /**
   * Provide CodeLenses for all tasks in the document.
   */
  public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    var codeLenses: vscode.CodeLens[] = [];
    var tasks = TaskDocumentHelper.getTasksInDocument(document);
    for (var task of tasks) {
      var range = new vscode.Range(
        task.lineNumber,
        0,
        task.lineNumber,
        task.rawText.length
      );
      codeLenses.push(
        new vscode.CodeLens(range, {
          title: "Edit this task",
          command: "vstasks.editTask",
          arguments: [task],
        })
      );
    }
    return codeLenses;
  }

  /**
   * Optionally resolve a CodeLens (not used here).
   */
  public resolveCodeLens(codeLens: vscode.CodeLens): vscode.CodeLens {
    return codeLens;
  }
}
