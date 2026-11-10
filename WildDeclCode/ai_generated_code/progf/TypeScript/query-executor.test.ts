// Supported via standard GitHub programming aids
// Tests for QueryExecutor, DateResolver
import { QueryExecutor, DateResolver, IQueryResult } from "./query-executor";
import { IQueryNode } from "./query-parser";
import { ITask, TaskStatus } from "./task";
import { expect } from "chai";

describe("QueryExecutor", () => {
  const tasks: ITask[] = [
    {
      id: "1",
      description: "Task 1",
      status: TaskStatus.TODO,
      filePath: "file1.md",
      lineNumber: 1,
      dueDate: new Date("2025-05-27"),
      priority: 2,
      tags: ["#work"],
      rawText: "- [ ] Task 1 #work",
    },
    {
      id: "2",
      description: "Task 2",
      status: TaskStatus.DONE,
      filePath: "file2.md",
      lineNumber: 2,
      dueDate: new Date("2025-05-25"),
      priority: 1,
      tags: ["#home"],
      rawText: "- [x] Task 2 #home",
    },
  ];

  it("filters by due before tomorrow", () => {
    const query: IQueryNode = {
      type: "Query",
      filters: [
        {
          type: "Filter",
          expression: {
            type: "Comparison",
            field: "due",
            operator: "before",
            value: "tomorrow",
          },
        },
      ],
    };
    const executor = new QueryExecutor(tasks);
    const result: IQueryResult = executor.executeQuery(query);
    expect(result.tasks.length).to.equal(1);
    expect(result.tasks[0].id).to.equal("2");
  });

  it("filters by tag contains #work", () => {
    const query: IQueryNode = {
      type: "Query",
      filters: [
        {
          type: "Filter",
          expression: { type: "Contains", field: "tag", value: "#work" },
        },
      ],
    };
    const executor = new QueryExecutor(tasks);
    const result: IQueryResult = executor.executeQuery(query);
    expect(result.tasks.length).to.equal(1);
    expect(result.tasks[0].id).to.equal("1");
  });

  it("filters by done", () => {
    const query: IQueryNode = {
      type: "Query",
      filters: [
        { type: "Filter", expression: { type: "Value", value: "done" } },
      ],
    };
    const executor = new QueryExecutor(tasks);
    const result: IQueryResult = executor.executeQuery(query);
    expect(result.tasks.length).to.equal(1);
    expect(result.tasks[0].id).to.equal("2");
  });

  it("sorts by priority reverse", () => {
    const query: IQueryNode = {
      type: "Query",
      filters: [],
      sort: { type: "Sort", field: "priority", reverse: true },
    };
    const executor = new QueryExecutor(tasks);
    const result: IQueryResult = executor.executeQuery(query);
    expect(result.tasks[0].id).to.equal("1");
    expect(result.tasks[1].id).to.equal("2");
  });

  it("groups by status", () => {
    const query: IQueryNode = {
      type: "Query",
      filters: [],
      group: { type: "Group", field: "status" },
    };
    const executor = new QueryExecutor(tasks);
    const result: IQueryResult = executor.executeQuery(query);
    expect(result.groupedTasks).to.not.be.undefined;
    expect(Object.keys(result.groupedTasks!)).to.contain("todo");
    expect(Object.keys(result.groupedTasks!)).to.contain("done");
  });

  it("limits results", () => {
    const query: IQueryNode = {
      type: "Query",
      filters: [],
      limit: { type: "Limit", count: 1 },
    };
    const executor = new QueryExecutor(tasks);
    const result: IQueryResult = executor.executeQuery(query);
    expect(result.tasks.length).to.equal(1);
  });
});

describe("DateResolver", () => {
  it("resolves today", () => {
    expect(DateResolver.resolve("today")?.toISOString()).to.equal(
      new Date("2025-05-26T00:00:00").toISOString()
    );
  });
  it("resolves tomorrow", () => {
    expect(DateResolver.resolve("tomorrow")?.toISOString()).to.equal(
      new Date("2025-05-27T00:00:00").toISOString()
    );
  });
  it("resolves ISO date", () => {
    expect(DateResolver.resolve("2025-05-28")?.toISOString()).to.equal(
      new Date("2025-05-28T00:00:00").toISOString()
    );
  });
});
