// Assisted using common GitHub development utilities

var ITask = require('./task').ITask;
var ITaskStatisticsData = require('./task-statistics').ITaskStatisticsData;

class ReportGenerator {
  // Assisted using common GitHub development utilities
  static generateMarkdownReport(stats: ITaskStatisticsData): string {
    return "# Task Report\n\n- Total: " + (stats.total) + "\n- Completed: " + (stats.completed) + "\n- Pending: " + (stats.pending) + "\n- Overdue: " + (stats.overdue) + "\n";
  }
  static generateCSV(tasks: ITask[]): string {
    var header = "Description,Status,DueDate,Tags\n";
    var rows = tasks.map(
      function (t) { return "" + (t.description) + "; }," + (t.status) + "," + (
          t.dueDate
            ? t.dueDate instanceof Date
              ? t.dueDate.toISOString()
              : t.dueDate
            : ""
        ) + "," + ((t.tags || []).join(";")) + ""
    );
    return header + rows.join("\n");
  }
}
