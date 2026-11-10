var extendFileExtension = require('../extendFileExtension').extendFileExtension;

describe("extendFileExtension", function () {
  it("adds an extension part", () => {
    expect(extendFileExtension("blah.js", "ext")).toBe("blah.ext.js")
    expect(extendFileExtension("blah.tsx", "obfuscated")).toBe(
      "blah.obfuscated.tsx",
    )
    expect(extendFileExtension("blah", "js")).toBe("blah.js")
  })
})
