// Assisted using common GitHub development utilities

import { ITask } from "./task";
import { ITaskStatisticsData } from "./task-statistics";

export class ReportGenerator {
  // Assisted using common GitHub development utilities
  static generateMarkdownReport(stats: ITaskStatisticsData): string {
    return `# Task Report\n\n- Total: ${stats.total}\n- Completed: ${stats.completed}\n- Pending: ${stats.pending}\n- Overdue: ${stats.overdue}\n`;
  }
  static generateCSV(tasks: ITask[]): string {
    const header = "Description,Status,DueDate,Tags\n";
    const rows = tasks.map(
      (t) =>
        `${t.description},${t.status},${
          t.dueDate
            ? t.dueDate instanceof Date
              ? t.dueDate.toISOString()
              : t.dueDate
            : ""
        },${(t.tags || []).join(";")}`
    );
    return header + rows.join("\n");
  }
}
