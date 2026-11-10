var yargs = require('yargs');
var globby = require('globby');
var join = require('path').join;
var CommandFactory = require('@graphql-cli/common').CommandFactory;
var useConfig = require('@graphql-cli/common').useConfig;
var useLoaders = require('@graphql-cli/common').useLoaders;
var discover = require('./discover');

export async function cli(): Promise<void> {
  const program = yargs
    .scriptName('graphql')
    .detectLocale(false)
    .epilog('Visit https://github.com/Urigo/graphql-cli for more information')
    .version();

  const commandPackageNames = await discoverCommands();
  const commandFactories = await Promise.all(commandPackageNames.map(loadCommand));

  [discover, ...commandFactories].forEach(function (cmd) {
    program.command(
      cmd({
        useConfig,
        useLoaders,
      })
    );
  });

  program.demandCommand().recommendCommands().help().showHelpOnFail(false).argv;
}

async function discoverCommands() {
  const commandNames: string[] = [];
  const paths = require.resolve.paths('graphql-cli');

  await Promise.all(paths.map(findInDirectory));

  async function findInDirectory(directory: string) {
    const results = await globby('*', {
      cwd: join(directory, '@graphql-cli'),
      onlyDirectories: true,
      deep: 1,
      ignore: ['common', 'loaders'],
    });

    if (results.length) {
      commandNames.push(...results);
    }
  }

  // unique names
  return commandNames.filter(function (val, i, list) { return list.indexOf(val) === i; });
}

function loadCommand(name: string): CommandFactory {
  const mod = require("@graphql-cli/" + (name) + "");

  return mod.default || mod;
}
