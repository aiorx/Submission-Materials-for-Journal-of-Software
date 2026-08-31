// Aided with basic GitHub coding tools
import { Lexer } from "../models/query-lexer";
import { Parser } from "../models/query-parser";
import { QueryExecutor } from "../models/query-executor";
import { WorkspaceTaskManager } from "../models/task-manager";
import { Priority, TaskStatus } from "../models/task";
import { describe, it, expect } from "@jest/globals";

describe("Query Engine", () => {
  describe("Lexer", () => {
    it("tokenizes a simple query", () => {
      const lexer = new Lexer("not done");
      const tokens = [];
      while (lexer.hasNext()) {
        tokens.push(lexer.nextToken());
      }
      expect(tokens.some((t) => t.value === "not")).toBe(true);
      expect(tokens.some((t) => t.value === "done")).toBe(true);
    });
    it("handles dates and tags", () => {
      const lexer = new Lexer("due before 2024-01-01 tag contains #work");
      const tokens = [];
      while (lexer.hasNext()) {
        tokens.push(lexer.nextToken());
      }
      expect(tokens.some((t) => t.value === "2024-01-01")).toBe(true);
      expect(tokens.some((t) => t.value === "#work")).toBe(true);
    });
  });

  describe("Parser", () => {
    it("parses a filter query", () => {
      const lexer = new Lexer("not done");
      const parser = new Parser(lexer);
      const ast = parser.parseQuery();
      expect(ast).toHaveProperty("filters");
    });
    it("throws on invalid syntax", () => {
      const lexer = new Lexer("not not not");
      const parser = new Parser(lexer);
      expect(() => parser.parseQuery()).toThrow();
    });
  });

  describe("QueryExecutor", () => {
    const manager = new WorkspaceTaskManager();
    manager.addTasks("file.md", [
      {
        id: "1",
        description: "Task 1",
        status: TaskStatus.TODO,
        filePath: "file.md",
        lineNumber: 1,
        priority: Priority.HIGH,
        tags: ["#work"],
        rawText: "- [ ] Task 1",
      },
      {
        id: "2",
        description: "Task 2",
        status: TaskStatus.DONE,
        filePath: "file.md",
        lineNumber: 2,
        priority: Priority.LOW,
        tags: ["#home"],
        rawText: "- [x] Task 2",
      },
    ]);
    const executor = new QueryExecutor(manager.getAllTasks());

    it("filters tasks by status", () => {
      const lexer = new Lexer("not done");
      const parser = new Parser(lexer);
      const ast = parser.parseQuery();
      const result = executor.executeQuery(ast);
      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0].status).toBe("todo");
    });
    it("sorts tasks by priority", () => {
      const lexer = new Lexer("sort by priority reverse");
      const parser = new Parser(lexer);
      const ast = parser.parseQuery();
      const result = executor.executeQuery(ast);
      expect(result.tasks[0].priority).toBe(Priority.HIGH);
    });
    it("handles large data sets", () => {
      const manyTasks = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i),
        description: `Task ${i}`,
        status: i % 2 === 0 ? TaskStatus.TODO : TaskStatus.DONE,
        filePath: "file.md",
        lineNumber: i,
        priority: Priority.NONE,
        tags: [],
        rawText: `- [${i % 2 === 0 ? " " : "x"}] Task ${i}`,
      }));
      manager.addTasks("big.md", manyTasks);
      const lexer = new Lexer("not done");
      const parser = new Parser(lexer);
      const ast = parser.parseQuery();
      const result = executor.executeQuery(ast);
      expect(result.tasks.length).toBeGreaterThan(400);
    });
  });
});
