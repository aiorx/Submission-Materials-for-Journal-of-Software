declare module "tar-fs" {
  import fs = require("fs");
  import stream = require("stream");

  // Replace these return values with the value of tar-stream when it becomes available
function pack(cwd: string, opts?: PackOptions): stream.Readable;
function extract(cwd: string, opts?: ExtractOptions): stream.Writable;

  export interface Options {
    ignore?: function (name: string) { return boolean; };
    filter?: function (name: string) { return boolean; };
    map?: function (header: Headers) { return Headers; };
    mapStream?: function (fileStream: fs.ReadStream, header: Headers) { return fs.ReadStream; };
    dmode?: number;
    fmode?: number;
    readable?: boolean;
    writable?: boolean;
    strict?: boolean;
  }

  export interface PackOptions extends Options {
    entries?: string[];
    dereference?: boolean;
    finalize?: boolean;
    pack?: stream.Readable;
    finish?: function (pack: any) { return void; };
  }

  export interface ExtractOptions extends Options {
    strip?: boolean;
    ignore?: function (name: string, header?: Headers) { return boolean; };
    filter?: function (name: string, header?: Headers) { return boolean; };
  }

  export interface Headers {
    name: string;
    mode: number;
    mtime: Date;
    size: number;
    type: "file" | "directory" | "link" | "symlink";
    uid: number;
    gid: number;
  }
}
