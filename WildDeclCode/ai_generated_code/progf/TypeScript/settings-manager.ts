// Assisted using common GitHub development utilities
import * as vscode from "vscode";
import { Priority, TaskStatus } from "./models/task";

export interface IExtensionSettings {
  dateFormat: string;
  defaultPriority: Priority;
  autoRefresh: boolean;
  refreshInterval: number;
  enableCodeLens: boolean;
  enableHover: boolean;
  maxTasksInView: number;
  customTaskStatuses: TaskStatus[];
  queryTimeout: number;
  debugMode: boolean;
}

export class SettingsManager {
  private _onSettingsChanged = new vscode.EventEmitter<IExtensionSettings>();
  public readonly onSettingsChanged = this._onSettingsChanged.event;
  private currentSettings: IExtensionSettings;
  private readonly section = "vstasks";

  constructor() {
    this.currentSettings = this.getSettings();
    this.watchSettingsChanges();
  }

  public getSettings(): IExtensionSettings {
    const config = vscode.workspace.getConfiguration(this.section);
    return {
      dateFormat: config.get<string>("dateFormat", "yyyy-MM-dd"),
      defaultPriority: config.get<Priority>("defaultPriority", Priority.NONE),
      autoRefresh: config.get<boolean>("autoRefresh", true),
      refreshInterval: config.get<number>("refreshInterval", 300),
      enableCodeLens: config.get<boolean>("enableCodeLens", true),
      enableHover: config.get<boolean>("enableHover", true),
      maxTasksInView: config.get<number>("maxTasksInView", 200),
      customTaskStatuses: config.get<TaskStatus[]>("customTaskStatuses", []),
      queryTimeout: config.get<number>("queryTimeout", 5000),
      debugMode: config.get<boolean>("debugMode", false),
    };
  }

  public async updateSetting<K extends keyof IExtensionSettings>(
    key: K,
    value: IExtensionSettings[K]
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.section);
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }

  public watchSettingsChanges(): void {
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(this.section)) {
        this.currentSettings = this.getSettings();
        this._onSettingsChanged.fire(this.currentSettings);
      }
    });
  }
}

export class SettingsValidator {
  public static validateDateFormat(format: string): boolean {
    // Simple check for valid date format (yyyy-MM-dd etc)
    return /[yMd\-/.]+/.test(format);
  }
  public static validateRefreshInterval(interval: number): boolean {
    return Number.isInteger(interval) && interval > 0 && interval < 86400;
  }
  public static validateMaxTasks(maxTasks: number): boolean {
    return Number.isInteger(maxTasks) && maxTasks > 0 && maxTasks <= 10000;
  }
}
