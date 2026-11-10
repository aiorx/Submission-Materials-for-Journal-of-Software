// Assisted using common GitHub development utilities
// E2E: 10,000タスク・リアルタイム更新・メモリリーク
import * as assert from "assert";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

describe("E2E Performance Scenarios", function () {
  this.timeout(180000);
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const testFolder = workspaceFolders && workspaceFolders[0].uri.fsPath;
  const perfFile = testFolder ? path.join(testFolder, "perf-10000.md") : "";

  afterEach(() => {
    if (perfFile && fs.existsSync(perfFile)) {
      fs.unlinkSync(perfFile);
    }
  });

  it("10,000タスクでの操作テスト", async () => {
    if (!perfFile) {
      return;
    }
    fs.writeFileSync(
      perfFile,
      Array.from({ length: 10000 }, (_, i) => `- [ ] Perf ${i}`).join("\n")
    );
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    const tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
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

  it("リアルタイム更新のレスポンス測定", async () => {
    if (!perfFile) {
      return;
    }
    fs.writeFileSync(perfFile, "- [ ] RT Task");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    let start = Date.now();
    await vscode.commands.executeCommand("vstasks.getAllTasks");
    let elapsed = Date.now() - start;
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

  it("メモリリーク検出テスト（擬似）", async () => {
    const memBefore = process.memoryUsage().heapUsed;
    if (!perfFile) {
      return;
    }
    fs.writeFileSync(
      perfFile,
      Array.from({ length: 10000 }, (_, i) => `- [ ] Leak ${i}`).join("\n")
    );
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    await vscode.commands.executeCommand("vstasks.getAllTasks");
    const memAfter = process.memoryUsage().heapUsed;
    // 100MB以上増えていないこと
    assert.ok(memAfter - memBefore < 100 * 1024 * 1024);
  });
});
