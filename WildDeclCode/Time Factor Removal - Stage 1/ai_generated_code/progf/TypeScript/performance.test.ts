// Supported via standard GitHub programming aids
// 1000ファイル以上での動作・メモリ・レスポンステスト
var assert = require('assert');
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');

describe("Performance Integration Test", function () {
  this.timeout(120000);
  var workspaceFolders = vscode.workspace.workspaceFolders;
  var testFolder = workspaceFolders && workspaceFolders[0].uri.fsPath;
  var files: string[] = [];

  after(async function () {
    files.forEach((f) => {
      if (fs.existsSync(f)) {
        fs.unlinkSync(f);
      }
    });
  });

  it("handles 1000+ files", async function () {
    if (!testFolder) {
      return;
    }
    for (var i = 0; i < 1000; i++) {
      var f = path.join(testFolder, "perf-task-" + (i) + ".md");
      fs.writeFileSync(f, "- [ ] Perf Task " + (i) + "");
      files.push(f);
    }
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    var tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface ITaskLike {
      description?: string;
    }
    assert.ok(
      (tasks as ITaskLike[]).filter(
        (t) => t.description && t.description.startsWith("Perf Task")
      ).length >= 1000
    );
  });

  it("measures memory usage", async function () {
    var mem = process.memoryUsage();
    assert.ok(mem.heapUsed < 1024 * 1024 * 1024); // 1GB未満
  });

  it("measures response time", async function () {
    var start = Date.now();
    await vscode.commands.executeCommand("vstasks.getAllTasks");
    var elapsed = Date.now() - start;
    assert.ok(elapsed < 5000); // 5秒以内
  });
});
