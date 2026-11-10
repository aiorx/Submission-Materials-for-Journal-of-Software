// Assisted using common GitHub development utilities
// E2E: 10,000タスク・リアルタイム更新・メモリリーク
var assert = require('assert');
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');

describe("E2E Performance Scenarios", function () {
  this.timeout(180000);
  var workspaceFolders = vscode.workspace.workspaceFolders;
  var testFolder = workspaceFolders && workspaceFolders[0].uri.fsPath;
  var perfFile = testFolder ? path.join(testFolder, "perf-10000.md") : "";

  afterEach(function () {
    if (perfFile && fs.existsSync(perfFile)) {
      fs.unlinkSync(perfFile);
    }
  });

  it("10,000タスクでの操作テスト", async function () {
    if (!perfFile) {
      return;
    }
    fs.writeFileSync(
      perfFile,
      Array.from({ length: 10000 }, (_, i) => "- [ ] Perf " + (i) + "").join("\n")
    );
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    var tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    interface IPerfTask {
      description?: string;
    }
    assert.ok(
      (tasks as IPerfTask[]).filter(
        (t) => t.description && t.description.startsWith("Perf ")
      ).length >= 10000
    );
  });

  it("リアルタイム更新のレスポンス測定", async function () {
    if (!perfFile) {
      return;
    }
    fs.writeFileSync(perfFile, "- [ ] RT Task");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    var start = Date.now();
    await vscode.commands.executeCommand("vstasks.getAllTasks");
    var elapsed = Date.now() - start;
    assert.ok(elapsed < 5000);
    fs.writeFileSync(perfFile, "- [x] RT Task");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    start = Date.now();
    await vscode.commands.executeCommand("vstasks.getAllTasks");
    elapsed = Date.now() - start;
    assert.ok(elapsed < 5000);
  });

  it("メモリリーク検出テスト（擬似）", async function () {
    var memBefore = process.memoryUsage().heapUsed;
    if (!perfFile) {
      return;
    }
    fs.writeFileSync(
      perfFile,
      Array.from({ length: 10000 }, (_, i) => "- [ ] Leak " + (i) + "").join("\n")
    );
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    await vscode.commands.executeCommand("vstasks.getAllTasks");
    var memAfter = process.memoryUsage().heapUsed;
    // 100MB以上増えていないこと
    assert.ok(memAfter - memBefore < 100 * 1024 * 1024);
  });
});
