// Aided with basic GitHub coding tools
import * as vscode from "vscode";
import { WorkspaceTaskManager } from "./models/task-manager";

export class QuickActions {
  private taskManager: WorkspaceTaskManager;

  constructor(taskManager: WorkspaceTaskManager) {
    this.taskManager = taskManager;
  }

  public registerCommands(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "vstasks.showQuickActionPicker",
        this.showQuickActionPicker.bind(this)
      ),
      vscode.commands.registerCommand(
        "vstasks.showTaskAtCursor",
        this.showTaskAtCursor.bind(this)
      ),
      vscode.commands.registerCommand(
        "vstasks.insertTaskAtCursor",
        this.insertTaskAtCursor.bind(this)
      ),
      vscode.commands.registerCommand(
        "vstasks.toggleTaskAtCursor",
        this.toggleTaskAtCursor.bind(this)
      )
    );
  }

  public async showQuickActionPicker(): Promise<void> {
    try {
      // TODO: Implement quick action picker
    } catch (err) {
      vscode.window.showErrorMessage(
        `Failed to show quick action picker: ${err}`
      );
    }
  }

  public async showTaskAtCursor(): Promise<void> {
    try {
      // TODO: Implement show task at cursor
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to show task at cursor: ${err}`);
    }
  }

  public async insertTaskAtCursor(): Promise<void> {
    try {
      // TODO: Implement insert task at cursor
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to insert task at cursor: ${err}`);
    }
  }

  public async toggleTaskAtCursor(): Promise<void> {
    try {
      // TODO: Implement toggle task at cursor
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to toggle task at cursor: ${err}`);
    }
  }
}
