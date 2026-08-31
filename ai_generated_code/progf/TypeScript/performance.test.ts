// Supported via standard GitHub programming aids
// 1000ファイル以上での動作・メモリ・レスポンステスト
import * as assert from "assert";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

describe("Performance Integration Test", function () {
  this.timeout(120000);
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const testFolder = workspaceFolders && workspaceFolders[0].uri.fsPath;
  const files: string[] = [];

  after(async () => {
    files.forEach((f) => {
      if (fs.existsSync(f)) {
        fs.unlinkSync(f);
      }
    });
  });

  it("handles 1000+ files", async () => {
    if (!testFolder) {
      return;
    }
    for (let i = 0; i < 1000; i++) {
      const f = path.join(testFolder, `perf-task-${i}.md`);
      fs.writeFileSync(f, `- [ ] Perf Task ${i}`);
      files.push(f);
    }
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    const tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
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

  it("measures memory usage", async () => {
    const mem = process.memoryUsage();
    assert.ok(mem.heapUsed < 1024 * 1024 * 1024); // 1GB未満
  });

  it("measures response time", async () => {
    const start = Date.now();
    await vscode.commands.executeCommand("vstasks.getAllTasks");
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 5000); // 5秒以内
  });
});
