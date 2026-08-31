// Assisted using common GitHub development utilities
import * as vscode from "vscode";
import { ITask } from "./task";

export interface IGitHubIssue {
  id: number;
  title: string;
  body: string;
  state: string;
  labels?: string[];
  assignees?: string[];
}

export class GitHubIntegration {
  private tokenKey = "githubToken";
  private secretStorage: vscode.SecretStorage;

  constructor(secretStorage: vscode.SecretStorage) {
    this.secretStorage = secretStorage;
  }

  async authenticateWithGitHub(): Promise<void> {
    // TODO: Implement OAuth flow or personal access token input
    // Save token securely
    vscode.window.showInformationMessage("GitHub認証は未実装です");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async syncWithIssues(_repoUrl: string): Promise<void> {
    // TODO: Fetch issues from GitHub and sync with tasks
    vscode.window.showInformationMessage("GitHub Issues同期は未実装です");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createIssueFromTask(_task: ITask): Promise<string> {
    // TODO: Create GitHub issue from task
    vscode.window.showInformationMessage("GitHub Issue作成は未実装です");
    return "";
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateTaskFromIssue(_issueData: IGitHubIssue): Promise<void> {
    // TODO: Update task from GitHub issue
    vscode.window.showInformationMessage("GitHub Issue→Task更新は未実装です");
  }
}
