// Aided with basic GitHub coding tools
// E2E: 新規タスク作成→編集→完了、複雑クエリ、繰り返し、エクスポート・インポート
import * as assert from "assert";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

describe("E2E User Workflows", function () {
  this.timeout(120000);
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const testFolder = workspaceFolders && workspaceFolders[0].uri.fsPath;
  const testFile = testFolder ? path.join(testFolder, "e2e-user.md") : "";

  afterEach(() => {
    if (testFile && fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  // 型定義: E2EWorkflowTask
  interface IE2EWorkflowTask {
    description?: string;
  }

  it("新規タスク作成→編集→完了のフロー", async () => {
    if (!testFile) {
      return;
    }
    // 新規作成
    fs.writeFileSync(testFile, "- [ ] E2E Task 1");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    let tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    assert.ok(
      (tasks as IE2EWorkflowTask[]).some((t) => t.description === "E2E Task 1")
    );
    // 編集
    fs.writeFileSync(testFile, "- [ ] E2E Task 1 edited");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    assert.ok(
      (tasks as IE2EWorkflowTask[]).some(
        (t) => t.description === "E2E Task 1 edited"
      )
    );
    // 完了
    fs.writeFileSync(testFile, "- [x] E2E Task 1 edited");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    assert.ok(
      (tasks as IE2EWorkflowTask[]).some(
        (t) => t.description === "E2E Task 1 edited"
      )
    );
  });

  it("複雑なクエリ実行フロー", async () => {
    if (!testFile) {
      return;
    }
    // 複数タスク作成
    fs.writeFileSync(
      testFile,
      "- [ ] Query1 #work\n- [ ] Query2 #home\n- [x] Query3 #work"
    );
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    // クエリ実行
    const result = await vscode.commands.executeCommand(
      "vstasks.runQuery",
      "not done and tag contains #work"
    );
    if (!Array.isArray(result)) {
      throw new Error("result is not an array");
    }
    assert.ok(
      (result as IE2EWorkflowTask[]).some((t) => t.description === "Query1")
    );
    assert.ok(
      !(result as IE2EWorkflowTask[]).some((t) => t.description === "Query3")
    );
  });

  it("繰り返しタスクの生成・管理フロー", async () => {
    if (!testFile) {
      return;
    }
    // 繰り返しタスク作成
    fs.writeFileSync(testFile, "- [ ] Repeat Task 🔁 every day");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    let tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    assert.ok(
      (tasks as IE2EWorkflowTask[]).some((t) => t.description === "Repeat Task")
    );
    // 完了→次回生成
    fs.writeFileSync(testFile, "- [x] Repeat Task 🔁 every day");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    // 新しい繰り返しタスクが生成されていることを確認（例: descriptionがRepeat Taskのものが存在）
    assert.ok(
      (tasks as IE2EWorkflowTask[]).some((t) => t.description === "Repeat Task")
    );
  });

  it("エクスポート・インポートフロー", async () => {
    if (!testFile) {
      return;
    }
    // タスク作成
    fs.writeFileSync(testFile, "- [ ] Exported Task");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    // エクスポート
    await vscode.commands.executeCommand("vstasks.exportTasks");
    // インポート
    await vscode.commands.executeCommand("vstasks.importTasks");
    // タスクが存在することを確認
    const tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    assert.ok(
      (tasks as IE2EWorkflowTask[]).some(
        (t) => t.description === "Exported Task"
      )
    );
  });
});
