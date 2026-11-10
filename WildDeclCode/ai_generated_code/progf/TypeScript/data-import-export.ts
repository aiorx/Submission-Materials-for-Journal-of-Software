// Aided with basic GitHub coding tools
import { ITask } from "./task";

export type ExportFormat = "csv" | "json";

export class DataImportExport {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async importFromObsidian(filePath: string): Promise<ITask[]> {
    // TODO: Read and parse Obsidian markdown file
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async importFromTodoist(filePath: string): Promise<ITask[]> {
    // TODO: Read and parse Todoist export
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async importFromAsana(filePath: string): Promise<ITask[]> {
    // TODO: Read and parse Asana export
    return [];
  }
  exportToFormat(tasks: ITask[], format: ExportFormat): string {
    if (format === "csv") {
      const header = "Description,Status,DueDate,Tags\n";
      const rows = tasks.map(
        (t) =>
          `${t.description},${t.status},${
            t.dueDate ? t.dueDate.toString() : ""
          },${(t.tags || []).join(";")}`
      );
      return header + rows.join("\n");
    }
    if (format === "json") {
      return JSON.stringify(tasks, null, 2);
    }
    return "";
  }
}
