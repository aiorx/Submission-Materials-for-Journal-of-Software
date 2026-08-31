// Aided with basic GitHub coding tools
import * as vscode from "vscode";
import { ITask, TaskStatus } from "./task";
import { TaskParser } from "./task-parser";
import * as fs from "fs";
import { promisify } from "util";
import { TaskIndex } from "./task-index";

const readFile = promisify(fs.readFile);

/**
 * Class responsible for managing tasks across the workspace.
 */
export class TaskManager {
  /**
   * Map of file paths to arrays of tasks in those files.
   */
  private tasks: Map<string, ITask[]> = new Map();

  /**
   * Event emitter for when tasks change.
   */
  private _onDidTasksChange = new vscode.EventEmitter<{
    added?: ITask[];
    removed?: ITask[];
    updated?: ITask[];
  }>();

  /**
   * Event that fires when tasks change.
   */
  public readonly onDidTasksChange = this._onDidTasksChange.event;

  /**
   * Task parser instance.
   */
  private parser: TaskParser;

  /**
   * Constructor.
   */
  constructor() {
    this.parser = new TaskParser();
  }

  /**
   * Add tasks for a file.
   *
   * @param filePath Path to the file
   * @param tasks Array of tasks to add
   */
  public addTasks(filePath: string, tasks: ITask[]): void {
    this.tasks.set(filePath, tasks);
    this._onDidTasksChange.fire({ added: tasks });
  }

  /**
   * Remove all tasks for a file.
   *
   * @param filePath Path to the file
   */
  public removeTasks(filePath: string): void {
    const tasksToRemove = this.tasks.get(filePath) || [];
    this.tasks.delete(filePath);

    if (tasksToRemove.length > 0) {
      this._onDidTasksChange.fire({ removed: tasksToRemove });
    }
  }

  /**
   * Update a task.
   *
   * @param taskId ID of the task to update
   * @param updates Partial task object with updates
   * @returns true if the task was updated, false otherwise
   */
  public updateTask(taskId: string, updates: Partial<ITask>): boolean {
    for (const [filePath, fileTasks] of this.tasks.entries()) {
      const taskIndex = fileTasks.findIndex((task) => task.id === taskId);

      if (taskIndex !== -1) {
        const updatedTask = { ...fileTasks[taskIndex], ...updates };
        fileTasks[taskIndex] = updatedTask;
        this.tasks.set(filePath, fileTasks);
        this._onDidTasksChange.fire({ updated: [updatedTask] });
        return true;
      }
    }

    return false;
  }

  /**
   * Get all tasks across all files.
   *
   * @returns Array of all tasks
   */
  public getAllTasks(): ITask[] {
    const allTasks: ITask[] = [];

    for (const fileTasks of this.tasks.values()) {
      allTasks.push(...fileTasks);
    }

    return allTasks;
  }

  /**
   * Get tasks for a specific file.
   *
   * @param filePath Path to the file
   * @returns Array of tasks in the file
   */
  public getTasksByFile(filePath: string): ITask[] {
    return this.tasks.get(filePath) || [];
  }

  /**
   * Find tasks that match a predicate.
   *
   * @param predicate Function that returns true for matching tasks
   * @returns Array of matching tasks
   */
  public findTasks(predicate: (task: ITask) => boolean): ITask[] {
    return this.getAllTasks().filter(predicate);
  }

  /**
   * Scan a file for tasks.
   *
   * @param uri URI of the file to scan
   */
  public async scanFile(uri: vscode.Uri): Promise<void> {
    try {
      const content = await readFile(uri.fsPath, "utf8");
      const tasks = this.parser.parseMarkdownContent(content, uri.fsPath);

      // Remove old tasks for this file
      this.removeTasks(uri.fsPath);

      // Add new tasks
      if (tasks.length > 0) {
        this.addTasks(uri.fsPath, tasks);
      }
    } catch (error) {
      console.error(`Error scanning file ${uri.fsPath}:`, error);
    }
  }

  /**
   * Scan all markdown files in the workspace for tasks.
   */
  public async scanWorkspace(): Promise<void> {
    const markdownFiles = await vscode.workspace.findFiles(
      "**/*.{md,markdown}"
    );

    // Process files in batches to avoid overwhelming the system
    const batchSize = 10;
    for (let i = 0; i < markdownFiles.length; i += batchSize) {
      const batch = markdownFiles.slice(i, i + batchSize);
      await Promise.all(batch.map((uri) => this.scanFile(uri)));
    }
  }

  /**
   * Toggle the status of a task.
   *
   * @param taskId ID of the task to toggle
   * @returns true if the task was toggled, false otherwise
   */
  public toggleTaskStatus(taskId: string): boolean {
    const allTasks = this.getAllTasks();
    const task = allTasks.find((t) => t.id === taskId);

    if (!task) {
      return false;
    }

    const newStatus =
      task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
    const updates: Partial<ITask> = { status: newStatus };

    // If task is being marked as done, set completedDate
    if (newStatus === TaskStatus.DONE) {
      updates.completedDate = new Date();
    } else {
      updates.completedDate = undefined;
    }

    return this.updateTask(taskId, updates);
  }
}

/**
 * WorkspaceTaskManager: タスク管理の中心クラス
 * @generated Aided with basic GitHub coding tools
 */
export class WorkspaceTaskManager {
  private tasks: Map<string, ITask[]> = new Map();
  private index: TaskIndex = new TaskIndex();
  private _onTasksChanged = new vscode.EventEmitter<{
    added?: ITask[];
    removed?: ITask[];
    updated?: ITask[];
  }>();
  public readonly onTasksChanged = this._onTasksChanged.event;

  /**
   * ファイル単位でタスクを追加/更新
   */
  addTasks(filePath: string, tasks: ITask[]): void {
    // 既存タスクのindexを削除
    const oldTasks = this.tasks.get(filePath) || [];
    for (const t of oldTasks) {
      this.index.removeFromIndex(t.id);
    }
    // 新タスクをindexに追加
    for (const t of tasks) {
      this.index.updateIndex(t);
    }
    this.tasks.set(filePath, tasks);
    this._onTasksChanged.fire({ added: tasks });
  }

  /**
   * ファイル単位でタスクを削除
   */
  removeTasks(filePath: string): void {
    const removed = this.tasks.get(filePath) || [];
    for (const t of removed) {
      this.index.removeFromIndex(t.id);
    }
    this.tasks.delete(filePath);
    if (removed.length > 0) {
      this._onTasksChanged.fire({ removed });
    }
  }

  /**
   * タスクを更新
   */
  updateTask(taskId: string, updates: Partial<ITask>): boolean {
    for (const [filePath, fileTasks] of this.tasks.entries()) {
      const idx = fileTasks.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        const updated = { ...fileTasks[idx], ...updates };
        // index更新
        this.index.removeFromIndex(taskId);
        this.index.updateIndex(updated);
        fileTasks[idx] = updated;
        this.tasks.set(filePath, fileTasks);
        this._onTasksChanged.fire({ updated: [updated] });
        return true;
      }
    }
    return false;
  }

  /**
   * すべてのタスク取得
   */
  getAllTasks(): ITask[] {
    const all: ITask[] = [];
    for (const arr of this.tasks.values()) {
      all.push(...arr);
    }
    return all;
  }

  /**
   * ファイル単位でタスク取得
   */
  getTasksByFile(filePath: string): ITask[] {
    return this.tasks.get(filePath) || [];
  }

  /**
   * 条件でタスク検索
   */
  findTasks(predicate: (task: ITask) => boolean): ITask[] {
    return this.getAllTasks().filter(predicate);
  }

  /**
   * タグでタスクID検索
   */
  findTaskIdsByTag(tag: string): string[] {
    return this.index.findByTag(tag);
  }

  /**
   * ステータスでタスクID検索
   */
  findTaskIdsByStatus(status: TaskStatus): string[] {
    return this.index.findByStatus(status);
  }

  /**
   * 期日範囲でタスクID検索
   */
  findTaskIdsByDueDateRange(start: Date, end: Date): string[] {
    return this.index.findByDueDateRange(start, end);
  }

  /**
   * 指定ファイルをスキャンしてタスクを抽出・登録
   */
  async scanFile(uri: vscode.Uri): Promise<void> {
    try {
      const content = await readFile(uri.fsPath, "utf8");
      const parser = new TaskParser();
      const tasks = parser.parseMarkdownContent(content, uri.fsPath);
      this.removeTasks(uri.fsPath);
      if (tasks.length > 0) {
        this.addTasks(uri.fsPath, tasks);
      }
    } catch (error) {
      console.error(`Error scanning file ${uri.fsPath}:`, error);
    }
  }

  /**
   * ワークスペース内の全Markdownファイルをスキャン
   */
  async scanWorkspace(): Promise<void> {
    const markdownFiles = await vscode.workspace.findFiles(
      "**/*.{md,markdown}"
    );
    const batchSize = 10;
    for (let i = 0; i < markdownFiles.length; i += batchSize) {
      const batch = markdownFiles.slice(i, i + batchSize);
      await Promise.all(batch.map((uri) => this.scanFile(uri)));
    }
  }

  /**
   * タスクのステータスをトグル
   */
  toggleTaskStatus(taskId: string): boolean {
    const allTasks = this.getAllTasks();
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) {
      return false;
    }
    const newStatus =
      task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
    const updates: Partial<ITask> = { status: newStatus };
    if (newStatus === TaskStatus.DONE) {
      updates.completedDate = new Date();
    } else {
      updates.completedDate = undefined;
    }
    return this.updateTask(taskId, updates);
  }
}
