// Aided with basic GitHub coding tools
import * as vscode from "vscode";
import { TaskTreeItem } from "./task-tree-item";
import { WorkspaceTaskManager } from "../models/task-manager";

/**
 * Provider for the task tree view.
 */
export class TaskTreeDataProvider
  implements vscode.TreeDataProvider<TaskTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    TaskTreeItem | undefined | void
  > = new vscode.EventEmitter<TaskTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TaskTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;
  private taskManager: WorkspaceTaskManager;
  private groupBy: "file" | "status" | "tag" = "file";

  constructor(taskManager: WorkspaceTaskManager) {
    this.taskManager = taskManager;
    this.taskManager.onTasksChanged(() => this.refresh());
  }

  /**
   * Refresh the tree view.
   */
  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Set the grouping method.
   *
   * @param groupBy The grouping method
   */
  public setGroupBy(groupBy: "file" | "status" | "tag") {
    this.groupBy = groupBy;
    this.refresh();
  }

  /**
   * Get tree item for a given element.
   *
   * @param element The element
   * @returns The tree item
   */
  getTreeItem(element: TaskTreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Get children of a given element.
   *
   * @param element The parent element
   * @returns Array of child elements
   */
  getChildren(
    element?: TaskTreeItem
  ): TaskTreeItem[] | Thenable<TaskTreeItem[]> {
    if (!element) {
      // root: group by file/status/tag
      return this._getGroups();
    }
    if (element.type === "group" || element.type === "file") {
      return this._getTasksForGroup(
        element.groupName || element.label?.toString() || ""
      );
    }
    return [];
  }

  /**
   * Get group items based on the current grouping method.
   *
   * @returns Array of group items
   */
  private _getGroups(): TaskTreeItem[] {
    const tasks = this.taskManager.getAllTasks();
    let groups: string[] = [];
    switch (this.groupBy) {
      case "file":
        // Group by file
        groups = [...new Set(tasks.map((t) => t.filePath))];
        return groups.map((g) => new TaskTreeItem(undefined, "file", g));
      case "status":
        // Group by status
        groups = [...new Set(tasks.map((t) => t.status))];
        return groups.map((g) => new TaskTreeItem(undefined, "group", g));
      case "tag":
        // Group by tag
        groups = [...new Set(tasks.flatMap((t) => t.tags || []))];
        return groups.map((g) => new TaskTreeItem(undefined, "group", g));
      default:
        return [];
    }
  }

  /**
   * Get tasks for a specific group.
   *
   * @param group The group name
   * @returns Array of task items
   */
  private _getTasksForGroup(group: string): TaskTreeItem[] {
    const tasks = this.taskManager.getAllTasks();
    switch (this.groupBy) {
      case "file":
        return tasks
          .filter((t) => t.filePath === group)
          .map((t) => new TaskTreeItem(t, "task"));
      case "status":
        return tasks
          .filter((t) => t.status === group)
          .map((t) => new TaskTreeItem(t, "task"));
      case "tag":
        return tasks
          .filter((t) => (t.tags || []).includes(group))
          .map((t) => new TaskTreeItem(t, "task"));
      default:
        return [];
    }
  }
}
