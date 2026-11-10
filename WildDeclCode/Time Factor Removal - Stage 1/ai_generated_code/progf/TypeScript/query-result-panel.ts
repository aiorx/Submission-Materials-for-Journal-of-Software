// Supported via standard GitHub programming aids
var vscode = require('vscode');
var IQueryResult = require('../models/query-executor').IQueryResult;

class QueryResultPanel {
  private panel: vscode.WebviewPanel | undefined;
  private extensionUri: vscode.Uri;
  private currentResult: IQueryResult | undefined;

  constructor(extensionUri: vscode.Uri) {
    this.extensionUri = extensionUri;
  }

  public show(queryResult: IQueryResult): void {
    if (this.panel) {
      this.panel.reveal();
      this.updateContent(queryResult);
      return;
    }
    this.panel = vscode.window.createWebviewPanel(
      "vstasks.queryResult",
      "Task Query Results",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "webview")],
        retainContextWhenHidden: true,
      }
    );
    this.currentResult = queryResult;
    this.panel.webview.html = this.getHtml(queryResult);
    this.panel.webview.onDidReceiveMessage(function (msg) { return this.handleMessage(msg); });
    this.panel.onDidDispose(function () { return (this.panel = undefined); });
  }

  public hide(): void {
    this.panel?.dispose();
    this.panel = undefined;
  }

  public updateContent(queryResult: IQueryResult): void {
    if (this.panel) {
      this.currentResult = queryResult;
      this.panel.webview.html = this.getHtml(queryResult);
    }
  }

  public handleMessage(message: {
    type: string;
    taskId?: string;
    status?: string;
  }): void {
    // Handle messages from webview (e.g., status change, sort/filter)
    if (message.type === "changeStatus" && message.taskId) {
      vscode.commands.executeCommand(
        "vstasks.toggleTaskStatus",
        message.taskId
      );
    }
    // Add more handlers as needed
  }

  private getHtml(queryResult: IQueryResult): string {
    var webview = this.panel?.webview;
    var scriptUri = webview?.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "webview", "script.js")
    );
    var styleUri = webview?.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "webview", "styles.css")
    );
    var csp = "default-src 'none'; style-src " + (webview?.cspSource) + " 'unsafe-inline'; script-src " + (webview?.cspSource) + ";";
    return '
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="' + (csp) + '">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="' + (styleUri) + '">
        <title>Task Query Results</title>
      </head>
      <body>
        <div class="query-toolbar">
          <input id="filterInput" type="text" placeholder="Filter tasks..." />
          <button id="sortBtn">Sort</button>
        </div>
        <table id="taskTable">
          <thead>
            <tr>
              <th>Description</th>
              <th>Status</th>
              <th>Due</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ' + (queryResult.tasks
              .map(
                function (t) { return `
              <tr data-task-id="${t.id}">
                <td>${t.description}</td>
                <td>${t.status}</td>
                <td>${
                  t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ""
                }</td>
                <td>${t.tags?.join(", ") || ""}</td>
                <td>
                  <button class="status-btn" data-task-id="${
                    t.id
                  }" data-status="${t.status}">Toggle</button>
                </td>
              </tr>
            `; })
              .join("")) + '
          </tbody>
        </table>
        <script src="' + (scriptUri) + '"></script>
      </body>
      </html>
    ';
  }
}
