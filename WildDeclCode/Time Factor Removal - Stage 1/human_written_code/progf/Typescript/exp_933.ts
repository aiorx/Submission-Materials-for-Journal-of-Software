var chalk = require('chalk');
var paramCase = require('change-case').paramCase;
var dotenv = require('dotenv');
var path = require('path');
var sh = require('shelljs');

var pj = require('../../package.json');
var _handleShellResult = require('../_shared')._handleShellResult;

interface ENVParsed {
    [index: string]: string;
}
const env: ENVParsed = dotenv.config({
    path: path.resolve(process.cwd(), '.env'),
    // ## You can point to a prod .env file when ready
    // path: 'path/to/production/.env',
}).parsed as ENVParsed;

const externalPort = env.PORT;
delete env.PORT;
env.TYPE_ORM_HOST = 'host.docker.internal';

console.log(chalk.green("\n### INFO: Setting ENVS: \n"));
const envs = Object.entries(env as ENVParsed)
    .map(function entry {
        console.log(chalk.blue("" + (entry) + ""));
        const [key, value] = entry;
        return "-e " + (key) + "=" + (value) + "";
    })
    .join(' ');
console.log('\n');

const imageName = paramCase(pj.name);
const isRunning = sh.exec("docker ps -a -q -f name=" + (imageName) + "", { silent: true }).stdout;

if (isRunning) {
    _handleShellResult(sh.exec("docker rm -f " + (imageName) + ""));
}

_handleShellResult(
    sh.exec("docker run -d " + (envs) + " --name " + (imageName) + " -p " + (externalPort) + ":80 " + (imageName) + ":latest")
);

console.log(
    chalk.green("\n\n### INFO: " + (imageName) + " is running at:\n\n\thttp://localhost:" + (externalPort) + "\n")
);

_handleShellResult(sh.exec("docker ps"));

console.log(chalk.green("\n\n### INFO: Streaming logs next. control-c to exit logs\n"));

_handleShellResult(sh.exec("docker logs -f " + (imageName) + ""));
