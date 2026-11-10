// Assisted using common GitHub development utilities
// クエリのエンドツーエンド・複数ファイル・リアルタイム更新テスト
var assert = require('assert');
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');

describe("Query Integration Test", function () {
  this.timeout(60000);
  var workspaceFolders = vscode.workspace.workspaceFolders;
  var testFolder = workspaceFolders && workspaceFolders[0].uri.fsPath;
  var fileA = testFolder ? path.join(testFolder, "query-a.md") : "";
  var fileB = testFolder ? path.join(testFolder, "query-b.md") : "";

  afterEach(function () {
    if (fileA && fs.existsSync(fileA)) {
      fs.unlinkSync(fileA);
    }
    if (fileB && fs.existsSync(fileB)) {
      fs.unlinkSync(fileB);
    }
  });

  // 型定義: QueryResultTask
  interface IQueryResultTask {
    description?: string;
  }

  it("runs end-to-end query", async function () {
    if (!fileA) {
      return;
    }
    fs.writeFileSync(fileA, "- [ ] Query Task 1\n- [x] Query Task 2");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    var result = await vscode.commands.executeCommand(
      "vstasks.runQuery",
      "not done"
    );
    if (!Array.isArray(result)) {
      throw new Error("result is not an array");
    }
    assert.ok(
      (result as IQueryResultTask[]).some(
        (t) => t.description === "Query Task 1"
      )
    );
  });

  it("searches across multiple files", async function () {
    if (!fileA || !fileB) {
      return;
    }
    fs.writeFileSync(fileA, "- [ ] Multi 1");
    fs.writeFileSync(fileB, "- [ ] Multi 2");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    var result = await vscode.commands.executeCommand(
      "vstasks.runQuery",
      "not done"
    );
    if (!Array.isArray(result)) {
      throw new Error("result is not an array");
    }
    assert.ok(
      (result as IQueryResultTask[]).some((t) => t.description === "Multi 1")
    );
    assert.ok(
      (result as IQueryResultTask[]).some((t) => t.description === "Multi 2")
    );
  });

  it("updates in real time", async function () {
    if (!fileA) {
      return;
    }
    fs.writeFileSync(fileA, "- [ ] RealTime Task");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    var result = await vscode.commands.executeCommand(
      "vstasks.runQuery",
      "not done"
    );
    if (!Array.isArray(result)) {
      throw new Error("result is not an array");
    }
    assert.ok(
      (result as IQueryResultTask[]).some(
        (t) => t.description === "RealTime Task"
      )
    );
    fs.writeFileSync(fileA, "- [x] RealTime Task");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    result = await vscode.commands.executeCommand(
      "vstasks.runQuery",
      "not done"
    );
    if (!Array.isArray(result)) {
      throw new Error("result is not an array");
    }
    assert.ok(
      !(result as IQueryResultTask[]).some(
        (t) => t.description === "RealTime Task"
      )
    );
  });
});
