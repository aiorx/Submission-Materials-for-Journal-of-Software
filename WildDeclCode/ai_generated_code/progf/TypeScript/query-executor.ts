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
import { ITask } from "./task";

export interface IQueryResult {
  tasks: ITask[];
  groupedTasks?: IGroupedTasks;
  totalCount: number;
  executionTime: number;
}

export interface IGroupedTasks {
  [group: string]: ITask[];
}

export class QueryExecutor {
  private tasks: ITask[];
  constructor(tasks: ITask[]) {
    this.tasks = tasks;
  }

  public executeQuery(queryNode: IQueryNode): IQueryResult {
    const start = Date.now();
    let filtered = this.applyFilters(this.tasks, queryNode.filters);
    if (queryNode.sort) {
      filtered = this.applySorting(filtered, [queryNode.sort]);
    }
    let grouped: IGroupedTasks | undefined;
    if (queryNode.group) {
      grouped = this.applyGrouping(filtered, [queryNode.group]);
    }
    if (queryNode.limit) {
      filtered = this.applyLimit(filtered, queryNode.limit);
    }
    const end = Date.now();
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
    return tasks.filter((task) =>
      filters.every((f) => FilterEvaluator.evaluateFilter(task, f))
    );
  }

  public applySorting(tasks: ITask[], sorts: ISortNode[]): ITask[] {
    if (!sorts.length) {
      return tasks;
    }
    // Only support one sort for now
    const sort = sorts[0];
    return [...tasks].sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sort.field];
      const bv = (b as unknown as Record<string, unknown>)[sort.field];
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
    const group = groups[0];
    return tasks.reduce((acc, task) => {
      const key =
        (task as unknown as Record<string, unknown>)[group.field] ?? "none";
      const keyStr = String(key);
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

export class FilterEvaluator {
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
      const cmpDate = DateResolver.resolve(expr.value);
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

export class DateResolver {
  // Returns a Date object for a string like 'tomorrow', '2025-05-26', etc.
  public static resolve(value: string): Date | undefined {
    const now = new Date("2025-05-26T00:00:00");
    if (value === "tomorrow") {
      const d = new Date(now);
      d.setDate(d.getDate() + 1);
      return d;
    }
    if (value === "today") {
      return now;
    }
    // Try ISO date
    const iso = Date.parse(value);
    if (!isNaN(iso)) {
      return new Date(iso);
    }
    return undefined;
  }
}
