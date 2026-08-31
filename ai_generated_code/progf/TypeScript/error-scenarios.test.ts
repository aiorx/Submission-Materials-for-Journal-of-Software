// Supported via standard GitHub programming aids
// E2E: 異常系シナリオ（不正ファイル・ネットワーク・メモリ・設定）
import * as assert from "assert";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

describe("E2E Error Scenarios", function () {
  this.timeout(90000);
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const testFolder = workspaceFolders && workspaceFolders[0].uri.fsPath;
  const badFile = testFolder ? path.join(testFolder, "bad.md") : "";
  const configFile = testFolder ? path.join(testFolder, ".vstasks.json") : "";

  afterEach(() => {
    if (badFile && fs.existsSync(badFile)) {
      fs.unlinkSync(badFile);
    }
    if (configFile && fs.existsSync(configFile)) {
      fs.unlinkSync(configFile);
    }
  });

  it("不正なマークダウンファイル処理", async () => {
    if (!badFile) {
      return;
    }
    fs.writeFileSync(badFile, "- [z] broken\n- []\nplain text");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    const tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    assert.ok(Array.isArray(tasks));
    interface ITaskError {
      description?: string;
    }
    assert.ok(
      (tasks as ITaskError[]).every((t) => t.description !== undefined)
    );
  });

  it("ネットワークエラー時の動作（モック）", async () => {
    // 実際のネットワークエラーは再現困難なため、API呼び出しをtry-catchでラップ
    let errorCaught = false;
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

  it("大量データでのメモリ不足シナリオ（擬似）", async () => {
    if (!testFolder) {
      return;
    }
    // 10万件のタスクを生成
    const bigFile = path.join(testFolder, "big.md");
    fs.writeFileSync(
      bigFile,
      Array.from({ length: 100000 }, (_, i) => `- [ ] Big ${i}`).join("\n")
    );
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    const tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    assert.ok(Array.isArray(tasks));
    fs.unlinkSync(bigFile);
  });

  it("設定ファイル破損時の回復", async () => {
    if (!configFile) {
      return;
    }
    fs.writeFileSync(configFile, "{ broken json }");
    let errorCaught = false;
    try {
      await vscode.commands.executeCommand("vstasks.refreshAllTasks");
    } catch (e) {
      errorCaught = true;
    }
    assert.ok(errorCaught);
  });
});
