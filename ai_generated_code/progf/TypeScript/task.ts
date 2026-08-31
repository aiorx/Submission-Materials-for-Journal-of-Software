// Supported via standard GitHub programming aids
/**
 * Represents the status of a task.
 */
export enum TaskStatus {
  TODO = "todo",
  DONE = "done",
  CANCELLED = "cancelled",
  IN_PROGRESS = "in_progress",
}

/**
 * Represents the priority of a task.
 */
export enum Priority {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  HIGHEST = 4,
}

/**
 * Represents the recurrence type of a task.
 */
export enum RecurrenceType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
  CUSTOM = "custom",
}

/**
 * Represents a rule for task recurrence.
 */
export interface IRecurrenceRule {
  /**
   * The type of recurrence.
   */
  type: RecurrenceType;

  /**
   * The interval of recurrence.
   */
  interval: number;

  /**
   * Days of the week (0 = Sunday, 6 = Saturday).
   */
  daysOfWeek?: number[];

  /**
   * Day of the month.
   */
  dayOfMonth?: number;

  /**
   * End date of recurrence.
   */
  endDate?: Date;

  /**
   * Maximum number of occurrences.
   */
  maxOccurrences?: number;

  /**
   * Whether to skip weekends.
   */
  skipWeekends?: boolean;
}

/**
 * Represents a task in a markdown file.
 */
export interface ITask {
  /**
   * Unique identifier for the task.
   */
  id: string;

  /**
   * Task description.
   */
  description: string;

  /**
   * Status of the task.
   */
  status: TaskStatus;

  /**
   * Path to the file containing the task.
   */
  filePath: string;

  /**
   * Line number where the task is located.
   */
  lineNumber: number;

  /**
   * Due date of the task.
   */
  dueDate?: Date;

  /**
   * Scheduled date of the task.
   */
  scheduledDate?: Date;

  /**
   * Date when the task was completed.
   */
  completedDate?: Date;

  /**
   * Priority of the task.
   */
  priority?: Priority;

  /**
   * Tags associated with the task.
   */
  tags?: string[];

  /**
   * Recurrence rule for the task.
   */
  recurrence?: IRecurrenceRule;

  /**
   * Raw text of the task line.
   */
  rawText: string;
}

/**
 * Represents a filter condition for task queries.
 */
export interface ITaskFilter {
  field: keyof ITask | string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "before"
    | "after"
    | "greater_than"
    | "less_than";
  /**
   * Value to compare against. Type depends on the field and operator.
   */
  value: unknown;
}

/**
 * Represents a sort specification for task queries.
 */
export interface ITaskSort {
  field: keyof ITask | string;
  direction: "asc" | "desc";
}

/**
 * Represents a grouping specification for task queries.
 */
export interface ITaskGroup {
  field: keyof ITask | string;
}

/**
 * Represents a query for tasks.
 */
export interface ITaskQuery {
  /**
   * Filters to apply to tasks.
   */
  filters?: ITaskFilter[];

  /**
   * Sorting to apply to tasks.
   */
  sorting?: ITaskSort[];

  /**
   * Grouping to apply to tasks.
   */
  grouping?: ITaskGroup[];

  /**
   * Limit the number of results.
   */
  limit?: number;
}

/**
 * Interface for managing tasks across the workspace.
 * Provides CRUD operations, in-memory cache, and event notification.
 * @see Obsidian Tasks for reference functionality.
 * @remarks
 * Interface name uses 'I' prefix for consistency.
 */
export interface IWorkspaceTaskManager {
  /**
   * Add tasks for a file.
   * @param filePath Path to the file
   * @param tasks Array of tasks to add
   */
  addTasks(filePath: string, tasks: ITask[]): void;

  /**
   * Remove all tasks for a file.
   * @param filePath Path to the file
   */
  removeTasks(filePath: string): void;

  /**
   * Update a task.
   * @param taskId ID of the task to update
   * @param updates Partial task object with updates
   * @returns true if the task was updated, false otherwise
   */
  updateTask(taskId: string, updates: Partial<ITask>): boolean;

  /**
   * Get all tasks across all files.
   * @returns Array of all tasks
   */
  getAllTasks(): ITask[];

  /**
   * Get tasks for a specific file.
   * @param filePath Path to the file
   * @returns Array of tasks in the file
   */
  getTasksByFile(filePath: string): ITask[];

  /**
   * Find tasks that match a predicate.
   * @param predicate Function that returns true for matching tasks
   * @returns Array of matching tasks
   */
  findTasks(predicate: (task: ITask) => boolean): ITask[];

  /**
   * Event that fires when tasks change.
   */
  onDidTasksChange: import('vscode').Event<{
    added?: ITask[];
    removed?: ITask[];
    updated?: ITask[];
  }>;
}
