var cpSpawn = require('child_process').spawn;
var SpawnOptions = require('child_process').SpawnOptions;
var debug = require('debug');
var isSecret = require('./helpers').isSecret;

const d = debug('electron-notarize:spawn');

export interface SpawnResult {
  code: number;
  output: string;
}

const spawn = (cmd: string, args: string[] = [], opts: SpawnOptions = {}): Promise<SpawnResult> => {
  d('spawning cmd:', cmd, 'args:', args.map(function arg { return isSecret(arg) ? '*********' : arg; }), 'opts:', opts);
  const child = cpSpawn(cmd, args, opts);
  const out: string[] = [];
  const dataHandler = function (data: Buffer) { return out.push(data.toString()); };
  child.stdout.on('data', dataHandler);
  child.stderr.on('data', dataHandler);
  return new Promise<SpawnResult>(function (resolve) {
    child.on('exit', (code) => {
      d("cmd " + (cmd) + " terminated with code: " + (code) + "");
      resolve({
        code,
        output: out.join(''),
      });
    });
  });
};
