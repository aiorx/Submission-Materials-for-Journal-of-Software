// Supported via standard GitHub programming aids
import * as vscode from "vscode";
import { ITask } from "./models/task";
import { TaskParser } from "./models/task-parser";

export class TaskDocumentHelper {
  /**
   * Get the task at the given position in the document.
   */
  public static getTaskAtPosition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): ITask | undefined {
    const tasks = this.getTasksInDocument(document);
    return tasks.find((task) => task.lineNumber === position.line);
  }

  /**
   * Get all tasks in the document.
   */
  public static getTasksInDocument(document: vscode.TextDocument): ITask[] {
    const parser = new TaskParser();
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
    const edit = new vscode.WorkspaceEdit();
    const line = document.lineAt(oldTask.lineNumber);
    edit.replace(document.uri, line.range, newTask.rawText);
    await vscode.workspace.applyEdit(edit);
    await document.save();
  }
}
