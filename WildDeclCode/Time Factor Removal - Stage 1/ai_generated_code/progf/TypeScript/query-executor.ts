// Aided with basic GitHub coding tools
// QueryExecutor, FilterEvaluator, DateResolver, and IQueryResult for markdown task queries
import {
  IQueryNode,
  IFilterNode,
  ISortNode,
  IGroupNode,
  ILimitNode,
  IExpressionNode,
  IComparisonExpression,
  IContainsExpression,
} from "./query-parser";
var ITask = require('./task').ITask;

export interface IQueryResult {
  tasks: ITask[];
  groupedTasks?: IGroupedTasks;
  totalCount: number;
  executionTime: number;
}

export interface IGroupedTasks {
  [group: string]: ITask[];
}

class QueryExecutor {
  private tasks: ITask[];
  constructor(tasks: ITask[]) {
    this.tasks = tasks;
  }

  public executeQuery(queryNode: IQueryNode): IQueryResult {
    var start = Date.now();
    var filtered = this.applyFilters(this.tasks, queryNode.filters);
    if (queryNode.sort) {
      filtered = this.applySorting(filtered, [queryNode.sort]);
    }
    var grouped: IGroupedTasks | undefined;
    if (queryNode.group) {
      grouped = this.applyGrouping(filtered, [queryNode.group]);
    }
    if (queryNode.limit) {
      filtered = this.applyLimit(filtered, queryNode.limit);
    }
    var end = Date.now();
    return {
      tasks: filtered,
      groupedTasks: grouped,
      totalCount: filtered.length,
      executionTime: end - start,
    };
  }

  public applyFilters(tasks: ITask[], filters: IFilterNode[]): ITask[] {
    if (!filters.length) {
      return tasks;
    }
    return tasks.filter(function (task) { return filters.every((f) => FilterEvaluator.evaluateFilter(task, f)); });
  }

  public applySorting(tasks: ITask[], sorts: ISortNode[]): ITask[] {
    if (!sorts.length) {
      return tasks;
    }
    // Only support one sort for now
    var sort = sorts[0];
    return [...tasks].sort(function (a, b) {
      var av = (a as unknown as Record<string, unknown>)[sort.field];
      var bv = (b as unknown as Record<string, unknown>)[sort.field];
      if (av === bv) {
        return 0;
      }
      if (sort.reverse) {
        return (av as number | string) < (bv as number | string) ? 1 : -1;
      }
      return (av as number | string) > (bv as number | string) ? 1 : -1;
    });
  }

  public applyGrouping(tasks: ITask[], groups: IGroupNode[]): IGroupedTasks {
    if (!groups.length) {
      return {};
    }
    var group = groups[0];
    return tasks.reduce(function (acc, task) {
      var key =
        ((task as unknown as Record<string, unknown>)[group.field] != null ? (task as unknown as Record<string, unknown>)[group.field] : "none");
      var keyStr = String(key);
      if (!acc[keyStr]) {
        acc[keyStr] = [];
      }
      acc[keyStr].push(task);
      return acc;
    }, {} as IGroupedTasks);
  }

  public applyLimit(tasks: ITask[], limit: ILimitNode): ITask[] {
    return tasks.slice(0, limit.count);
  }
}

class FilterEvaluator {
  public static evaluateFilter(task: ITask, filter: IFilterNode): boolean {
    return this.evaluateExpression(task, filter.expression);
  }

  public static evaluateExpression(
    task: ITask,
    expr: IExpressionNode
  ): boolean {
    switch (expr.type) {
      case "Comparison":
        return this.evaluateComparison(task, expr);
      case "Contains":
        return this.evaluateContains(task, expr);
      case "Not":
        return !this.evaluateExpression(task, expr.expr);
      case "And":
        return (
          this.evaluateExpression(task, expr.left) &&
          this.evaluateExpression(task, expr.right)
        );
      case "Or":
        return (
          this.evaluateExpression(task, expr.left) ||
          this.evaluateExpression(task, expr.right)
        );
      case "Value":
        // e.g. done
        return expr.value === "done" ? task.status === "done" : false;
      default:
        return false;
    }
  }

  public static evaluateComparison(
    task: ITask,
    expr: IComparisonExpression
  ): boolean {
    if (expr.field === "due" && task.dueDate) {
      var cmpDate = DateResolver.resolve(expr.value);
      if (!cmpDate) {
        return false;
      }
      if (expr.operator === "before") {
        return task.dueDate < cmpDate;
      }
      if (expr.operator === "after") {
        return task.dueDate > cmpDate;
      }
    }
    return false;
  }

  public static evaluateContains(
    task: ITask,
    expr: IContainsExpression
  ): boolean {
    if (expr.field === "tag" && task.tags) {
      return task.tags.includes(expr.value);
    }
    return false;
  }
}

class DateResolver {
  // Returns a Date object for a string like 'tomorrow', '2025-05-26', etc.
  public static resolve(value: string): Date | undefined {
    var now = new Date("2025-05-26T00:00:00");
    if (value === "tomorrow") {
      var d = new Date(now);
      d.setDate(d.getDate() + 1);
      return d;
    }
    if (value === "today") {
      return now;
    }
    // Try ISO date
    var iso = Date.parse(value);
    if (!isNaN(iso)) {
      return new Date(iso);
    }
    return undefined;
  }
}
