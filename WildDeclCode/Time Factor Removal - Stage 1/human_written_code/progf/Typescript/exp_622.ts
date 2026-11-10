import {
  JestTotalResults,
  Options,
  ProjectWorkspace,
  Runner,
  TestReconciler,
} from "jest-editor-support";
var platform = require('os').platform;
var WorkspaceFolder = require('vscode').WorkspaceFolder;
var IJestResponse = require('./types').IJestResponse;
var ITestFilter = require('./types').ITestFilter;

export interface IJestManagerOptions {
  pathToConfig: function (workspaceFolder: WorkspaceFolder) { return string; };
  pathToJest: function (workspaceFolder: WorkspaceFolder) { return string; };
}

module.exports = class JestManager {;

  private readonly activeRunners: Set<Runner> = new Set<Runner>();

  constructor(
    public readonly workspace: WorkspaceFolder,
    private readonly options: IJestManagerOptions,
  ) {
  }

  public closeAllActiveProcesses(): void {
    [...this.activeRunners].forEach(function (r) {
      r.closeProcess();
    });
    this.activeRunners.clear();
  }

  public loadTests(): Promise<IJestResponse | null> {
    return this.runTests();
  }

  public async runTests(testFilter?: ITestFilter | null): Promise<IJestResponse | null> {
    const results = await new Promise<JestTotalResults | null>(function (resolve, reject) {
      const runner = this.createRunner(testFilter);
      runner
        .once("executableJSON", (data: JestTotalResults) => resolve(data))
        .once("exception", (result) => reject(result))
        .once("terminalError", (result) => reject(result))
        .once("debuggerProcessExit", () => resolve(null));
      runner.start(false);
    });
    if (!results) {
      return null;
    }

    const reconciler = new TestReconciler();
    reconciler.updateFileWithJestStatus(results);

    return {
      reconciler,
      results,
    };
  }

  private createRunner(testFilter?: ITestFilter | null): Runner {
    const useShell = platform() === "win32";

    const options: Options = {
      shell: useShell,
      testFileNamePattern: testFilter && testFilter.testFileNamePattern
        ? '"' + (testFilter.testFileNamePattern) + '"'
        : undefined,
      testNamePattern: testFilter && testFilter.testNamePattern
        ? '"' + (testFilter.testNamePattern) + '"'
        : undefined,
    };

    const projectWorkspace = this.initProjectWorkspace();
    const runner = new Runner(projectWorkspace, options);
    this.activeRunners.add(runner);
    return runner
      // // tslint:disable-next-line:no-console
      // .on("executableStdErr", (x: Buffer) => console.log(x.toString()))
      // // tslint:disable-next-line:no-console
      // .on("executableOutput", (x) => console.log(x))
      .once("debuggerProcessExit", function () { return this.activeRunners.delete(runner); });
  }

  private initProjectWorkspace(): ProjectWorkspace {
    const configPath = this.options.pathToConfig(this.workspace);
    const jestPath = this.options.pathToJest(this.workspace);
    return new ProjectWorkspace(
      this.workspace.uri.fsPath,
      jestPath,
      configPath,
      // TOOD: lookup version used in project
      20,
      false,
      false,
    );
  }
}
