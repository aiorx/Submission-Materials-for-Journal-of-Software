// Supported via standard GitHub programming aids
import * as vscode from "vscode";
import { TaskDocumentHelper } from "./task-document-helper";

export class TaskCodeLensProvider implements vscode.CodeLensProvider {
  /**
   * Provide CodeLenses for all tasks in the document.
   */
  public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    const tasks = TaskDocumentHelper.getTasksInDocument(document);
    for (const task of tasks) {
      const range = new vscode.Range(
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
