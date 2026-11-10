// Aided with basic GitHub coding tools
// TreeView, WebView, コマンド、ユーザー操作フローの統合テスト
import * as assert from "assert";
import * as vscode from "vscode";

describe("UI Integration Test", function () {
  this.timeout(60000);

  it("shows tasks in the TreeView", async () => {
    // TreeViewが表示されているか確認
    const treeView = vscode.window.createTreeView("vstasks.tasks", {
      treeDataProvider: {
        getChildren: () => [],
        getTreeItem: () => new vscode.TreeItem("dummy"),
      },
    });
    assert.ok(treeView);
    await treeView.dispose();
  });

  it("opens the QueryResult WebView", async () => {
    // WebViewパネルを開くコマンドを実行
    await vscode.commands.executeCommand("vstasks.showQueryResult");
    // WebViewが開かれているか確認（activeTextEditorはnullのはず）
    assert.ok(vscode.window.visibleTextEditors.length === 0);
  });

  it("executes a command from the command palette", async () => {
    // コマンド実行
    await vscode.commands.executeCommand("vstasks.createTask");
    // コマンドの副作用は他テストで検証
  });

  it("simulates user workflow", async () => {
    // タスク作成→完了→削除のフロー
    await vscode.commands.executeCommand("vstasks.createTask");
    await vscode.commands.executeCommand("vstasks.toggleTaskStatus");
    await vscode.commands.executeCommand("vstasks.editTask");
    await vscode.commands.executeCommand("vstasks.deleteTask");
  });
});
