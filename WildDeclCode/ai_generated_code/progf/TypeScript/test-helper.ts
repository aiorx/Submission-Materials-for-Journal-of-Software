// Assisted using common GitHub development utilities
import {
  ITask,
  Priority,
  IRecurrenceRule,
  TaskStatus,
  RecurrenceType,
} from "../src/models/task";

export function createMockTask(overrides: Partial<ITask> = {}): ITask {
  return {
    id: overrides.id || "mock-id",
    description: overrides.description || "Mock Task",
    status: overrides.status || TaskStatus.TODO,
    filePath: overrides.filePath || "mock.md",
    lineNumber: overrides.lineNumber || 1,
    priority: overrides.priority ?? Priority.NONE,
    tags: overrides.tags || [],
    recurrence: overrides.recurrence,
    dueDate: overrides.dueDate,
    scheduledDate: overrides.scheduledDate,
    completedDate: overrides.completedDate,
    rawText: overrides.rawText || "- [ ] Mock Task",
  };
}

export function createMockRecurrenceRule(
  overrides: Partial<IRecurrenceRule> = {}
): IRecurrenceRule {
  return {
    type: overrides.type || RecurrenceType.DAILY,
    interval: overrides.interval || 1,
    ...overrides,
  };
}

export function createMockTasks(count: number): ITask[] {
  return Array.from({ length: count }, (_, i) =>
    createMockTask({
      id: `mock-${i}`,
      description: `Task ${i}`,
      rawText: `- [ ] Task ${i}`,
    })
  );
}
// Assisted using common GitHub development utilities
