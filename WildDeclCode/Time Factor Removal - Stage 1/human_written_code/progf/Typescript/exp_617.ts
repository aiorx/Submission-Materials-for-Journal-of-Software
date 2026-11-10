var getMetroTransformer = require('../getMetroTransformer').getMetroTransformer;
import {
  convertMetroRawSourceMapToStandardSourceMap,
  MetroRawSourceMap,
  composeSourceMaps,
} from "../composeSourceMaps"
var fs = require('fs');
var path = require('path');
var SourceMapConsumer = require('source-map/source-map').SourceMapConsumer;
var getPositionOfSubstring = require('./getPositionOfSubstring').getPositionOfSubstring;
var ts = require('typescript');

const numberedLines = fs
  .readFileSync(require.resolve("./files/numberedLines.js"))
  .toString()

describe("convertMetroRawSourceMapToStandardSourceMap", function () {
  it("takes a raw source map and converts it to a non-raw source map", () => {
    const transformer = getMetroTransformer(47)

    var map = transformer.transform.map;
var code = transformer.transform.code;({
      filename: require.resolve("./files/numberedLines.js"),
      src: numberedLines,
      options: {
        retainLines: false,
      },
    })

    if (typeof code !== "string") {
      // use this rather than expect for typescript's sake
      throw new Error("code must be a string")
    }

    expect(Array.isArray(map)).toBe(true)
    expect(map).toMatchSnapshot()

    const standardMap = convertMetroRawSourceMapToStandardSourceMap(
      map as MetroRawSourceMap,
      path.join(__dirname, "numberedLines.js"),
      numberedLines,
    )

    const standardMapConsumer = new SourceMapConsumer(standardMap as any) // upstream types are wrong

    for (const substring of ["line1", "line2", "line3", "line5"])
      expect(
        standardMapConsumer.originalPositionFor(
          getPositionOfSubstring(code, substring)!,
        ),
      ).toMatchObject(getPositionOfSubstring(numberedLines, substring)!)

    expect(standardMap).toMatchSnapshot()
  })
})

describe("composeSourceMaps", function () {
  it("composes two source maps together", () => {
    const filename = require.resolve("./files/hello.ts")
    const hello = fs.readFileSync(filename).toString()

    const tsTranspileResult = ts.transpileModule(hello, {
      fileName: filename,
      compilerOptions: {
        sourceMap: true,
        target: ts.ScriptTarget.ES2015,
      },
    })

    expect(tsTranspileResult.outputText).toMatchSnapshot()

    const upstreamTransformResult = getMetroTransformer(47).transform({
      filename,
      src: tsTranspileResult.outputText,
      options: {
        retainLines: false,
      },
    })

    expect(upstreamTransformResult.code).toMatchSnapshot()

    const composedMap = new SourceMapConsumer(composeSourceMaps(
      tsTranspileResult.sourceMapText!,
      convertMetroRawSourceMapToStandardSourceMap(
        upstreamTransformResult.map as MetroRawSourceMap,
        filename,
        hello,
      ),
      filename,
      hello,
    ) as any) // upstream types are wrong

    expect(
      composedMap.originalPositionFor(
        getPositionOfSubstring(upstreamTransformResult.code!, "line6")!,
      ),
    ).toMatchObject({ line: 6 })

    expect(
      composedMap.originalPositionFor(
        getPositionOfSubstring(upstreamTransformResult.code!, "line8")!,
      ),
    ).toMatchObject({ line: 8 })
  })
})
