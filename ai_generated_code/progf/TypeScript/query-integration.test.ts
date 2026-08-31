// Assisted using common GitHub development utilities
// クエリのエンドツーエンド・複数ファイル・リアルタイム更新テスト
import * as assert from "assert";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

describe("Query Integration Test", function () {
  this.timeout(60000);
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const testFolder = workspaceFolders && workspaceFolders[0].uri.fsPath;
  const fileA = testFolder ? path.join(testFolder, "query-a.md") : "";
  const fileB = testFolder ? path.join(testFolder, "query-b.md") : "";

  afterEach(() => {
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

  it("runs end-to-end query", async () => {
    if (!fileA) {
      return;
    }
    fs.writeFileSync(fileA, "- [ ] Query Task 1\n- [x] Query Task 2");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    const result = await vscode.commands.executeCommand(
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

  it("searches across multiple files", async () => {
    if (!fileA || !fileB) {
      return;
    }
    fs.writeFileSync(fileA, "- [ ] Multi 1");
    fs.writeFileSync(fileB, "- [ ] Multi 2");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    const result = await vscode.commands.executeCommand(
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

  it("updates in real time", async () => {
    if (!fileA) {
      return;
    }
    fs.writeFileSync(fileA, "- [ ] RealTime Task");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    let result = await vscode.commands.executeCommand(
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
