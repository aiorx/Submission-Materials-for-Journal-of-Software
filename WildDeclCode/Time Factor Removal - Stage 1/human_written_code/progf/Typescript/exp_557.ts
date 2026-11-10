var TE = require('fp-ts/lib/TaskEither');
var flow = require('fp-ts/lib/function').flow;
var fs = require('fs');
var G = require('glob');

export interface FileSystem {
  readonly readFile: function (path: string) { return TE.TaskEither<Error; }, string>
  readonly writeFile: function (path: string, content: string) { return TE.TaskEither<Error; }, void>
  readonly copyFile: function (from: string, to: string) { return TE.TaskEither<Error; }, void>
  readonly glob: function (pattern: string) { return TE.TaskEither<Error; }, ReadonlyArray<string>>
  readonly mkdir: function (path: string) { return TE.TaskEither<Error; }, void>
}

const readFile = TE.taskify<fs.PathLike, string, NodeJS.ErrnoException, string>(fs.readFile)
const writeFile = TE.taskify<fs.PathLike, string, NodeJS.ErrnoException, void>(fs.writeFile)
const copyFile = TE.taskify<fs.PathLike, fs.PathLike, NodeJS.ErrnoException, void>(fs.copyFile)
const glob = TE.taskify<string, Error, ReadonlyArray<string>>(G)
const mkdirTE = TE.taskify(fs.mkdir)

const fileSystem: FileSystem = {
  readFile: function path { return readFile(path, 'utf8'); },
  writeFile,
  copyFile,
  glob,
  mkdir: flow(
    mkdirTE,
    TE.map(function () { return undefined; })
  )
}
