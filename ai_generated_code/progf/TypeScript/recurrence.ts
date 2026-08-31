// Assisted using common GitHub development utilities
import { ITask, IRecurrenceRule, RecurrenceType, TaskStatus } from "./task";

export interface ITaskOccurrence {
  originalTaskId: string;
  generatedDate: Date;
  dueDate: Date;
  completedDate?: Date;
  skipped: boolean;
}

export class RecurrenceEngine {
  /**
   * Returns true if the task has a valid recurrence rule.
   */
  public static isRecurringTask(task: ITask): boolean {
    return !!task.recurrence && !!task.dueDate;
  }

  /**
   * Returns true if a new occurrence should be generated (e.g. task is done and not past endDate/maxOccurrences).
   */
  public static shouldGenerateNext(task: ITask): boolean {
    if (!this.isRecurringTask(task)) {
      return false;
    }
    const rule = task.recurrence!;
    if (rule.endDate && task.dueDate && task.dueDate >= rule.endDate) {
      return false;
    }
    if (rule.maxOccurrences && rule.maxOccurrences <= 0) {
      return false;
    }
    return task.status === "done";
  }

  /**
   * Generate the next occurrence of a recurring task, or null if not possible.
   */
  public static generateNextOccurrence(task: ITask): ITask | null {
    if (!this.shouldGenerateNext(task)) {
      return null;
    }
    const rule = task.recurrence!;
    const nextDue = this.calculateNextDueDate(rule, task.dueDate!);
    if (!nextDue) {
      return null;
    }
    // Decrement maxOccurrences if set
    const nextRule = { ...rule };
    if (nextRule.maxOccurrences && nextRule.maxOccurrences > 0) {
      nextRule.maxOccurrences = nextRule.maxOccurrences - 1;
    }
    // Copy task, update dueDate, status, completedDate, etc.
    return {
      ...task,
      // Assisted using common GitHub development utilities
      id: undefined as unknown as string, // Should be replaced with a new unique ID by the caller
      status: TaskStatus.TODO,
      dueDate: nextDue,
      completedDate: undefined,
      recurrence: nextRule,
    };
  }

  /**
   * Calculate the next due date for a recurrence rule.
   */
  public static calculateNextDueDate(
    rule: IRecurrenceRule,
    currentDate: Date
  ): Date | null {
    const base = new Date(currentDate);
    switch (rule.type) {
      case RecurrenceType.DAILY: {
        const days = rule.interval || 1;
        const next = new Date(base);
        do {
          next.setDate(next.getDate() + days);
        } while (
          rule.skipWeekends &&
          (next.getDay() === 0 || next.getDay() === 6)
        );
        if (rule.endDate && next > rule.endDate) {
          return null;
        }
        return next;
      }
      case RecurrenceType.WEEKLY: {
        const next = new Date(base);
        const days = rule.interval ? rule.interval * 7 : 7;
        next.setDate(next.getDate() + days);
        if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
          // Find the next matching weekday
          let found = false;
          for (let i = 1; i <= 7; i++) {
            next.setDate(base.getDate() + i);
            if (rule.daysOfWeek.includes(next.getDay())) {
              found = true;
              break;
            }
          }
          if (!found) {
            return null;
          }
        }
        if (rule.endDate && next > rule.endDate) {
          return null;
        }
        return next;
      }
      case RecurrenceType.MONTHLY: {
        const next = new Date(base);
        next.setMonth(next.getMonth() + (rule.interval || 1));
        if (rule.dayOfMonth) {
          next.setDate(rule.dayOfMonth);
        }
        if (rule.endDate && next > rule.endDate) {
          return null;
        }
        return next;
      }
      case RecurrenceType.YEARLY: {
        const next = new Date(base);
        next.setFullYear(next.getFullYear() + (rule.interval || 1));
        if (rule.endDate && next > rule.endDate) {
          return null;
        }
        return next;
      }
      case RecurrenceType.CUSTOM: {
        const next = new Date(base);
        next.setDate(next.getDate() + (rule.interval || 1));
        if (rule.endDate && next > rule.endDate) {
          return null;
        }
        return next;
      }
      default:
        return null;
    }
  }

  /**
   * Try to parse a natural language recurrence string (e.g. "every 2 weeks", "monthly on the 15th").
   */
  public static parseNaturalRecurrence(text: string): IRecurrenceRule | null {
    // Simple patterns, can be extended
    const daily = /every\s+(\d+)?\s*day/i.exec(text);
    if (daily) {
      return {
        type: RecurrenceType.DAILY,
        interval: parseInt(daily[1] || "1"),
      };
    }
    const weekly = /every\s+(\d+)?\s*week/i.exec(text);
    if (weekly) {
      return {
        type: RecurrenceType.WEEKLY,
        interval: parseInt(weekly[1] || "1"),
      };
    }
    const monthly = /monthly(?:\s+on\s+(\d+))?/i.exec(text);
    if (monthly) {
      return {
        type: RecurrenceType.MONTHLY,
        interval: 1,
        dayOfMonth: monthly[1] ? parseInt(monthly[1]) : undefined,
      };
    }
    const yearly = /every\s+(\d+)?\s*year/i.exec(text);
    if (yearly) {
      return {
        type: RecurrenceType.YEARLY,
        interval: parseInt(yearly[1] || "1"),
      };
    }
    // Add more patterns as needed
    return null;
  }
}

export class RecurrenceHistory {
  private static history: Map<string, ITaskOccurrence[]> = new Map();

  public static addOccurrence(
    taskId: string,
    occurrence: ITaskOccurrence
  ): void {
    if (!this.history.has(taskId)) {
      this.history.set(taskId, []);
    }
    this.history.get(taskId)!.push(occurrence);
  }

  public static getHistory(taskId: string): ITaskOccurrence[] {
    return this.history.get(taskId) || [];
  }

  public static removeHistory(taskId: string): void {
    this.history.delete(taskId);
  }
}

export class RecurrenceScheduler {
  private intervalId: NodeJS.Timeout | undefined;
  private running = false;
  private readonly checkIntervalMs = 60 * 1000; // 1分ごと

  public startScheduler(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.intervalId = setInterval(
      () => this.checkPendingRecurrences(),
      this.checkIntervalMs
    );
  }

  public stopScheduler(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.running = false;
  }

  public checkPendingRecurrences(): void {
    // TODO: タスク一覧を取得し、完了済みで次回発生が必要なものを検出
    // 例: WorkspaceTaskManager.getAllTasks() など
    // for (const task of allTasks) { ... }
  }

  public generateDueRecurrences(): void {
    // TODO: 必要に応じて新しいタスクを生成し、タスク管理に追加
  }
}
