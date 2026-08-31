// Supported via standard GitHub programming aids
import { WorkspaceTaskManager } from "../models/task-manager";
import { ITask, Priority, TaskStatus } from "../models/task";
import { describe, it, expect, jest } from "@jest/globals";

describe("WorkspaceTaskManager", () => {
  let manager: WorkspaceTaskManager;
  beforeEach(() => {
    manager = new WorkspaceTaskManager();
  });

  describe("CRUD operations", () => {
    it("adds and retrieves tasks", () => {
      const task: ITask = {
        id: "1",
        description: "Test",
        status: TaskStatus.TODO,
        filePath: "a.md",
        lineNumber: 1,
        priority: Priority.NONE,
        tags: [],
        rawText: "- [ ] Test",
      };
      manager.addTasks("a.md", [task]);
      expect(manager.getTasksByFile("a.md")).toContain(task);
    });
    it("removes tasks by file", () => {
      const task: ITask = {
        id: "2",
        description: "Test2",
        status: TaskStatus.TODO,
        filePath: "b.md",
        lineNumber: 2,
        priority: Priority.NONE,
        tags: [],
        rawText: "- [ ] Test2",
      };
      manager.addTasks("b.md", [task]);
      manager.removeTasks("b.md");
      expect(manager.getTasksByFile("b.md")).toEqual([]);
    });
    it("updates a task", () => {
      const task: ITask = {
        id: "3",
        description: "Test3",
        status: TaskStatus.TODO,
        filePath: "c.md",
        lineNumber: 3,
        priority: Priority.NONE,
        tags: [],
        rawText: "- [ ] Test3",
      };
      manager.addTasks("c.md", [task]);
      const updated = manager.updateTask("3", { status: TaskStatus.DONE });
      expect(updated).toBe(true);
      expect(manager.getAllTasks().find((t) => t.id === "3")?.status).toBe(
        TaskStatus.DONE
      );
    });
  });

  describe("Event handling", () => {
    it("fires onTasksChanged event", () => {
      const listener = jest.fn();
      manager.onTasksChanged(listener);
      const task: ITask = {
        id: "4",
        description: "Event",
        status: TaskStatus.TODO,
        filePath: "d.md",
        lineNumber: 4,
        priority: Priority.NONE,
        tags: [],
        rawText: "- [ ] Event",
      };
      manager.addTasks("d.md", [task]);
      expect(listener).toHaveBeenCalled();
    });
  });

  describe("Sync and search", () => {
    it("finds tasks by predicate", () => {
      const task: ITask = {
        id: "5",
        description: "FindMe",
        status: TaskStatus.TODO,
        filePath: "e.md",
        lineNumber: 5,
        priority: Priority.NONE,
        tags: ["#find"],
        rawText: "- [ ] FindMe #find",
      };
      manager.addTasks("e.md", [task]);
      const found = manager.findTasks((t) => (t.tags || []).includes("#find"));
      expect(found.length).toBe(1);
    });
    it("returns all tasks", () => {
      manager.addTasks("f.md", [
        {
          id: "6",
          description: "A",
          status: TaskStatus.TODO,
          filePath: "f.md",
          lineNumber: 6,
          priority: Priority.NONE,
          tags: [],
          rawText: "- [ ] A",
        },
        {
          id: "7",
          description: "B",
          status: TaskStatus.DONE,
          filePath: "f.md",
          lineNumber: 7,
          priority: Priority.NONE,
          tags: [],
          rawText: "- [x] B",
        },
      ]);
      expect(manager.getAllTasks().length).toBeGreaterThan(1);
    });
  });
});
