// Supported via standard GitHub programming aids
var vscode = require('vscode');
var ITask = require('./models/task').ITask;
var TaskParser = require('./models/task-parser').TaskParser;

class TaskDocumentHelper {
  /**
   * Get the task at the given position in the document.
   */
  public static getTaskAtPosition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): ITask | undefined {
    var tasks = this.getTasksInDocument(document);
    return tasks.find(function (task) { return task.lineNumber === position.line; });
  }

  /**
   * Get all tasks in the document.
   */
  public static getTasksInDocument(document: vscode.TextDocument): ITask[] {
    var parser = new TaskParser();
    return parser.parseMarkdownContent(document.getText(), document.uri.fsPath);
  }

  /**
   * Update a task in the document by replacing the old task line with the new one.
   */
  public static async updateTaskInDocument(
    document: vscode.TextDocument,
    oldTask: ITask,
    newTask: ITask
  ): Promise<void> {
    var edit = new vscode.WorkspaceEdit();
    var line = document.lineAt(oldTask.lineNumber);
    edit.replace(document.uri, line.range, newTask.rawText);
    await vscode.workspace.applyEdit(edit);
    await document.save();
  }
}
