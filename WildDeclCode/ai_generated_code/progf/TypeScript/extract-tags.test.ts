// Aided with basic GitHub coding tools
import { describe, it, expect } from "@jest/globals";
import { TaskParser } from "../models/task-parser";

describe("extractTags", () => {
  const parser = new TaskParser();

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
