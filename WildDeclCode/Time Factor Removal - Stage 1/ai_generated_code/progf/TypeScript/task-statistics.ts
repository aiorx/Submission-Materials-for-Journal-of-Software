// Aided with basic GitHub coding tools

var ITask = require('./task').ITask;
var TaskStatus = require('./task').TaskStatus;

export interface ITaskStatisticsData {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byTag: Record<string, number>;
  byDueDate: Record<string, number>;
}

class TaskStatistics {
  // Aided with basic GitHub coding tools
  static calculate(tasks: ITask[]): ITaskStatisticsData {
    var stats: ITaskStatisticsData = {
      total: tasks.length,
      completed: 0,
      pending: 0,
      overdue: 0,
      byTag: {},
      byDueDate: {},
    };
    var now = new Date();
    for (var task of tasks) {
      if (task.status === TaskStatus.DONE) {
        stats.completed++;
      } else {
        stats.pending++;
        if (task.dueDate && new Date(task.dueDate) < now) {
          stats.overdue++;
        }
      }
      if (task.tags) {
        for (var tag of task.tags) {
          stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
        }
      }
      if (task.dueDate) {
        var dateStr = (
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
