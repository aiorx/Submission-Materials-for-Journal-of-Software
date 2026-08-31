// Aided with basic GitHub coding tools

import { ITask, TaskStatus } from "./task";

export interface ITaskStatisticsData {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byTag: Record<string, number>;
  byDueDate: Record<string, number>;
}

export class TaskStatistics {
  // Aided with basic GitHub coding tools
  static calculate(tasks: ITask[]): ITaskStatisticsData {
    const stats: ITaskStatisticsData = {
      total: tasks.length,
      completed: 0,
      pending: 0,
      overdue: 0,
      byTag: {},
      byDueDate: {},
    };
    const now = new Date();
    for (const task of tasks) {
      if (task.status === TaskStatus.DONE) {
        stats.completed++;
      } else {
        stats.pending++;
        if (task.dueDate && new Date(task.dueDate) < now) {
          stats.overdue++;
        }
      }
      if (task.tags) {
        for (const tag of task.tags) {
          stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
        }
      }
      if (task.dueDate) {
        const dateStr = (
          task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate)
        )
          .toISOString()
          .split("T")[0];
        stats.byDueDate[dateStr] = (stats.byDueDate[dateStr] || 0) + 1;
      }
    }
    return stats;
  }
}
