// Aided with basic GitHub coding tools
var Lexer = require('../models/query-lexer').Lexer;
var Parser = require('../models/query-parser').Parser;
var QueryExecutor = require('../models/query-executor').QueryExecutor;
var WorkspaceTaskManager = require('../models/task-manager').WorkspaceTaskManager;
var Priority = require('../models/task').Priority;
var TaskStatus = require('../models/task').TaskStatus;
var describe = require('@jest/globals').describe;
var it = require('@jest/globals').it;
var expect = require('@jest/globals').expect;

describe("Query Engine", function () {
  describe("Lexer", () => {
    it("tokenizes a simple query", () => {
      var lexer = new Lexer("not done");
      var tokens = [];
      while (lexer.hasNext()) {
        tokens.push(lexer.nextToken());
      }
      expect(tokens.some((t) => t.value === "not")).toBe(true);
      expect(tokens.some((t) => t.value === "done")).toBe(true);
    });
    it("handles dates and tags", () => {
      var lexer = new Lexer("due before 2024-01-01 tag contains #work");
      var tokens = [];
      while (lexer.hasNext()) {
        tokens.push(lexer.nextToken());
      }
      expect(tokens.some((t) => t.value === "2024-01-01")).toBe(true);
      expect(tokens.some((t) => t.value === "#work")).toBe(true);
    });
  });

  describe("Parser", () => {
    it("parses a filter query", () => {
      var lexer = new Lexer("not done");
      var parser = new Parser(lexer);
      var ast = parser.parseQuery();
      expect(ast).toHaveProperty("filters");
    });
    it("throws on invalid syntax", () => {
      var lexer = new Lexer("not not not");
      var parser = new Parser(lexer);
      expect(() => parser.parseQuery()).toThrow();
    });
  });

  describe("QueryExecutor", () => {
    var manager = new WorkspaceTaskManager();
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
    var executor = new QueryExecutor(manager.getAllTasks());

    it("filters tasks by status", () => {
      var lexer = new Lexer("not done");
      var parser = new Parser(lexer);
      var ast = parser.parseQuery();
      var result = executor.executeQuery(ast);
      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0].status).toBe("todo");
    });
    it("sorts tasks by priority", () => {
      var lexer = new Lexer("sort by priority reverse");
      var parser = new Parser(lexer);
      var ast = parser.parseQuery();
      var result = executor.executeQuery(ast);
      expect(result.tasks[0].priority).toBe(Priority.HIGH);
    });
    it("handles large data sets", () => {
      var manyTasks = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i),
        description: "Task " + (i) + "",
        status: i % 2 === 0 ? TaskStatus.TODO : TaskStatus.DONE,
        filePath: "file.md",
        lineNumber: i,
        priority: Priority.NONE,
        tags: [],
        rawText: "- [" + (i % 2 === 0 ? " " : "x") + "] Task " + (i) + "",
      }));
      manager.addTasks("big.md", manyTasks);
      var lexer = new Lexer("not done");
      var parser = new Parser(lexer);
      var ast = parser.parseQuery();
      var result = executor.executeQuery(ast);
      expect(result.tasks.length).toBeGreaterThan(400);
    });
  });
});
