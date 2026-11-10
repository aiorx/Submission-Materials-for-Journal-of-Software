// Supported via standard GitHub programming aids
import * as vscode from "vscode";
import * as path from "path";
import { ITask, TaskStatus } from "../models/task";

/**
 * Represents an item in the task tree view.
 */
export class TaskTreeItem extends vscode.TreeItem {
  constructor(
    public readonly task: ITask | undefined,
    public readonly type: "task" | "group" | "file",
    public readonly groupName?: string
  ) {
    super(
      type === "task" && task ? task.description : groupName || "Unknown",
      type === "task"
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Collapsed
    );

    if (type === "task" && task) {
      this.id = task.id;
      this.tooltip = this.generateTooltip(task);
      this.command = {
        command: "vscode.open",
        title: "Open File",
        arguments: [vscode.Uri.file(task.filePath)],
      };

      // Set icon based on task status
      this.iconPath = this.getIconForTask(task);

      // Set context value for right-click menu
      this.contextValue = `task-${task.status.toLowerCase()}`;

      // Add description showing due date if available
      if (task.dueDate) {
        const dueDate = task.dueDate.toLocaleDateString();
        this.description = `(Due: ${dueDate})`;
      }
    } else if (type === "file") {
      // File group
      this.iconPath = new vscode.ThemeIcon("file-text");
      this.contextValue = "file";
      this.tooltip = `File: ${groupName}`;

      // Extract filename from path
      if (groupName) {
        this.label = path.basename(groupName);
        this.description = path.dirname(groupName);
      }
    } else {
      // Other group types
      this.iconPath = new vscode.ThemeIcon("list-unordered");
      this.contextValue = "group";
      this.tooltip = `Group: ${groupName}`;
    }
  }

  /**
   * Generate a tooltip for a task.
   *
   * @param task The task
   * @returns The tooltip text
   */
  private generateTooltip(task: ITask): string {
    let tooltip = `Task: ${task.description}\n`;
    tooltip += `Status: ${task.status}\n`;
    tooltip += `File: ${task.filePath} (line ${task.lineNumber + 1})\n`;

    if (task.dueDate) {
      tooltip += `Due: ${task.dueDate.toLocaleDateString()}\n`;
    }

    if (task.scheduledDate) {
      tooltip += `Scheduled: ${task.scheduledDate.toLocaleDateString()}\n`;
    }

    if (task.completedDate) {
      tooltip += `Completed: ${task.completedDate.toLocaleDateString()}\n`;
    }

    if (task.priority !== undefined) {
      tooltip += `Priority: ${task.priority}\n`;
    }

    if (task.tags && task.tags.length > 0) {
      tooltip += `Tags: ${task.tags.join(", ")}\n`;
    }

    return tooltip;
  }

  /**
   * Get the icon for a task based on its status.
   *
   * @param task The task
   * @returns The icon
   */
  private getIconForTask(task: ITask): vscode.ThemeIcon {
    switch (task.status) {
      case TaskStatus.DONE:
        return new vscode.ThemeIcon("check");
      case TaskStatus.TODO:
        return new vscode.ThemeIcon("circle-outline");
      case TaskStatus.IN_PROGRESS:
        return new vscode.ThemeIcon("play-circle");
      case TaskStatus.CANCELLED:
        return new vscode.ThemeIcon("circle-slash");
      default:
        return new vscode.ThemeIcon("question");
    }
  }
}
