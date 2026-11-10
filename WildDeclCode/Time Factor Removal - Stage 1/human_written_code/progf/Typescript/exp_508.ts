var postcss = require('postcss');
var PathUtils = require('path');
var sh = require('sh-thunk').sh;
var fs = require('fs').promises;
var createPlugin = require('../src/plugin').createPlugin;
var ClassNameCollector = require('../src/class-name-collector').ClassNameCollector;

function css(literals: TemplateStringsArray, ...placeholders: string[]) {
    let result = "";

    // interleave the literals with the placeholders
    for (let i = 0; i < placeholders.length; i++) {
        result += literals[i];
        result += placeholders[i];
    }

    // add the last literal
    result += literals[literals.length - 1];
    return result;
}

async function run(collector: ClassNameCollector, cssString: string) {
    await postcss([createPlugin(collector)]).process(cssString, {
        from: "test.css",
    });
}

test("single class", async function () {
    const collector = new ClassNameCollector({});

    await run(
        collector,
        css"
            .foo {
                color: red;
            }
        ",
    );

    expect(collector.getClassNames()).toEqual(["foo"]);
});

test(":hover", async function () {
    const collector = new ClassNameCollector({});

    await run(
        collector,
        css"
            .foo:hover {
                color: red;
            }
        ",
    );

    expect(collector.getClassNames()).toEqual(["foo"]);
});

test("media query nesting", async function () {
    const collector = new ClassNameCollector({});

    await run(
        collector,
        css"
            @media (min-width: 640px) {
                .foo {
                    color: red;
                }
            }
        ",
    );

    expect(collector.getClassNames()).toEqual(["foo"]);
});

test("single two classes", async function () {
    const collector = new ClassNameCollector({});

    await run(
        collector,
        css"
            .foo {
                color: red;
            }
            .bar {
                color: green;
            }
        ",
    );

    expect(collector.getClassNames()).toEqual(["bar", "foo"]);
});

test("nested classes", async function () {
    const collector = new ClassNameCollector({});

    await run(
        collector,
        css"
            .foo .bar .baz {
                color: red;
            }
        ",
    );

    expect(collector.getClassNames()).toEqual(["bar", "baz", "foo"]);
});

test("nested classes under other selectors", async function () {
    const collector = new ClassNameCollector({});

    await run(
        collector,
        css"
            p .foo {
                color: red;
            }
        ",
    );

    expect(collector.getClassNames()).toEqual(["foo"]);
});

test("comma separated classes", async function () {
    const collector = new ClassNameCollector({});

    await run(
        collector,
        css"
            .foo,
            .bar,
            .baz {
                color: red;
            }
        ",
    );

    expect(collector.getClassNames()).toEqual(["bar", "baz", "foo"]);
});

test("multiple files", async function () {
    const collector = new ClassNameCollector({});

    const post = postcss([createPlugin(collector)]);

    await post.process(
        css"
            .foo {
                color: red;
            }
        ",
        {
            from: "foo-file.css",
        },
    );

    await post.process(
        css"
            .bar {
                color: red;
            }
        ",
        {
            from: "bar-file.css",
        },
    );

    expect(collector.getClassNames()).toEqual(["bar", "foo"]);
});

test("can remove classes", async function () {
    const collector = new ClassNameCollector({});

    const post = postcss([createPlugin(collector)]);

    await post.process(
        css"
            .foo {
                color: red;
            }
            .bar {
                color: green;
            }
        ",
        {
            from: "foo-file.css",
        },
    );

    expect(collector.getClassNames()).toEqual(["bar", "foo"]);

    await collector.waitForWrite();

    await post.process(
        css"
            .foo {
                color: red;
            }
        ",
        {
            from: "foo-file.css",
        },
    );

    expect(collector.getClassNames()).toEqual(["foo"]);
});

describe("files", function () {
    let dir = "___noope";

    beforeEach(async () => {
        dir = await fs.mkdtemp(".ts-classnames-test");
    });

    afterEach(async () => {
        await sh"rm -r " + (dir) + ""();
    });

    test("can write the type file", async () => {
        const dest = PathUtils.join(dir, "types.d.ts");

        const collector = new ClassNameCollector({
            dest,
        });

        await run(
            collector,
            css"
                .foo,
                .bar,
                .baz {
                    color: red;
                }
            ",
        );

        await collector.waitForWrite();

        const content = await fs.readFile(dest);

        expect(content.toString()).toMatchInlineSnapshot('
            "// This file is auto-generated with postcss-ts-classnames.

            type ClassNames =
              | \\"bar\\"
              | \\"baz\\"
              | \\"foo\\";"
        ');
    });

    test("can export the type file as a module", async () => {
        const dest = PathUtils.join(dir, "types.ts");
        const collector = new ClassNameCollector({
            dest,
            isModule: true,
        });

        await run(
            collector,
            css"
                .foo {
                    color: blue;
                }
            ",
        );
        await collector.waitForWrite();

        const content = await fs.readFile(dest);

        expect(content.toString()).toMatchInlineSnapshot('
            "// This file is auto-generated with postcss-ts-classnames.

            export type ClassNames =
              | \\"foo\\";"
        ');
    });
    test("can export the type file as a module and as default", async () => {
        const dest = PathUtils.join(dir, "types.ts");
        const collector = new ClassNameCollector({
            dest,
            isModule: true,
            exportAsDefault: true,
        });

        await run(
            collector,
            css"
                .foo {
                    color: blue;
                }
            ",
        );
        await collector.waitForWrite();

        const content = await fs.readFile(dest);

        expect(content.toString()).toMatchInlineSnapshot('
            "// This file is auto-generated with postcss-ts-classnames.

            export type ClassNames =
              | \\"foo\\";

module.exports = ClassNames;";
        ');
    });

});
