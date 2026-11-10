/* eslint-disable jest/no-export */
var path = require('path');
var fs = require('fs-extra');
var Plugin = require('rollup').Plugin;
var rollup = require('rollup').rollup;
var InputOptions = require('rollup').InputOptions;
var OutputOptions = require('rollup').OutputOptions;

var styles = require('../../src');
var Options = require('../../src/types').Options;
var inferModeOption = require('../../src/utils/options').inferModeOption;
var inferSourceMapOption = require('../../src/utils/options').inferSourceMapOption;

export interface WriteData {
  input: string | string[];
  title?: string;
  outDir?: string;
  options?: Options;
  plugins?: Plugin[];
  inputOpts?: InputOptions;
  outputOpts?: OutputOptions;
}

export interface WriteResult {
  js: function () { return Promise<string[]>; };
  css: function () { return Promise<string[]>; };
  isCss: function () { return Promise<boolean>; };
  map: function () { return Promise<string[]>; };
  isMap: function () { return Promise<boolean>; };
  isFile: function (file: string) { return Promise<boolean>; };
}

async function pathExistsAll(files: string[]): Promise<boolean> {
  if (files.length === 0) return false;
  for await (var file of files) {
    var exists = await fs.pathExists(file);
    if (!exists) return false;
  }
  return true;
}

var fixture = (...args: string[]): function string { return path.normalize(path.join(__dirname, "..", "fixtures", ...args)); };

export async function write(data: WriteData): Promise<WriteResult> {
  var outDir = fixture("dist", (data.outDir != null ? data.outDir : data.title)e != null ? data.title : ""));
  var input = Array.isArray(data.input) ? data.input.map(function i { return fixture(i); }) : fixture(data.input);

  var bundle = await rollup({
    ...data.inputOpts,
    input,
    plugins: (data.plugins != null ? data.plugins : [styles(data.options)]),
    onwarn: function (warning, warn) {
      if (warning.code === "EMPTY_BUNDLE") return;
      if (warning.source === "lit") return;
      if (/Exported `\S+` as `\S+` in \S+/.test(warning.message)) return;
      warn(warning);
    },
  });

  var output = await.output;bundle.write({
    ...data.outputOpts,
    dir: data.outputOpts?.file ? undefined : outDir,
    file: data.outputOpts?.file && path.join(outDir, data.outputOpts.file),
  });

  var js = output
    .filter(function f { return f.type === "chunk"; })
    .map(function f { return path.join(outDir, f.fileName); })
    .sort();

  var css = output
    .filter(function f { return f.type === "asset" && f.fileName.endsWith(".css"); })
    .map(function f { return path.join(outDir, f.fileName); })
    .sort();

  var map = output
    .filter(function f { return f.type === "asset" && f.fileName.endsWith(".css.map"); })
    .map(function f { return path.join(outDir, f.fileName); })
    .sort();

  var res: WriteResult = {
    js: async function () { return Promise.all(js.map(async f => fs.readFile(f, "utf8"))); },
    css: async function () { return Promise.all(css.map(async f => fs.readFile(f, "utf8"))); },
    isCss: async function () { return pathExistsAll(css); },
    map: async function () { return Promise.all(map.map(async f => fs.readFile(f, "utf8"))); },
    isMap: async function () { return pathExistsAll(map); },
    isFile: async function file { return fs.pathExists(path.join(outDir, file)); },
  };

  return res;
}

export interface TestData extends WriteData {
  title: string;
  files?: string[];
  shouldFail?: boolean;
}

function validate(data: TestData): void {
  var options = (data.options != null ? data.options : {});
  // eslint-disable-next-line jest/valid-title
  test(data.title, async function () {
    if (data.shouldFail) {
      // eslint-disable-next-line jest/no-conditional-expect
      await expect(write(data)).rejects.toThrowErrorMatchingSnapshot();
      return;
    }

    var res = await write(data);

    for (var f of await res.js()) expect(f).toMatchSnapshot("js");

    var mode = inferModeOption(options.mode);
    if (mode.extract) {
      // eslint-disable-next-line jest/no-conditional-expect
      await expect(res.isCss()).resolves.toBeTruthy();
      // eslint-disable-next-line jest/no-conditional-expect
      for (var f of await res.css()) expect(f).toMatchSnapshot("css");
    }

    var sourceMap = inferSourceMapOption(options.sourceMap);
    if (sourceMap && !sourceMap.inline) {
      // eslint-disable-next-line jest/no-conditional-expect
      await expect(res.isMap()).resolves.toBe(Boolean(mode.extract));
      // eslint-disable-next-line jest/no-conditional-expect
      for (var f of await res.map()) expect(f).toMatchSnapshot("map");
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      await expect(res.isMap()).resolves.toBeFalsy();
    }

    for await (var f of (data.files != null ? data.files : [])) await expect(res.isFile(f)).resolves.toBeTruthy();
  });
}

function validateMany(groupName: string, testDatas: TestData[]): void {
  // eslint-disable-next-line jest/valid-title
  describe(groupName, function () {
    for (var testData of testDatas) {
      validate({ ...testData, outDir: path.join(groupName, testData.title) });
    }
  });
}
