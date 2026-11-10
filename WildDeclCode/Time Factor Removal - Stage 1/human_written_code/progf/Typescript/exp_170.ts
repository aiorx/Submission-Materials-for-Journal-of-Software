var vscode = require('vscode');

export enum ConfigOption {
  JestPath = 'jestPath',
  JestConfigPath = 'jestConfigPath',
  RunTestLabel = 'runTestLabel',
  DebugTestLabel = 'debugTestLabel',
  UpdateSnapshotsLabel = 'updateSnapshotsLabel',
  TestMatchPatterns = 'testMatchPatterns',
  CustomSnapshotMatchers = 'customSnapshotMatchers',
  JestCLIOptions = 'jestCLIOptions',
  ArgumentQuotesToUse = 'argumentQuotesToUse',
  EnvironmentVariables = 'environmentVariables',
}

export type JestRunItConfig = Omit<
  {
    [key in ConfigOption]: string;
  },
  ConfigOption.TestMatchPatterns
> & {
  [ConfigOption.TestMatchPatterns]: Array<string>;
};

const getConfig = function (option: ConfigOption) {
  const config = vscode.workspace
    .getConfiguration()
    .get<JestRunItConfig>('jestRunIt');

  return config ? config[option] : '';
};
