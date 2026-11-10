var debug = require('debug');
var fs = require('fs-extra');
var os = require('os');
var path = require('path');

const d = debug('electron-notarize:helpers');

export async function withTempDir<T>(fn: function (dir: string) { return Promise<T>; }) {
  const dir = await fs.mkdtemp(path.resolve(os.tmpdir(), 'electron-notarize-'));
  d('doing work inside temp dir:', dir);
  let result: T;
  try {
    result = await fn(dir);
  } catch (err) {
    d('work failed');
    await fs.remove(dir);
    throw err;
  }
  d('work succeeded');
  await fs.remove(dir);
  return result;
}

class Secret {
  constructor(private value: string) {}

  toString() {
    return this.value;
  }
  inpsect() {
    return '******';
  }
}

function makeSecret(s: string) {
  return new Secret(s) as any as string;
}

function isSecret(s: string) {
  return (s as any) instanceof Secret;
}

export interface NotarizionInfo {
  uuid: string;
  date: Date;
  status: 'invalid' | 'in progress' | 'success';
  logFileUrl: string | null;
  // Only set when status != 'in progress'
  statusCode?: 0 | 2;
  statusMessage?: string;
}

function parseNotarizationInfo(info: string): NotarizionInfo {
  const out: NotarizionInfo = {} as any;
  const matchToProperty = <K extends keyof NotarizionInfo, T extends NotarizionInfo[K]>function (key: K, r: RegExp, modifier?: (s: string) => T) {
    const exec = r.exec(info);
    if (exec) {
      out[key] = modifier ? modifier(exec[1]) : exec[1];
    }
  }exec[1];
    }
  };
  matchToProperty('uuid', /\n *RequestUUID: (.+?)\n/);
  matchToProperty('date', /\n *Date: (.+?)\n/, function d { return new Date(d); });
  matchToProperty('status', /\n *Status: (.+?)\n/);
  matchToProperty('logFileUrl', /\n *LogFileURL: (.+?)\n/);
  matchToProperty('statusCode', /\n *Status Code: (.+?)\n/, function n { return parseInt(n, 10) as any; });
  matchToProperty('statusMessage', /\n *Status Message: (.+?)\n/);

  if (out.logFileUrl === '(null)') {
    out.logFileUrl = null;
  }

  return out;
}
