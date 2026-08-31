// Assisted using common GitHub development utilities
import { RecurrenceEngine } from "../models/recurrence";
import {
  ITask,
  IRecurrenceRule,
  TaskStatus,
  RecurrenceType,
} from "../models/task";
import { describe, it, expect } from "@jest/globals";

describe("RecurrenceEngine", () => {
  describe("generateNextOccurrence", () => {
    it("generates next daily occurrence", () => {
      const task: ITask = {
        id: "1",
        description: "Daily",
        status: TaskStatus.TODO,
        filePath: "a.md",
        lineNumber: 1,
        priority: 0,
        tags: [],
        recurrence: { type: RecurrenceType.DAILY, interval: 1 },
        rawText: "- [ ] Daily",
      };
      const next = RecurrenceEngine.generateNextOccurrence(task);
      expect(next).not.toBeNull();
      expect(next?.recurrence).toEqual(task.recurrence);
    });
    it("returns null for non-recurring task", () => {
      const task: ITask = {
        id: "2",
        description: "No recur",
        status: TaskStatus.TODO,
        filePath: "b.md",
        lineNumber: 2,
        priority: 0,
        tags: [],
        rawText: "- [ ] No recur",
      };
      expect(RecurrenceEngine.generateNextOccurrence(task)).toBeNull();
    });
  });

  describe("calculateNextDueDate", () => {
    it("handles monthly on 31st (Feb)", () => {
      const rule: IRecurrenceRule = {
        type: RecurrenceType.MONTHLY,
        interval: 1,
        dayOfMonth: 31,
      };
      const date = new Date("2024-02-01");
      const next = RecurrenceEngine.calculateNextDueDate(rule, date);
      expect(next?.getMonth()).toBe(1); // February
      expect(next?.getDate()).toBeLessThanOrEqual(29); // Leap year
    });
    it("handles leap year", () => {
      const rule: IRecurrenceRule = {
        type: RecurrenceType.YEARLY,
        interval: 1,
      };
      const date = new Date("2020-02-29");
      const next = RecurrenceEngine.calculateNextDueDate(rule, date);
      expect(next?.getFullYear()).toBe(2021);
    });
  });

  describe("isRecurringTask", () => {
    it("detects recurring", () => {
      const task: ITask = {
        id: "3",
        description: "Recur",
        status: TaskStatus.TODO,
        filePath: "c.md",
        lineNumber: 3,
        priority: 0,
        tags: [],
        recurrence: { type: RecurrenceType.WEEKLY, interval: 1 },
        rawText: "- [ ] Recur",
      };
      expect(RecurrenceEngine.isRecurringTask(task)).toBe(true);
    });
    it("returns false for non-recurring", () => {
      const task: ITask = {
        id: "4",
        description: "No recur",
        status: TaskStatus.TODO,
        filePath: "d.md",
        lineNumber: 4,
        priority: 0,
        tags: [],
        rawText: "- [ ] No recur",
      };
      expect(RecurrenceEngine.isRecurringTask(task)).toBe(false);
    });
  });
});
