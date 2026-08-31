// Supported via standard GitHub programming aids
import * as vscode from "vscode";
import {
  ITask,
  Priority,
  RecurrenceType,
  IRecurrenceRule,
  TaskStatus,
} from "../models/task";

export class TaskQuickPickItem implements vscode.QuickPickItem {
  label: string;
  description?: string;
  detail?: string;
  task: ITask;
  constructor(task: ITask) {
    this.task = task;
    this.label = task.description;
    this.description = `Status: ${task.status}`;
    this.detail = `Due: ${
      task.dueDate ? task.dueDate.toLocaleDateString() : "未設定"
    } | Priority: ${task.priority ?? "未設定"} | Tags: ${(task.tags || []).join(
      ", "
    )}`;
  }
}

export class TaskInputValidator {
  static validateDescription(description: string): string | undefined {
    if (!description || description.trim().length === 0) {
      return "説明は必須です";
    }
    return undefined;
  }
  static validateDate(dateStr: string): Date | undefined {
    if (!dateStr) {
      return undefined;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return undefined;
    }
    return d;
  }
  static validatePriority(priorityStr: string): Priority | undefined {
    const map: Record<string, Priority> = {
      なし: Priority.NONE,
      低: Priority.LOW,
      中: Priority.MEDIUM,
      高: Priority.HIGH,
      最高: Priority.HIGHEST,
      "0": Priority.NONE,
      "1": Priority.LOW,
      "2": Priority.MEDIUM,
      "3": Priority.HIGH,
      "4": Priority.HIGHEST,
    };
    return map[priorityStr] ?? undefined;
  }
  static validateTags(tagsStr: string): string[] {
    if (!tagsStr) {
      return [];
    }
    return tagsStr
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }
}

export class QuickPickFlow {
  static async stepDescription(init?: string): Promise<string> {
    return (
      (await vscode.window.showInputBox({
        prompt: "タスクの説明を入力してください",
        value: init,
        validateInput: TaskInputValidator.validateDescription,
        ignoreFocusOut: true,
      })) ?? ""
    );
  }
  static async stepDueDate(init?: Date): Promise<Date | undefined> {
    const val = await vscode.window.showInputBox({
      prompt: "期日を入力してください (例: 2025-05-26)",
      value: init ? init.toISOString().slice(0, 10) : "",
      ignoreFocusOut: true,
      placeHolder: "YYYY-MM-DD",
    });
    return TaskInputValidator.validateDate(val ?? "");
  }
  static async stepPriority(): Promise<Priority> {
    const items = [
      { label: "なし", value: Priority.NONE },
      { label: "低", value: Priority.LOW },
      { label: "中", value: Priority.MEDIUM },
      { label: "高", value: Priority.HIGH },
      { label: "最高", value: Priority.HIGHEST },
    ];
    const picked = await vscode.window.showQuickPick(items, {
      placeHolder: "優先度を選択してください",
      ignoreFocusOut: true,
    });
    return picked?.value ?? Priority.NONE;
  }
  static async stepTags(): Promise<string[]> {
    const val = await vscode.window.showInputBox({
      prompt: "タグをカンマ区切りで入力してください",
      value: "",
      ignoreFocusOut: true,
      placeHolder: "#work, #home",
    });
    return TaskInputValidator.validateTags(val ?? "");
  }
  static async stepRecurrence(): Promise<IRecurrenceRule | undefined> {
    const recur = await vscode.window.showQuickPick(
      [
        { label: "なし", value: undefined },
        { label: "毎日", value: { type: RecurrenceType.DAILY, interval: 1 } },
        { label: "毎週", value: { type: RecurrenceType.WEEKLY, interval: 1 } },
        { label: "毎月", value: { type: RecurrenceType.MONTHLY, interval: 1 } },
        { label: "毎年", value: { type: RecurrenceType.YEARLY, interval: 1 } },
      ],
      {
        placeHolder: "繰り返しルールを選択してください",
        ignoreFocusOut: true,
      }
    );
    return recur?.value;
  }
}

export class TaskEditor {
  static async showCreateDialog(): Promise<ITask | undefined> {
    const description = await QuickPickFlow.stepDescription();
    if (!description) {
      return undefined;
    }
    const dueDate = await QuickPickFlow.stepDueDate();
    const priority = await QuickPickFlow.stepPriority();
    const tags = await QuickPickFlow.stepTags();
    const recurrence = await QuickPickFlow.stepRecurrence();
    return {
      id: "", // IDは後で付与
      description,
      status: TaskStatus.TODO,
      filePath: "",
      lineNumber: 0,
      dueDate,
      priority,
      tags,
      recurrence,
      rawText: "",
    };
  }
  static async showEditDialog(task: ITask): Promise<ITask | undefined> {
    // インライン表現を除去したタイトルのみを抽出
    const pureTitle = TaskEditor.extractPureTitle(task.description);
    const description = await QuickPickFlow.stepDescription(pureTitle);
    if (!description) {
      return undefined;
    }
    const dueDate = await QuickPickFlow.stepDueDate(task.dueDate);
    const priority = await QuickPickFlow.stepPriority();
    const tags = await QuickPickFlow.stepTags();
    const recurrence = await QuickPickFlow.stepRecurrence();
    return {
      ...task,
      description,
      dueDate,
      priority,
      tags,
      recurrence,
    };
  }

  /**
   * descriptionからインライン表現（⏫, ⏳, 📅, #, 🔁 など）を除去し純粋なタイトルのみ返す
   */
  static extractPureTitle(description: string): string {
    // 絵文字やタグ、日付、優先度、繰り返し等を除去
    return description
      .replace(/(📅|⏳|⏫|🔁)\s*[^\s#]+/g, "") // 絵文字+値
      .replace(/#[^\s]+/g, "") // タグ
      .replace(/\s+/g, " ") // 余分な空白
      .trim();
  }

  static async showQuickPick<T>(
    items: Array<vscode.QuickPickItem & { value: T }>,
    options: vscode.QuickPickOptions
  ): Promise<T | undefined> {
    const picked = await vscode.window.showQuickPick(items, options);
    return picked && "value" in picked
      ? (picked as { value: T }).value
      : undefined;
  }
}
