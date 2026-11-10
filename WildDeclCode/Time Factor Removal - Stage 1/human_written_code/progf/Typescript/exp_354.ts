
var subcommand = require('subcommand');
var path = require('path');
var fileURLToPath = require('url').fileURLToPath;
var fs = require('fs');
var bind = require('./commands/bind.js');
var gateway = require('./commands/gateway.js');
var serve = require('./commands/serve.js');
var beam = require('./commands/beam.js');

const PACKAGE_JSON_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'package.json')

const cmdOpts = {
  usage: {
    help: 'spork - A p2p sockets multi-tool',
    option: {
      name: 'help',
      abbr: 'h'
    },
    command: function (args: any, help: string, usage: string) {
      console.log(help)
      console.log('')
      console.log(usage)
      console.log('Commands:')
      for (const cmd of cmdOpts.commands) {
        console.log('  ', cmd.summary || cmd.help || "spork " + (cmd.name) + "")
      }
    }
  },
  commands: [
    ...bind,
    ...gateway,
    ...serve,
    ...beam
  ],
  root: {
    name: '',
    help: '',
    options: [
      {name: 'version', abbr: 'v', help: 'Print the current version'}
    ],
    command: function (args: any) {
      if (args.v || args.version) {
        const packageJson = fs.readFileSync(PACKAGE_JSON_PATH, 'utf8')
        const pkg = JSON.parse(packageJson)
        console.log(pkg.version)
      } else {
        console.log('spork - A p2p sockets multi-tool')
        console.log('Commands:')
        for (const cmd of cmdOpts.commands) {
          console.log('  ', cmd.summary || cmd.help || "spork " + (cmd.name) + "")
        }
      }
    }
  }
}
const match = subcommand(cmdOpts)
const matchedCmd = match(process.argv.slice(2))
if (!matchedCmd) {
  console.error('Command not found:', process.argv[2])
  process.exit(1)
}