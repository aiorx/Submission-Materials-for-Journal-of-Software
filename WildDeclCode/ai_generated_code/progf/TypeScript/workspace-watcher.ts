// Supported via standard GitHub programming aids
import * as vscode from "vscode";
import { TaskManager } from "./task-manager";
import { FileTaskExtractor } from "./file-task-extractor";

/**
 * ワークスペース内のマークダウンファイルを監視し、タスクの変更を検出するクラス
 * @generated Supported via standard GitHub programming aids
 */
export class WorkspaceWatcher {
  private watcher: vscode.FileSystemWatcher | undefined;
  private disposables: vscode.Disposable[] = [];
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly debounceMs = 300;

  constructor(private taskManager: TaskManager) {}

  /**
   * 監視を開始する
   */
  public startWatching(): void {
    if (this.watcher) {
      return;
    }
    this.watcher =
      vscode.workspace.createFileSystemWatcher("**/*.{md,markdown}");
    this.watcher.onDidChange(
      (uri) => this.debounce(uri, () => this.onFileChanged(uri)),
      this,
      this.disposables
    );
    this.watcher.onDidCreate(
      (uri) => this.debounce(uri, () => this.onFileCreated(uri)),
      this,
      this.disposables
    );
    this.watcher.onDidDelete(
      (uri) => this.debounce(uri, () => this.onFileDeleted(uri)),
      this,
      this.disposables
    );
    console.log("[VsTasks] WorkspaceWatcher started");
  }

  /**
   * 監視を停止する
   */
  public stopWatching(): void {
    if (this.watcher) {
      this.watcher.dispose();
      this.watcher = undefined;
    }
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
    console.log("[VsTasks] WorkspaceWatcher stopped");
  }

  /**
   * ファイル変更時の処理
   */
  public async onFileChanged(uri: vscode.Uri): Promise<void> {
    if (!FileTaskExtractor.isMarkdownFile(uri)) {
      return;
    }
    try {
      const tasks = await FileTaskExtractor.extractTasksFromFile(uri);
      this.taskManager.addTasks(uri.fsPath, tasks);
      console.log(`[VsTasks] Tasks updated for file: ${uri.fsPath}`);
    } catch (err) {
      console.error(`[VsTasks] Error onFileChanged: ${uri.fsPath}`, err);
    }
  }

  /**
   * ファイル作成時の処理
   */
  public async onFileCreated(uri: vscode.Uri): Promise<void> {
    if (!FileTaskExtractor.isMarkdownFile(uri)) {
      return;
    }
    try {
      const tasks = await FileTaskExtractor.extractTasksFromFile(uri);
      this.taskManager.addTasks(uri.fsPath, tasks);
      console.log(`[VsTasks] Tasks added for new file: ${uri.fsPath}`);
    } catch (err) {
      console.error(`[VsTasks] Error onFileCreated: ${uri.fsPath}`, err);
    }
  }

  /**
   * ファイル削除時の処理
   */
  public onFileDeleted(uri: vscode.Uri): void {
    if (!FileTaskExtractor.isMarkdownFile(uri)) {
      return;
    }
    this.taskManager.removeTasks(uri.fsPath);
    console.log(`[VsTasks] Tasks removed for deleted file: ${uri.fsPath}`);
  }

  /**
   * debounce処理
   */
  private debounce(uri: vscode.Uri, fn: () => void): void {
    const key = uri.toString();
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }
    this.debounceTimers.set(
      key,
      setTimeout(() => {
        this.debounceTimers.delete(key);
        fn();
      }, this.debounceMs)
    );
  }
}
