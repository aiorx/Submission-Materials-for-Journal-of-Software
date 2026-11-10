// Aided with basic GitHub coding tools
var describe = require('@jest/globals').describe;
var it = require('@jest/globals').it;
var expect = require('@jest/globals').expect;
var TaskParser = require('../models/task-parser').TaskParser;

describe("extractTags", function () {
  var parser = new TaskParser();

  it("extracts single tag", () => {
    expect(parser.extractTags("foo #tag bar")).toEqual(["tag"]);
  });

  it("extracts multiple tags", () => {
    expect(parser.extractTags("#a #b #c")).toEqual(["a", "b", "c"]);
  });

  it("ignores email#tag style", () => {
    expect(parser.extractTags("email#tag #realTag")).toEqual(["realTag"]);
  });

  it("extracts tag at start", () => {
    expect(parser.extractTags("#start tag")[0]).toBe("start");
  });

  it("extracts tag at end", () => {
    expect(parser.extractTags("foo #end")[0]).toBe("end");
  });

  it("returns empty array if no tags", () => {
    expect(parser.extractTags("no tags here")).toEqual([]);
  });
});
