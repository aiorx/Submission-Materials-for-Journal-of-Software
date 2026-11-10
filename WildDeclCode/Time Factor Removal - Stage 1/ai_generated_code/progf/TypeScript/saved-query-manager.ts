// Assisted using common GitHub development utilities
var vscode = require('vscode');

export interface ISavedQuery {
  id: string;
  label: string;
  query: string;
}

class SavedQueryManager {
  private static readonly STORAGE_KEY = "vstasks.savedQueries";
  private context: vscode.ExtensionContext;
  private queries: ISavedQuery[] = [];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.queries = this.loadQueries();
  }

  private loadQueries(): ISavedQuery[] {
    return (
      this.context.workspaceState.get<ISavedQuery[]>(
        SavedQueryManager.STORAGE_KEY
      ) || []
    );
  }

  private saveQueries(): void {
    this.context.workspaceState.update(
      SavedQueryManager.STORAGE_KEY,
      this.queries
    );
  }

  public getAll(): ISavedQuery[] {
    return this.queries;
  }

  public add(query: ISavedQuery): void {
    this.queries.push(query);
    this.saveQueries();
  }

  public update(id: string, update: Partial<ISavedQuery>): void {
    var idx = this.queries.findIndex(function (q) { return q.id === id; });
    if (idx !== -1) {
      this.queries[idx] = { ...this.queries[idx], ...update };
      this.saveQueries();
    }
  }

  public remove(id: string): void {
    this.queries = this.queries.filter(function (q) { return q.id !== id; });
    this.saveQueries();
  }
}
