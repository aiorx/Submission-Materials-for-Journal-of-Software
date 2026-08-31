// Supported via standard GitHub programming aids
import {
  ITask,
  TaskStatus,
  Priority,
  IRecurrenceRule,
  RecurrenceType,
} from "./task";
import { v4 as uuidv4 } from "uuid";

/**
 * Class responsible for parsing markdown content and extracting tasks.
 */
export class TaskParser {
  /**
   * Regular expression to match task items in markdown.
   * Matches both - [ ] and - [x] formats.
   */
  private static readonly TASK_REGEX = /^(\s*)[-*+]\s+\[([ xX])\]\s+(.+)$/;

  /**
   * Regular expression to match due date in task description.
   * Format: 📅 YYYY-MM-DD
   */
  private static readonly DUE_DATE_REGEX = /📅\s*(\d{4}-\d{2}-\d{2})/;

  /**
   * Regular expression to match scheduled date in task description.
   * Format: ⏳ YYYY-MM-DD
   */
  private static readonly SCHEDULED_DATE_REGEX = /⏳\s*(\d{4}-\d{2}-\d{2})/;

  /**
   * Regular expression to match completed date in task description.
   * Format: ✅ YYYY-MM-DD
   */
  private static readonly COMPLETED_DATE_REGEX = /✅\s*(\d{4}-\d{2}-\d{2})/;

  /**
   * Regular expression to match priority markers.
   * 4️⃣ = highest, 3️⃣ = high, 2️⃣ = medium, 1️⃣ = low
   */
  private static readonly PRIORITY_REGEX = /(1️⃣|2️⃣|3️⃣|4️⃣)/;

  /**
   * Regular expression to match tags.
   * Format: #tag
   */
  private static readonly TAG_REGEX = /#([a-zA-Z0-9_-]+)/g;

  /**
   * Regular expression to match recurrence rules.
   * Format: 🔁 every day/week/month/year
   */
  private static readonly RECURRENCE_REGEX =
    /🔁\s+(every\s+(\d+)?\s*(day|week|month|year)s?)/i;

  /**
   * Parse markdown content and extract tasks.
   *
   * @param content The markdown content to parse
   * @param filePath The path to the file being parsed
   * @returns Array of parsed tasks
   */
  public parseMarkdownContent(content: string, filePath: string): ITask[] {
    const lines = content.split("\n");
    const tasks: ITask[] = [];

    for (let i = 0; i < lines.length; i++) {
      const task = this.parseLine(lines[i], i, filePath);
      if (task) {
        tasks.push(task);
      }
    }

    return tasks;
  }

  /**
   * Parse a single line and extract a task if present.
   *
   * @param line The line to parse
   * @param lineNumber The line number in the file
   * @param filePath The path to the file being parsed
   * @returns A task object if the line contains a task, null otherwise
   */
  public parseLine(
    line: string,
    lineNumber: number,
    filePath: string
  ): ITask | null {
    const match = TaskParser.TASK_REGEX.exec(line);
    if (!match) {
      return null;
    }

    const status = match[2] === " " ? TaskStatus.TODO : TaskStatus.DONE;
    const description = match[3];

    const task: ITask = {
      id: uuidv4(),
      description: description,
      status,
      filePath,
      lineNumber,
      rawText: line,
      ...this.extractDates(description),
      priority: this.extractPriority(description),
      tags: this.extractTags(description),
      recurrence: this.extractRecurrence(description),
    };

    return task;
  }

  /**
   * Extract dates from task description.
   *
   * @param text The task description
   * @returns Object containing due, scheduled, and completed dates
   */
  public extractDates(text: string): {
    dueDate?: Date;
    scheduledDate?: Date;
    completedDate?: Date;
  } {
    const result: {
      dueDate?: Date;
      scheduledDate?: Date;
      completedDate?: Date;
    } = {};

    // Extract due date
    const dueMatch = TaskParser.DUE_DATE_REGEX.exec(text);
    if (dueMatch) {
      result.dueDate = new Date(dueMatch[1]);
    }

    // Extract scheduled date
    const scheduledMatch = TaskParser.SCHEDULED_DATE_REGEX.exec(text);
    if (scheduledMatch) {
      result.scheduledDate = new Date(scheduledMatch[1]);
    }

    // Extract completed date
    const completedMatch = TaskParser.COMPLETED_DATE_REGEX.exec(text);
    if (completedMatch) {
      result.completedDate = new Date(completedMatch[1]);
    }

    return result;
  }

  /**
   * Extract priority from task description.
   *
   * @param text The task description
   * @returns The priority level
   * @generated Supported via standard GitHub programming aids
   */
  public extractPriority(text: string): Priority {
    // Always reset lastIndex in case regex is reused
    // Now match 1️⃣ 2️⃣ 3️⃣ 4️⃣ (keycap emoji)
    const match = /(1️⃣|2️⃣|3️⃣|4️⃣)/.exec(text);
    if (!match) {
      return Priority.NONE;
    }
    switch (match[1]) {
      case "1️⃣":
        return Priority.LOW;
      case "2️⃣":
        return Priority.MEDIUM;
      case "3️⃣":
        return Priority.HIGH;
      case "4️⃣":
        return Priority.HIGHEST;
      default:
        return Priority.NONE;
    }
  }

  /**
   * Extract tags from task description.
   *
   * @param text The task description
   * @returns Array of tags (without # prefix, for compatibility with tests)
   * @generated Supported via standard GitHub programming aids
   */
  public extractTags(text: string): string[] {
    const tags: string[] = [];
    let match;
    // Use a global regex to match all #tags (must start with # and at least one letter)
    const regex = /(^|\s)#([a-zA-Z][a-zA-Z0-9_-]*)/g;
    while ((match = regex.exec(text)) !== null) {
      tags.push(match[2]);
    }
    return tags;
  }

  /**
   * Extract recurrence rule from task description.
   *
   * @param text The task description
   * @returns Recurrence rule object or null if no recurrence
   */
  public extractRecurrence(text: string): IRecurrenceRule | undefined {
    const recurrenceMatch = TaskParser.RECURRENCE_REGEX.exec(text);
    if (!recurrenceMatch) {
      return undefined;
    }

    const interval = recurrenceMatch[2] ? parseInt(recurrenceMatch[2]) : 1;
    let type: RecurrenceType;

    switch (recurrenceMatch[3].toLowerCase()) {
      case "day":
        type = RecurrenceType.DAILY;
        break;
      case "week":
        type = RecurrenceType.WEEKLY;
        break;
      case "month":
        type = RecurrenceType.MONTHLY;
        break;
      case "year":
        type = RecurrenceType.YEARLY;
        break;
      default:
        type = RecurrenceType.CUSTOM;
        break;
    }

    return {
      type,
      interval,
    };
  }

  /**
   * ITaskからマークダウン行を生成
   * @param task 編集後のタスク
   * @generated Supported via standard GitHub programming aids
   */
  public static generateTaskLine(task: ITask): string {
    // チェックボックス
    const checkbox = task.status === TaskStatus.DONE ? "[x]" : "[ ]";
    // description から既存のインライン表現（priority, dates, recurrence, completed, タグ）を除去
    let desc = task.description
      .replace(/(1️⃣|2️⃣|3️⃣|4️⃣)/g, "")
      .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, "")
      .replace(/⏳\s*\d{4}-\d{2}-\d{2}/g, "")
      .replace(/🔁/g, "")
      .replace(/✅\s*\d{4}-\d{2}-\d{2}/g, "")
      .replace(/#[a-zA-Z0-9_-]+/g, "") // タグも一旦全て除去（正規表現修正）
      .replace(/\s+/g, " ")
      .trim();
    // priority（1️⃣ 2️⃣ 3️⃣ 4️⃣）
    if (
      typeof task.priority !== "undefined" &&
      task.priority !== null &&
      task.priority !== 0
    ) {
      let priorityEmoji = "";
      switch (task.priority) {
        case Priority.LOW:
          priorityEmoji = "1️⃣";
          break;
        case Priority.MEDIUM:
          priorityEmoji = "2️⃣";
          break;
        case Priority.HIGH:
          priorityEmoji = "3️⃣";
          break;
        case Priority.HIGHEST:
          priorityEmoji = "4️⃣";
          break;
      }
      if (priorityEmoji) {
        desc += ` ${priorityEmoji}`;
      }
    }
    // dueDate（📅）
    if (task.dueDate) {
      desc += ` 📅 ${
        task.dueDate instanceof Date
          ? task.dueDate.toISOString().slice(0, 10)
          : task.dueDate
      }`;
    }
    // scheduledDate（⏳）
    if (task.scheduledDate) {
      desc += ` ⏳ ${
        task.scheduledDate instanceof Date
          ? task.scheduledDate.toISOString().slice(0, 10)
          : task.scheduledDate
      }`;
    }
    // tags（#tag）: 必ずtask.tagsから再構築
    if (task.tags && Array.isArray(task.tags) && task.tags.length > 0) {
      desc +=
        " " + task.tags.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ");
    }
    // recurrence（🔁）
    if (task.recurrence && typeof task.recurrence === "object") {
      desc += " 🔁";
    }
    // completedDate（✅）は必ず1つだけ、statusがDONEのときのみ
    if (task.completedDate && task.status === TaskStatus.DONE) {
      desc += ` ✅ ${
        task.completedDate instanceof Date
          ? task.completedDate.toISOString().slice(0, 10)
          : task.completedDate
      }`;
    }
    return `- ${checkbox} ${desc.trim()}`;
  }
}
