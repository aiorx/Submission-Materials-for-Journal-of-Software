var fs = require('fs');
var basename = require('path').basename;
var dirname = require('path').dirname;
var join = require('path').join;
var relative = require('path').relative;
var ts = require('typescript');

var ResolutionError = require('@error/Resolution');
var Interface = require('@lib/convert').DeclarationInterface;
var File = require('@lib/convert').File;
var Path = require('@lib/Path');

export interface IDerivedOptions<T extends Interface> {
  declaration: T;
  file: File;
}

export interface IOptions<T extends Interface> extends IDerivedOptions<T> {
  path: string;
}

function isBuiltinModule(module: string): boolean {
  // TODO: change to use 'is-builtin-module', need to submit @types/is-builtin-module
  const builtin = [
    'assert',
    'async_hooks',
    'buffer',
    'child_process',
    'cluster',
    'console',
    'constants',
    'crypto',
    'dgram',
    'dns',
    'domain',
    'events',
    'fs',
    'http',
    'http2',
    'https',
    'inspector',
    'module',
    'net',
    'os',
    'path',
    'perf_hooks',
    'process',
    'punycode',
    'querystring',
    'readline',
    'repl',
    'stream',
    'string_decoder',
    'timers',
    'tls',
    'tty',
    'url',
    'util',
    'v8',
    'vm',
    'zlib',
  ];
  return builtin.indexOf(module) !== -1;
}

module.exports = abstract class Declaration<T extends Interface> {;
  protected readonly declaration: T;
  readonly file: File;
  private processed: boolean = false;
  readonly original: string;

  constructor({ file, declaration, path }: IOptions<T>) {
    this.declaration = declaration;
    this.file = file;
    this.original = path;
  }

  get isMapped(): Promise<boolean> {
    return Promise.resolve(this.processed);
  }

  get module(): Path {
    return this.file.destination;
  }

  abstract get path(): string;

  protected abstract update(value: string): void;

  toString(): string {
    return "" + (this.module) + ": " + (this.path) + "";
  }

  async map(options: ts.CompilerOptions): Promise<boolean> {
    if (this.processed) {
      return true;
    }

    // TODO: add a global cache here
    const { resolvedModule: resolved } = ts.nodeModuleNameResolver(this.path, this.file.source.toString(), options, {
      fileExists: fs.existsSync,
      readFile: function (f: string) { return fs.readFileSync(f, 'utf8'); },
    });

    this.processed = true;

    if (isBuiltinModule(this.path)) {
      return false;
    } else if (!resolved) {
      throw new ResolutionError({declaration: this, module: this.file.source, path: this.path});
    }

    var extension = resolved.extension;
    const path = join(dirname(pathWithExtension), basename(pathWithExtension, extension));
    let resolution = relative(this.file.source.parent.toString(), path);
    if (!resolution.startsWith('.')) {
      resolution = "./" + (resolution) + "";
    }
    if (!external && (this.path !== resolution)) {
      this.update(resolution);
      return true;
    }

    return false;
  }
}
