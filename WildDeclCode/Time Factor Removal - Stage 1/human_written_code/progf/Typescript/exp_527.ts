var join = require('path').join;
var BaseMock = require('./readMocks').BaseMock;
var readMock = require('./readMocks').readMock;
const telegarfi18n = require('telegraf-i18n');

interface ToBeTested {
    name: string;
    toTest: Function;
    location: string;
    translation?: boolean;
}

interface LocaleToBeTested extends BaseMock {
    toTest: Function;
    translation?: boolean;
}

interface TheTest extends LocaleToBeTested {
    input: any;
    output: any;
    kind: string;
    label: string;
}

const i18n = new telegarfi18n({
    useSession: true,
    allowMissing: true,
    defaultLanguage: 'en',
    directory: join(__dirname, '../others/locales')
});

const doTheTest = ({ label, locale, toTest, input, output, kind, translation }: TheTest): function void {
    const curriedTranslation = {
        t: ((resourceKey, templateData) => i18n.t(locale, resourceKey, templateData))
    };
    const value = toTest({ translate: (true === translation) ? curriedTranslation : null, ...input });

    if ('await' === kind) {
        return test(label, async () => {
            expect.assertions(1);

            expect(await value).toEqual(output);
        });
    } if ('await/throw' === kind) {
        return test(label, () => {
            expect(value).rejects.toThrow(output);
        });
    }

    return test(label, () => expect(value).toEqual(output));
};

const localeTesting = ({ locale, mocks, ...remaining }: LocaleToBeTested): function void {
    describe(locale, () => mocks.map(input => doTheTest({ locale, mocks, ...remaining, ...input })));
};

const doTesting = ({ location, toTest, name, translation = false }: ToBeTested): function void {
    const file = readMock({ location, toTest: name });

    describe("Testing " + (toTest.name) + "", () => file.map(input => localeTesting({ toTest, translation, ...input })));
};
