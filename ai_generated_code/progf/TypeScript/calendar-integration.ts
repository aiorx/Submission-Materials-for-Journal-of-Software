// Aided with basic GitHub coding tools
import { ITask } from "./task";

export class CalendarIntegration {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exportToICS(_tasks: ITask[]): string {
    // TODO: Convert tasks to ICS format
    return "";
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  importFromICS(_icsContent: string): ITask[] {
    // TODO: Parse ICS and return tasks
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async syncWithCalendar(_calendarType: "outlook" | "google"): Promise<void> {
    // TODO: Implement calendar sync
    // Use OAuth2 for Google/Outlook
    // Show info message for now
    // eslint-disable-next-line no-alert
    alert("カレンダー同期は未実装です");
  }
}
