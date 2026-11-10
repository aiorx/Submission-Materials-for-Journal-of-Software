// - Supported via standard GitHub programming aids
var EventEmitter = require('events').EventEmitter;

// We'll dynamically mock dependencies before importing the module under test.
describe('CockroachDaemon (init / setup / startup / monitor)', function () {

    var execCalls: string[];
    var spawnMock: jest.Mock;

    // Helper to reset modules and set mocks, then import the class
    async function loadWithMocks(readdirReturn: string[] = []) {
        jest.resetModules();
        execCalls = [];

        // Mock fs/promises
        var fsPromisesMock = {
            readdir: jest.fn(async () => readdirReturn.slice()),
            rm: jest.fn(async () => undefined),
            mkdir: jest.fn(async () => undefined),
        };
        jest.doMock('fs/promises', () => fsPromisesMock);

        // Capture exec commands via promisify(exec)(cmd)
        jest.doMock('util', () => ({
            promisify: jest.fn(() => (cmd: string) => {
                execCalls.push(cmd);
                return Promise.resolve('');
            })
        }));

        // Mock child_process.spawn to return a fake child process with EventEmitters
        spawnMock = jest.fn(() => {
            var stdout = new EventEmitter();
            var stderr = new EventEmitter();
            // Provide .on for compatibility (EventEmitter already has it)
            return { stdout, stderr, pid: 12345 } as any;
        });
        jest.doMock('child_process', () => ({
            spawn: spawnMock,
            exec: jest.fn()
        }));

        // Mock Environment used by the module under test
        var envPath = require.resolve('../src/Enviroment');
        jest.doMock(envPath, () => ({
            Environment: {
                COCKROACH_VERSION: '25.3.0',
                COCKROACH_DOWNLOAD: 'https://example.test/cockroach.tgz'
            }
        }));

        // Mock Daemon and its eventBus (export a class so it can be extended)
        var eventBus = { emit: jest.fn() };
        class MockDaemon {
            static eventBus = eventBus;
        }
        // Determine absolute path to src/Deamon so module id matches imports inside the tested module
        var path = require('path');
        var daemonPath = require.resolve(path.join(process.cwd(), 'src', 'Deamon'));
        jest.doMock(daemonPath, () => ({ Daemon: MockDaemon }));

        // Mock global.fetch for monitor tests (will override in individual tests)
        // Provide a default that rejects to simulate down state
        // @ts-ignore
        global.fetch = jest.fn(async () => { throw new Error('fetch not mocked in test'); });

        // Intercept setInterval so we can capture callbacks without creating real timers
        var createdTimers: any[] = [];
        jest.spyOn(global, 'setInterval').mockImplementation((fn: any, ms?: number, ...args: any[]) => {
            createdTimers.push(fn);
            // return a fake id typed as NodeJS.Timeout to satisfy TypeScript
            var fakeId = {} as NodeJS.Timeout;
            return fakeId;
        });

        var mod = require('../src/modules/CockroachDeamon');
        return {
            CockroachDaemon: mod.CockroachDaemon,
            mocks: {
                fsPromisesMock,
                execCalls,
                spawnMock,
                eventBus,
                createdTimers,
            }
        };
    }

    afterEach(() => {
        jest.useRealTimers();
        // Clear global fetch mock
        // @ts-ignore
        if (global.fetch && (global.fetch as jest.Mock).mockClear) (global.fetch as jest.Mock).mockClear();
        // Clear any intervals created during tests
        try {
            // Access createdTimers if present from last loadWithMocks
            // @ts-ignore
            var lastModule = require.cache[require.resolve('../src/modules/CockroachDeamon')];
            if (lastModule && lastModule.exports && lastModule.exports.CockroachDaemon && lastModule.exports.CockroachDaemon.createdTimers) {
                var timers = lastModule.exports.CockroachDaemon.createdTimers as any[];
                timers.forEach(t => clearInterval(t));
            }
        }
        catch (e) {
            // ignore
        }
        jest.resetAllMocks();
        jest.resetModules();
    });

    test('init returns singleton and calls setup + startup only once', async () => {
        var CockroachDaemon = await.CockroachDaemon;loadWithMocks(['cockroach-25.3.0']);

        // Spy on prototype.setup and startup
        var setupSpy = jest.spyOn((CockroachDaemon as any).prototype, 'setup').mockResolvedValue(undefined);
        var startupSpy = jest.spyOn((CockroachDaemon as any).prototype, 'startup').mockImplementation(() => {});

        var a = await (CockroachDaemon as any).init('single');
        var b = await (CockroachDaemon as any).init('single');

        expect(a).toBe(b);
        expect(setupSpy).toHaveBeenCalledTimes(1);
        expect(startupSpy).toHaveBeenCalledTimes(1);

        // clear singleton to avoid leaking to other tests
        (CockroachDaemon as any).singleton = undefined;
    });

    test('setup: binary exists and is up to date -> no download/extract/chmod', async () => {
        var CockroachDaemon = await.CockroachDaemon;
var mocks = await.mocks;loadWithMocks(['cockroach-25.3.0']);

        // Prevent startup side-effects
        jest.spyOn((CockroachDaemon as any).prototype, 'startup').mockImplementation(() => {});

        await (CockroachDaemon as any).init('single');

        expect(mocks.fsPromisesMock.readdir).toHaveBeenCalledWith('bin/');
        expect(mocks.execCalls.length).toBe(0);

        (CockroachDaemon as any).singleton = undefined;
    });

    test('setup: binary outdated -> remove old, download, extract, chmod', async () => {
        var CockroachDaemon = await.CockroachDaemon;
var mocks = await.mocks;loadWithMocks(['cockroach-25.2.0']);

        // Prevent startup side-effects
        jest.spyOn((CockroachDaemon as any).prototype, 'startup').mockImplementation(() => {});

        await (CockroachDaemon as any).init('single');

        // removed old binary folder
        expect(mocks.fsPromisesMock.rm).toHaveBeenCalledWith('bin/cockroach-25.2.0', { recursive: true });

        // commands captured
        expect(mocks.execCalls.some(c => c.includes('wget'))).toBeTruthy();
        expect(mocks.execCalls.some(c => c.includes('tar -xzf'))).toBeTruthy();
        expect(mocks.execCalls.some(c => c.includes('chmod +x'))).toBeTruthy();

        (CockroachDaemon as any).singleton = undefined;
    });

    test('setup: binary missing -> download, extract, chmod and mkdir', async () => {
        var CockroachDaemon = await.CockroachDaemon;
var mocks = await.mocks;loadWithMocks([]);

        // Prevent startup side-effects
        jest.spyOn((CockroachDaemon as any).prototype, 'startup').mockImplementation(() => {});

        await (CockroachDaemon as any).init('single');

        expect(mocks.fsPromisesMock.mkdir).toHaveBeenCalledWith('bin/cockroach-25.3.0');
        expect(mocks.execCalls.some(c => c.includes('wget'))).toBeTruthy();
        expect(mocks.execCalls.some(c => c.includes('tar -xzf'))).toBeTruthy();
        expect(mocks.execCalls.some(c => c.includes('chmod +x'))).toBeTruthy();

        (CockroachDaemon as any).singleton = undefined;
    });

    test('startup: spawn called with correct binary and args; stdout/stderr forwarded', async () => {
        var CockroachDaemon = await.CockroachDaemon;
var mocks = await.mocks;loadWithMocks(['cockroach-25.3.0']);

        // Spy on info/error to capture forwarded messages
        var infoSpy = jest.spyOn((CockroachDaemon as any).prototype, 'info').mockImplementation(() => {});
        var errorSpy = jest.spyOn((CockroachDaemon as any).prototype, 'error').mockImplementation(() => {});

        // Let init run full flow (setup + startup)
        var instance = await (CockroachDaemon as any).init('single');

        expect(mocks.spawnMock).toHaveBeenCalled();
        var spawnArgs = mocks.spawnMock.mock.calls[0];
        var exe = spawnArgs[0];
        var args = spawnArgs[1];

        expect((exe as string)).toContain('bin/cockroach-25.3.0/cockroach');
        expect(args).toEqual(expect.arrayContaining([
            'start-single-node',
            '--certs-dir=data/cockroach-certs',
            '--store=data/cockroach-single',
            '--listen-addr=localhost'
        ]));

        // Grab the fake process and emit data on stdout/stderr
        var fakeProc = mocks.spawnMock.mock.results[0].value;
        fakeProc.stdout.emit('data', Buffer.from('hello\n'));
        fakeProc.stderr.emit('data', Buffer.from('boom\n'));

        expect(infoSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();

        (CockroachDaemon as any).singleton = undefined;
    });

    test('monitor: emits running when health endpoint is reachable and stopped when not', async () => {
        var CockroachDaemon = await.CockroachDaemon;
var mocks = await.mocks;loadWithMocks(['cockroach-25.3.0']);

        // Prevent startup side-effects
        jest.spyOn((CockroachDaemon as any).prototype, 'startup').mockImplementation(() => {});

    // First, fetch resolves -> running
    // @ts-ignore
    global.fetch = jest.fn(async () => ({}));

    var instance = await (CockroachDaemon as any).init('single');

    // The constructor captured the monitor callback in createdTimers; call it directly
    expect(mocks.createdTimers.length).toBeGreaterThan(0);
    // invoke the monitor callback and wait for it
    await mocks.createdTimers[0]();

    expect(mocks.eventBus.emit).toHaveBeenCalledWith('cockroach:running');

    // Now make fetch reject -> stopped
    // @ts-ignore
    global.fetch = jest.fn(async () => { throw new Error('down'); });

    await mocks.createdTimers[0]();

    expect(mocks.eventBus.emit).toHaveBeenCalledWith('cockroach:stopped');

        (CockroachDaemon as any).singleton = undefined;
    });

});
