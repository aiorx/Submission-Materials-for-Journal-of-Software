// Aided with basic GitHub coding tools
import * as vscode from "vscode";
import { WorkspaceTaskManager } from "./models/task-manager";
import { ITask, TaskStatus } from "./models/task";
import { TaskEditor } from "./views/task-editor";
import { TaskDocumentHelper } from "./task-document-helper";
import { TaskParser } from "./models/task-parser";
import { TaskTreeItem } from "./views/task-tree-item";

export class TaskCommands {
  private taskManager: WorkspaceTaskManager;

  constructor(taskManager: WorkspaceTaskManager) {
    this.taskManager = taskManager;
  }

  public registerCommands(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "vstasks.createTask",
        this.createTask.bind(this)
      ),
      vscode.commands.registerCommand(
        "vstasks.toggleTaskStatus",
        this.toggleTaskStatus.bind(this)
      ),
      vscode.commands.registerCommand(
        "vstasks.editTask",
        this.editTask.bind(this)
      ),
      vscode.commands.registerCommand(
        "vstasks.deleteTask",
        this.deleteTask.bind(this)
      ),
      vscode.commands.registerCommand(
        "vstasks.showAllTasks",
        this.showAllTasks.bind(this)
      ),
      vscode.commands.registerCommand(
        "vstasks.showTasksByTag",
        this.showTasksByTag.bind(this)
      ),
      vscode.commands.registerCommand(
        "vstasks.runCustomQuery",
        this.runCustomQuery.bind(this)
      )
    );
  }

  public async createTask(): Promise<void> {
    try {
      vscode.window.showInformationMessage("Creating new task...");
      // TODO: Implement task creation dialog
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to create task: ${err}`);
    }
  }

  public async toggleTaskStatus(taskOrId?: ITask | string): Promise<void> {
    // Aided with basic GitHub coding tools
    try {
      let task: ITask | undefined;
      // Handle TaskTreeItem from tree view context menu
      if (taskOrId instanceof TaskTreeItem && taskOrId.task) {
        task = taskOrId.task;
      } else if (
        typeof taskOrId === "object" &&
        taskOrId &&
        "task" in taskOrId &&
        (taskOrId as { task?: ITask }).task
      ) {
        // fallback for plain object (e.g. from tests or serialization)
        task = (taskOrId as { task?: ITask }).task;
      } else if (typeof taskOrId === "string") {
        task = this.taskManager.getAllTasks().find((t) => t.id === taskOrId);
      } else {
        task = taskOrId as ITask;
      }
      if (!task) {
        vscode.window.showErrorMessage("No task selected");
        return;
      }
      // 新しいステータスを決定
      const toggledStatus: TaskStatus =
        task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
      // descriptionからインライン表現を除去
      const pureDescription = TaskEditor.extractPureTitle(task.description);

      // Ensure pureDescription is a string before processing
      const processedDescription =
        typeof pureDescription === "string"
          ? pureDescription
          : task.description || "";

      // ✅ 完了日表現もdescriptionから除去
      const descriptionAfterRemoval = processedDescription
        .replace(/✅\s*\d{4}-\d{2}-\d{2}/g, "")
        .trim();

      // タグ抽出はpureDescriptionではなく元のdescriptionから行う
      const parser = new TaskParser();
      const priority = parser.extractPriority(descriptionAfterRemoval);
      // Extract tags from the original description to avoid losing them
      const tags = parser.extractTags(task.description);
      const { dueDate, scheduledDate } = parser.extractDates(
        descriptionAfterRemoval
      );
      const recurrence = parser.extractRecurrence(descriptionAfterRemoval);
      // 完了日: DONEのときのみ現在日付、それ以外はundefined
      const completedDate =
        toggledStatus === TaskStatus.DONE ? new Date() : undefined;
      const updatedTask: ITask = {
        ...task,
        status: toggledStatus,
        completedDate,
        description: descriptionAfterRemoval,
        priority,
        tags,
        dueDate,
        scheduledDate,
        recurrence,
      };
      // descriptionがクリーンな状態でrawTextを生成
      updatedTask.rawText = TaskParser.generateTaskLine(updatedTask);
      // Markdownファイルの該当行を置換
      const openEditor = vscode.window.visibleTextEditors.find(
        (ed) => ed.document.uri.fsPath === task.filePath
      );
      if (openEditor) {
        await TaskDocumentHelper.updateTaskInDocument(
          openEditor.document,
          task,
          updatedTask
        );
      } else {
        // ファイルが開かれていない場合は開いて編集
        const doc = await vscode.workspace.openTextDocument(task.filePath);
        await TaskDocumentHelper.updateTaskInDocument(doc, task, updatedTask);
      }
      // メモリ上のタスクも更新
      this.taskManager.updateTask(task.id, {
        status: toggledStatus,
        completedDate:
          toggledStatus === TaskStatus.DONE ? new Date() : undefined,
        rawText: updatedTask.rawText,
      });
      vscode.window.showInformationMessage("Task status toggled");
    } catch (err) {
      vscode.window.showErrorMessage(`Error toggling task status: ${err}`);
    }
  }

  public async editTask(task?: ITask): Promise<void> {
    try {
      if (!task) {
        vscode.window.showErrorMessage("No task selected");
        return;
      }
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "markdown") {
        vscode.window.showErrorMessage("No active markdown editor");
        return;
      }
      const updated = await TaskEditor.showEditDialog(task);
      if (!updated) {
        vscode.window.showInformationMessage("編集がキャンセルされました");
        return;
      }
      // rawText再生成
      updated.rawText = TaskParser.generateTaskLine(updated);
      await TaskDocumentHelper.updateTaskInDocument(
        editor.document,
        task,
        updated
      );
      vscode.window.showInformationMessage("タスクを編集しました");
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to edit task: ${err}`);
    }
  }

  public async deleteTask(task?: ITask): Promise<void> {
    try {
      if (!task) {
        vscode.window.showErrorMessage("No task selected");
        return;
      }
      // TODO: Implement task deletion
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to delete task: ${err}`);
    }
  }

  public async showAllTasks(): Promise<void> {
    try {
      // TODO: Implement show all tasks in a panel
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to show all tasks: ${err}`);
    }
  }

  public async showTasksByTag(): Promise<void> {
    try {
      // TODO: Implement show tasks by tag
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to show tasks by tag: ${err}`);
    }
  }

  public async runCustomQuery(): Promise<void> {
    try {
      // TODO: Implement custom query dialog
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to run custom query: ${err}`);
    }
  }
}
