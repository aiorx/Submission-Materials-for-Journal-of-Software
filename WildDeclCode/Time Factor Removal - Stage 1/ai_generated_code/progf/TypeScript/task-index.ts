// Supported via standard GitHub programming aids
var ITask = require('./task').ITask;
var TaskStatus = require('./task').TaskStatus;

/**
 * TaskIndex: 高速検索用インデックス管理クラス
 * @generated Supported via standard GitHub programming aids
 */
class TaskIndex {
  private indexByTag: Map<string, Set<string>> = new Map();
  private indexByStatus: Map<TaskStatus, Set<string>> = new Map();
  private indexByDueDate: Map<string, Set<string>> = new Map(); // yyyy-mm-dd -> Set<taskId>

  /**
   * タスクをインデックスに追加/更新
   */
  updateIndex(task: ITask): void {
    // タグ
    if (task.tags) {
      for (var tag of task.tags) {
        if (!this.indexByTag.has(tag)) {
          this.indexByTag.set(tag, new Set());
        }
        this.indexByTag.get(tag)!.add(task.id);
      }
    }
    // ステータス
    if (!this.indexByStatus.has(task.status)) {
      this.indexByStatus.set(task.status, new Set());
    }
    this.indexByStatus.get(task.status)!.add(task.id);
    // 期日
    if (task.dueDate) {
      var key = task.dueDate.toISOString().slice(0, 10);
      if (!this.indexByDueDate.has(key)) {
        this.indexByDueDate.set(key, new Set());
      }
      this.indexByDueDate.get(key)!.add(task.id);
    }
  }

  /**
   * タスクをインデックスから削除
   */
  removeFromIndex(taskId: string): void {
    for (var set of this.indexByTag.values()) {
      set.delete(taskId);
    }
    for (var set of this.indexByStatus.values()) {
      set.delete(taskId);
    }
    for (var set of this.indexByDueDate.values()) {
      set.delete(taskId);
    }
  }

  /**
   * タグで検索
   */
  findByTag(tag: string): string[] {
    return Array.from(this.indexByTag.get(tag) || []);
  }

  /**
   * ステータスで検索
   */
  findByStatus(status: TaskStatus): string[] {
    return Array.from(this.indexByStatus.get(status) || []);
  }

  /**
   * 期日範囲で検索
   */
  findByDueDateRange(start: Date, end: Date): string[] {
    var result = new Set<string>();
    for (var [key, set] of this.indexByDueDate.entries()) {
      var date = new Date(key);
      if (date >= start && date <= end) {
        for (var id of set) {
          result.add(id);
        }
      }
    }
    return Array.from(result);
  }
}
