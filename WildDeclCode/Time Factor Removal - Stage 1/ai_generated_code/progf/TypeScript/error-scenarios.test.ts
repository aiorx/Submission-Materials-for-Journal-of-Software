// Supported via standard GitHub programming aids
// E2E: 異常系シナリオ（不正ファイル・ネットワーク・メモリ・設定）
var assert = require('assert');
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');

describe("E2E Error Scenarios", function () {
  this.timeout(90000);
  var workspaceFolders = vscode.workspace.workspaceFolders;
  var testFolder = workspaceFolders && workspaceFolders[0].uri.fsPath;
  var badFile = testFolder ? path.join(testFolder, "bad.md") : "";
  var configFile = testFolder ? path.join(testFolder, ".vstasks.json") : "";

  afterEach(function () {
    if (badFile && fs.existsSync(badFile)) {
      fs.unlinkSync(badFile);
    }
    if (configFile && fs.existsSync(configFile)) {
      fs.unlinkSync(configFile);
    }
  });

  it("不正なマークダウンファイル処理", async function () {
    if (!badFile) {
      return;
    }
    fs.writeFileSync(badFile, "- [z] broken\n- []\nplain text");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    var tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    assert.ok(Array.isArray(tasks));
    interface ITaskError {
      description?: string;
    }
    assert.ok(
      (tasks as ITaskError[]).every((t) => t.description !== undefined)
    );
  });

  it("ネットワークエラー時の動作（モック）", async function () {
    // 実際のネットワークエラーは再現困難なため、API呼び出しをtry-catchでラップ
    var errorCaught = false;
    try {
      await vscode.commands.executeCommand(
        "vstasks.syncWithIssues",
        "invalid-repo-url"
      );
    } catch (e) {
      errorCaught = true;
    }
    assert.ok(errorCaught);
  });

  it("大量データでのメモリ不足シナリオ（擬似）", async function () {
    if (!testFolder) {
      return;
    }
    // 10万件のタスクを生成
    var bigFile = path.join(testFolder, "big.md");
    fs.writeFileSync(
      bigFile,
      Array.from({ length: 100000 }, (_, i) => "- [ ] Big " + (i) + "").join("\n")
    );
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    var tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    assert.ok(Array.isArray(tasks));
    fs.unlinkSync(bigFile);
  });

  it("設定ファイル破損時の回復", async function () {
    if (!configFile) {
      return;
    }
    fs.writeFileSync(configFile, "{ broken json }");
    var errorCaught = false;
    try {
      await vscode.commands.executeCommand("vstasks.refreshAllTasks");
    } catch (e) {
      errorCaught = true;
    }
    assert.ok(errorCaught);
  });
});
