// Aided with basic GitHub coding tools
import * as vscode from "vscode";
import { WorkspaceTaskManager } from "./models/task-manager";
import { TaskTreeDataProvider } from "./views/task-tree-provider";
import { TaskCommands } from "./task-commands";
import { QuickActions } from "./quick-actions";
import { WorkspaceCommands } from "./workspace-commands";
import { TaskCodeLensProvider } from "./task-code-lens-provider";
import { TaskHoverProvider } from "./task-hover-provider";
import { TaskCompletionProvider } from "./task-completion-provider";
import { TaskDecorationProvider } from "./task-decoration-provider";
import { QueryResultPanel } from "./views/query-result-panel";
import { Lexer } from "./models/query-lexer";
import { Parser } from "./models/query-parser";
import { QueryExecutor } from "./models/query-executor";
import { SavedQueryManager } from "./models/saved-query-manager";
import { QueryTreeDataProvider } from "./views/query-tree-provider";
import { v4 as uuidv4 } from "uuid";

// This function is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("VsTasks extension is now active!");

  // Create workspace task manager instance
  const taskManager = new WorkspaceTaskManager();

  // Create tree view provider
  const taskTreeProvider = new TaskTreeDataProvider(taskManager);
  const taskTreeView = vscode.window.createTreeView("vstasks.taskTree", {
    treeDataProvider: taskTreeProvider,
  });

  // --- コマンド登録はTaskCommands/QuickActions/WorkspaceCommandsに一元化 ---

  // Saved Query Sidebar
  const savedQueryManager = new SavedQueryManager(context);
  const queryTreeProvider = new QueryTreeDataProvider(
    savedQueryManager,
    taskManager
  );
  vscode.window.createTreeView("vstasks.queryView", {
    treeDataProvider: queryTreeProvider,
    showCollapseAll: false,
  });

  // Register command: Add/Edit/Delete/Run Saved Query ...（このまま）
  context.subscriptions.push(
    vscode.commands.registerCommand("vstasks.addSavedQuery", async () => {
      const label = await vscode.window.showInputBox({
        prompt: "クエリ名を入力",
      });
      if (!label) {
        return;
      }
      const query = await vscode.window.showInputBox({
        prompt: "クエリ内容を入力",
      });
      if (!query) {
        return;
      }
      savedQueryManager.add({ id: uuidv4(), label, query });
      queryTreeProvider.refresh();
    }),
    vscode.commands.registerCommand("vstasks.editSavedQuery", async (item) => {
      const label = await vscode.window.showInputBox({
        prompt: "新しいクエリ名",
        value: item.query.label,
      });
      if (!label) {
        return;
      }
      const query = await vscode.window.showInputBox({
        prompt: "新しいクエリ内容",
        value: item.query.query,
      });
      if (!query) {
        return;
      }
      savedQueryManager.update(item.query.id, { label, query });
      queryTreeProvider.refresh();
    }),
    vscode.commands.registerCommand(
      "vstasks.deleteSavedQuery",
      async (item) => {
        const ok = await vscode.window.showQuickPick(["はい", "いいえ"], {
          placeHolder: "本当に削除しますか?",
        });
        if (ok === "はい") {
          savedQueryManager.remove(item.query.id);
          queryTreeProvider.refresh();
        }
      }
    ),
    vscode.commands.registerCommand("vstasks.runSavedQuery", async (query) => {
      try {
        // Aided with basic GitHub coding tools
        // Accept both string and object
        const queryText = typeof query === "string" ? query : query?.query;
        if (!queryText) {
          vscode.window.showErrorMessage("クエリが見つかりません");
          return;
        }
        const lexer = new Lexer(queryText);
        const parser = new Parser(lexer);
        const ast = parser.parseQuery();
        const executor = new QueryExecutor(taskManager.getAllTasks());
        const result = executor.executeQuery(ast);
        const panel = new QueryResultPanel(context.extensionUri);
        panel.show(result);
      } catch (err) {
        vscode.window.showErrorMessage(`クエリ実行エラー: ${err}`);
      }
    }),
    vscode.commands.registerCommand("vstasks.completeTask", async (item) => {
      // itemはTaskTreeItemまたはQueryTreeItem
      let task = item?.task;
      if (!task && item?.type === "task") {
        task = item.task;
      }
      if (!task && item?.type === "queryTask") {
        task = item.task;
      }
      if (!task) {
        vscode.window.showErrorMessage("タスク情報が取得できません");
        return;
      }
      if (task.status === "done") {
        vscode.window.showInformationMessage("すでに完了済みです");
        return;
      }
      // ステータスを完了に変更
      const taskCommands = new TaskCommands(taskManager);
      await taskCommands.toggleTaskStatus(task.id);
      vscode.window.showInformationMessage("タスクを完了にしました");
    }),
    vscode.commands.registerCommand(
      "vstasks.openTaskFile",
      async (filePath: string, lineNumber: number) => {
        if (!filePath) {
          vscode.window.showErrorMessage("ファイルパスがありません");
          return;
        }
        try {
          const doc = await vscode.workspace.openTextDocument(filePath);
          const editor = await vscode.window.showTextDocument(doc, {
            preview: false,
          });
          if (typeof lineNumber === "number" && lineNumber >= 0) {
            const pos = new vscode.Position(lineNumber, 0);
            editor.selection = new vscode.Selection(pos, pos);
            editor.revealRange(
              new vscode.Range(pos, pos),
              vscode.TextEditorRevealType.InCenter
            );
          }
        } catch (e) {
          vscode.window.showErrorMessage(`ファイルを開けませんでした: ${e}`);
        }
      }
    )
  );

  // Setup workspace file watcher for markdown files
  const mdWatcher = vscode.workspace.createFileSystemWatcher("**/*.md");
  const markdownWatcher =
    vscode.workspace.createFileSystemWatcher("**/*.markdown");

  // File watcher events
  mdWatcher.onDidChange((uri: vscode.Uri) => {
    console.log(`File changed: ${uri.fsPath}`);
    taskManager.scanFile(uri);
  });

  mdWatcher.onDidCreate((uri: vscode.Uri) => {
    console.log(`New file created: ${uri.fsPath}`);
    taskManager.scanFile(uri);
  });

  mdWatcher.onDidDelete((uri: vscode.Uri) => {
    console.log(`File deleted: ${uri.fsPath}`);
    taskManager.removeTasks(uri.fsPath);
  });

  // Register watchers for .markdown files too
  markdownWatcher.onDidChange((uri: vscode.Uri) => {
    console.log(`File changed: ${uri.fsPath}`);
    taskManager.scanFile(uri);
  });

  markdownWatcher.onDidCreate((uri: vscode.Uri) => {
    console.log(`New file created: ${uri.fsPath}`);
    taskManager.scanFile(uri);
  });

  markdownWatcher.onDidDelete((uri: vscode.Uri) => {
    console.log(`File deleted: ${uri.fsPath}`);
    taskManager.removeTasks(uri.fsPath);
  });

  // Register editor features for markdown
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { language: "markdown" },
      new TaskCodeLensProvider()
    ),
    vscode.languages.registerHoverProvider(
      { language: "markdown" },
      new TaskHoverProvider()
    ),
    vscode.languages.registerCompletionItemProvider(
      { language: "markdown" },
      new TaskCompletionProvider(),
      "#",
      "-",
      "[",
      "⏫",
      "⏳",
      "📅"
    )
  );
  // Optionally: update decorations on active editor change
  const decoProvider = new TaskDecorationProvider();
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && editor.document.languageId === "markdown") {
      decoProvider.updateDecorations(editor);
    }
  });
  vscode.workspace.onDidChangeTextDocument((e) => {
    const editor = vscode.window.activeTextEditor;
    if (
      editor &&
      editor.document === e.document &&
      editor.document.languageId === "markdown"
    ) {
      decoProvider.updateDecorations(editor);
    }
  });

  // Scan workspace for tasks on activation
  taskManager.scanWorkspace().then(() => {
    console.log("Initial workspace scan complete");
  });

  // Register new command classes
  const taskCommands = new TaskCommands(taskManager);
  taskCommands.registerCommands(context);
  const quickActions = new QuickActions(taskManager);
  quickActions.registerCommands(context);
  const workspaceCommands = new WorkspaceCommands(taskManager);
  workspaceCommands.registerCommands(context);

  // Register everything to be disposed when extension is deactivated
  context.subscriptions.push(mdWatcher, markdownWatcher, taskTreeView);
}

// This function is called when your extension is deactivated
export function deactivate() {
  console.log("VsTasks extension is now deactivated!");
}
