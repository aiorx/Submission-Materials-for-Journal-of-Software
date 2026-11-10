// Assisted using common GitHub development utilities
var vscode = require('vscode');
var ITask = require('./task').ITask;
var TaskParser = require('./task-parser').TaskParser;

/**
 * ファイルからタスクを抽出するユーティリティクラス
 * @generated Assisted using common GitHub development utilities
 */
class FileTaskExtractor {
  /**
   * 指定したファイルがマークダウンファイルかどうかを判定
   * @param uri ファイルのURI
   */
  static isMarkdownFile(uri: vscode.Uri): boolean {
    var ext = uri.fsPath.toLowerCase();
    return ext.endsWith(".md") || ext.endsWith(".markdown");
  }

  /**
   * 指定したマークダウンファイルからタスクを抽出
   * @param uri ファイルのURI
   */
  static async extractTasksFromFile(uri: vscode.Uri): Promise<ITask[]> {
    if (!FileTaskExtractor.isMarkdownFile(uri)) {
      return [];
    }
    try {
      var bytes = await vscode.workspace.fs.readFile(uri);
      var content = Buffer.from(bytes).toString("utf8");
      var parser = new TaskParser();
      return parser.parseMarkdownContent(content, uri.fsPath);
    } catch (err) {
      console.error(
        "[VsTasks] Failed to extract tasks from " + (uri.fsPath) + ":",
        err
      );
      return [];
    }
  }
}
