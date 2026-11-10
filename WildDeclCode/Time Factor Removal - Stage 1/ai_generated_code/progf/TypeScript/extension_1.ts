// Aided with basic GitHub coding tools
var vscode = require('vscode');
var WorkspaceTaskManager = require('./models/task-manager').WorkspaceTaskManager;
var TaskTreeDataProvider = require('./views/task-tree-provider').TaskTreeDataProvider;
var TaskCommands = require('./task-commands').TaskCommands;
var QuickActions = require('./quick-actions').QuickActions;
var WorkspaceCommands = require('./workspace-commands').WorkspaceCommands;
var TaskCodeLensProvider = require('./task-code-lens-provider').TaskCodeLensProvider;
var TaskHoverProvider = require('./task-hover-provider').TaskHoverProvider;
var TaskCompletionProvider = require('./task-completion-provider').TaskCompletionProvider;
var TaskDecorationProvider = require('./task-decoration-provider').TaskDecorationProvider;
var QueryResultPanel = require('./views/query-result-panel').QueryResultPanel;
var Lexer = require('./models/query-lexer').Lexer;
var Parser = require('./models/query-parser').Parser;
var QueryExecutor = require('./models/query-executor').QueryExecutor;
var SavedQueryManager = require('./models/saved-query-manager').SavedQueryManager;
var QueryTreeDataProvider = require('./views/query-tree-provider').QueryTreeDataProvider;
var uuidv4 = require('uuid').v4;

// This function is called when your extension is activated
function activate(context: vscode.ExtensionContext) {
  console.log("VsTasks extension is now active!");

  // Create workspace task manager instance
  var taskManager = new WorkspaceTaskManager();

  // Create tree view provider
  var taskTreeProvider = new TaskTreeDataProvider(taskManager);
  var taskTreeView = vscode.window.createTreeView("vstasks.taskTree", {
    treeDataProvider: taskTreeProvider,
  });

  // --- コマンド登録はTaskCommands/QuickActions/WorkspaceCommandsに一元化 ---

  // Saved Query Sidebar
  var savedQueryManager = new SavedQueryManager(context);
  var queryTreeProvider = new QueryTreeDataProvider(
    savedQueryManager,
    taskManager
  );
  vscode.window.createTreeView("vstasks.queryView", {
    treeDataProvider: queryTreeProvider,
    showCollapseAll: false,
  });

  // Register command: Add/Edit/Delete/Run Saved Query ...（このまま）
  context.subscriptions.push(
    vscode.commands.registerCommand("vstasks.addSavedQuery", async function () {
      var label = await vscode.window.showInputBox({
        prompt: "クエリ名を入力",
      });
      if (!label) {
        return;
      }
      var query = await vscode.window.showInputBox({
        prompt: "クエリ内容を入力",
      });
      if (!query) {
        return;
      }
      savedQueryManager.add({ id: uuidv4(), label, query });
      queryTreeProvider.refresh();
    }),
    vscode.commands.registerCommand("vstasks.editSavedQuery", async function (item) {
      var label = await vscode.window.showInputBox({
        prompt: "新しいクエリ名",
        value: item.query.label,
      });
      if (!label) {
        return;
      }
      var query = await vscode.window.showInputBox({
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
      async function (item) {
        var ok = await vscode.window.showQuickPick(["はい", "いいえ"], {
          placeHolder: "本当に削除しますか?",
        });
        if (ok === "はい") {
          savedQueryManager.remove(item.query.id);
          queryTreeProvider.refresh();
        }
      }
    ),
    vscode.commands.registerCommand("vstasks.runSavedQuery", async function (query) {
      try {
        // Aided with basic GitHub coding tools
        // Accept both string and object
        var queryText = typeof query === "string" ? query : query?.query;
        if (!queryText) {
          vscode.window.showErrorMessage("クエリが見つかりません");
          return;
        }
        var lexer = new Lexer(queryText);
        var parser = new Parser(lexer);
        var ast = parser.parseQuery();
        var executor = new QueryExecutor(taskManager.getAllTasks());
        var result = executor.executeQuery(ast);
        var panel = new QueryResultPanel(context.extensionUri);
        panel.show(result);
      } catch (err) {
        vscode.window.showErrorMessage("クエリ実行エラー: " + (err) + "");
      }
    }),
    vscode.commands.registerCommand("vstasks.completeTask", async function (item) {
      // itemはTaskTreeItemまたはQueryTreeItem
      var task = item?.task;
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
      var taskCommands = new TaskCommands(taskManager);
      await taskCommands.toggleTaskStatus(task.id);
      vscode.window.showInformationMessage("タスクを完了にしました");
    }),
    vscode.commands.registerCommand(
      "vstasks.openTaskFile",
      async function (filePath: string, lineNumber: number) {
        if (!filePath) {
          vscode.window.showErrorMessage("ファイルパスがありません");
          return;
        }
        try {
          var doc = await vscode.workspace.openTextDocument(filePath);
          var editor = await vscode.window.showTextDocument(doc, {
            preview: false,
          });
          if (typeof lineNumber === "number" && lineNumber >= 0) {
            var pos = new vscode.Position(lineNumber, 0);
            editor.selection = new vscode.Selection(pos, pos);
            editor.revealRange(
              new vscode.Range(pos, pos),
              vscode.TextEditorRevealType.InCenter
            );
          }
        } catch (e) {
          vscode.window.showErrorMessage("ファイルを開けませんでした: " + (e) + "");
        }
      }
    )
  );

  // Setup workspace file watcher for markdown files
  var mdWatcher = vscode.workspace.createFileSystemWatcher("**/*.md");
  var markdownWatcher =
    vscode.workspace.createFileSystemWatcher("**/*.markdown");

  // File watcher events
  mdWatcher.onDidChange(function (uri: vscode.Uri) {
    console.log("File changed: " + (uri.fsPath) + "");
    taskManager.scanFile(uri);
  });

  mdWatcher.onDidCreate(function (uri: vscode.Uri) {
    console.log("New file created: " + (uri.fsPath) + "");
    taskManager.scanFile(uri);
  });

  mdWatcher.onDidDelete(function (uri: vscode.Uri) {
    console.log("File deleted: " + (uri.fsPath) + "");
    taskManager.removeTasks(uri.fsPath);
  });

  // Register watchers for .markdown files too
  markdownWatcher.onDidChange(function (uri: vscode.Uri) {
    console.log("File changed: " + (uri.fsPath) + "");
    taskManager.scanFile(uri);
  });

  markdownWatcher.onDidCreate(function (uri: vscode.Uri) {
    console.log("New file created: " + (uri.fsPath) + "");
    taskManager.scanFile(uri);
  });

  markdownWatcher.onDidDelete(function (uri: vscode.Uri) {
    console.log("File deleted: " + (uri.fsPath) + "");
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
  var decoProvider = new TaskDecorationProvider();
  vscode.window.onDidChangeActiveTextEditor(function (editor) {
    if (editor && editor.document.languageId === "markdown") {
      decoProvider.updateDecorations(editor);
    }
  });
  vscode.workspace.onDidChangeTextDocument(function (e) {
    var editor = vscode.window.activeTextEditor;
    if (
      editor &&
      editor.document === e.document &&
      editor.document.languageId === "markdown"
    ) {
      decoProvider.updateDecorations(editor);
    }
  });

  // Scan workspace for tasks on activation
  taskManager.scanWorkspace().then(function () {
    console.log("Initial workspace scan complete");
  });

  // Register new command classes
  var taskCommands = new TaskCommands(taskManager);
  taskCommands.registerCommands(context);
  var quickActions = new QuickActions(taskManager);
  quickActions.registerCommands(context);
  var workspaceCommands = new WorkspaceCommands(taskManager);
  workspaceCommands.registerCommands(context);

  // Register everything to be disposed when extension is deactivated
  context.subscriptions.push(mdWatcher, markdownWatcher, taskTreeView);
}

// This function is called when your extension is deactivated
function deactivate() {
  console.log("VsTasks extension is now deactivated!");
}
