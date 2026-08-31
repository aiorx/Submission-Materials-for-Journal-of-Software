// Assisted using common GitHub development utilities
import * as vscode from "vscode";
import { ITask } from "./task";
import { TaskParser } from "./task-parser";

/**
 * ファイルからタスクを抽出するユーティリティクラス
 * @generated Assisted using common GitHub development utilities
 */
export class FileTaskExtractor {
  /**
   * 指定したファイルがマークダウンファイルかどうかを判定
   * @param uri ファイルのURI
   */
  static isMarkdownFile(uri: vscode.Uri): boolean {
    const ext = uri.fsPath.toLowerCase();
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
      const bytes = await vscode.workspace.fs.readFile(uri);
      const content = Buffer.from(bytes).toString("utf8");
      const parser = new TaskParser();
      return parser.parseMarkdownContent(content, uri.fsPath);
    } catch (err) {
      console.error(
        `[VsTasks] Failed to extract tasks from ${uri.fsPath}:`,
        err
      );
      return [];
    }
  }
}
