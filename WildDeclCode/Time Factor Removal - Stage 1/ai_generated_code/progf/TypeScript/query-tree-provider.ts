// Aided with basic GitHub coding tools
var vscode = require('vscode');
var ISavedQuery = require('../models/saved-query-manager').ISavedQuery;
var SavedQueryManager = require('../models/saved-query-manager').SavedQueryManager;
var WorkspaceTaskManager = require('../models/task-manager').WorkspaceTaskManager;
var Lexer = require('../models/query-lexer').Lexer;
var Parser = require('../models/query-parser').Parser;
var QueryExecutor = require('../models/query-executor').QueryExecutor;
var ITask = require('../models/task').ITask;
var TaskStatus = require('../models/task').TaskStatus;

class QueryTreeItem extends vscode.TreeItem {
  constructor(
    public readonly query: ISavedQuery,
    public readonly type: "query" | "task" = "query",
    public readonly task?: ITask,
    collapsibleState?: vscode.TreeItemCollapsibleState
  ) {
    super(
      type === "query" ? query.label : task?.description || "",
      collapsibleState !== undefined
        ? collapsibleState
        : type === "query"
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None
    );
    if (type === "query") {
      this.contextValue = "savedQuery";
      this.tooltip = query.query;
      this.command = undefined; // クエリノードは展開のみ
      this.id = "query-" + (query.id) + "";
    } else if (type === "task" && task) {
      this.contextValue = "task-" + (task.status.toLowerCase()) + "";
      this.tooltip = task.description;
      // 選択時はファイルを開く
      this.command = {
        command: "vstasks.openTaskFile",
        title: "Open Task File",
        arguments: [task.filePath, task.lineNumber],
      };
      // ステータスに応じたアイコンを設定
      this.iconPath = this.getIconForTask(task);
      // クエリID+タスクIDでユニークに
      this.id = "querytask-" + (query.id) + "-" + (task.id) + "";
    }
  }

  /**
   * タスクのステータスに基づいてアイコンを取得
   * @param task タスク
   * @returns アイコン
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

class QueryTreeDataProvider
  implements vscode.TreeDataProvider<QueryTreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    QueryTreeItem | undefined | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(
    private savedQueryManager: SavedQueryManager,
    private taskManager: WorkspaceTaskManager
  ) {
    this.taskManager.onTasksChanged(function () { return this.refresh(); });
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: QueryTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: QueryTreeItem): QueryTreeItem[] {
    console.log("[QueryTreeDataProvider] getChildren", element);
    if (!element) {
      var queries = this.savedQueryManager.getAll();
      console.log("[QueryTreeDataProvider] root queries", queries);
      return queries.map(
        function (q) { return new QueryTreeItem(
            q,
            "query",
            undefined,
            vscode.TreeItemCollapsibleState.Collapsed
          ); });
    }
    if (element.type === "query") {
      var queryText = element.query.query;
      try {
        var lexer = new Lexer(queryText);
        var parser = new Parser(lexer);
        var ast = parser.parseQuery();
        var executor = new QueryExecutor(this.taskManager.getAllTasks());
        var result = executor.executeQuery(ast);
        console.log("[QueryTreeDataProvider] query result", result.tasks);
        if (result.tasks.length === 0) {
          var dummy = new QueryTreeItem(
            element.query,
            "task",
            {
              id: "dummy",
              description: "(No tasks found)",
              status: TaskStatus.TODO,
              filePath: "",
              lineNumber: 0,
              tags: [],
              priority: 0,
              rawText: "",
            },
            vscode.TreeItemCollapsibleState.None
          );
          console.log("[QueryTreeDataProvider] children (dummy)", [dummy]);
          return [dummy];
        }
        var children = result.tasks.map(
          function (task) { return new QueryTreeItem(
              element.query,
              "task",
              task,
              vscode.TreeItemCollapsibleState.None
            ); });
        console.log("[QueryTreeDataProvider] children", children);
        return children;
      } catch (e) {
        console.log("[QueryTreeDataProvider] parse error", e);
        var errorItem = new QueryTreeItem(
          element.query,
          "task",
          {
            id: "error",
            description: "(Query parse error)",
            status: TaskStatus.TODO,
            filePath: "",
            lineNumber: 0,
            tags: [],
            priority: 0,
            rawText: "",
          },
          vscode.TreeItemCollapsibleState.None
        );
        return [errorItem];
      }
    }
    return [];
  }
}
