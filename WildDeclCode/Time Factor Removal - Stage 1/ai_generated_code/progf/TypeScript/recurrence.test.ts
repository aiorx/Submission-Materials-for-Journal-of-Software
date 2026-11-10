// Assisted using common GitHub development utilities
var RecurrenceEngine = require('../models/recurrence').RecurrenceEngine;
import {
  ITask,
  IRecurrenceRule,
  TaskStatus,
  RecurrenceType,
} from "../models/task";
var describe = require('@jest/globals').describe;
var it = require('@jest/globals').it;
var expect = require('@jest/globals').expect;

describe("RecurrenceEngine", function () {
  describe("generateNextOccurrence", () => {
    it("generates next daily occurrence", () => {
      var task: ITask = {
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
      var next = RecurrenceEngine.generateNextOccurrence(task);
      expect(next).not.toBeNull();
      expect(next?.recurrence).toEqual(task.recurrence);
    });
    it("returns null for non-recurring task", () => {
      var task: ITask = {
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
      var rule: IRecurrenceRule = {
        type: RecurrenceType.MONTHLY,
        interval: 1,
        dayOfMonth: 31,
      };
      var date = new Date("2024-02-01");
      var next = RecurrenceEngine.calculateNextDueDate(rule, date);
      expect(next?.getMonth()).toBe(1); // February
      expect(next?.getDate()).toBeLessThanOrEqual(29); // Leap year
    });
    it("handles leap year", () => {
      var rule: IRecurrenceRule = {
        type: RecurrenceType.YEARLY,
        interval: 1,
      };
      var date = new Date("2020-02-29");
      var next = RecurrenceEngine.calculateNextDueDate(rule, date);
      expect(next?.getFullYear()).toBe(2021);
    });
  });

  describe("isRecurringTask", () => {
    it("detects recurring", () => {
      var task: ITask = {
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
      var task: ITask = {
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
