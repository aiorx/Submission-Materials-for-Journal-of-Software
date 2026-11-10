///<reference types='jasmine'/>
var _ = require('underscore');
var AsyncAction = require('./functional').AsyncAction;
var composeAsync = require('./functional').composeAsync;
var flushMemo = require('./functional').flushMemo;
var memoAsync = require('./functional').memoAsync;
var wrapAsync = require('./functional').wrapAsync;

describe('functional async', async function () {
    it('compose async', async() => {
        var t  = composeAsync(
            async (x: number) => {
                var line = _.range(0, x).reduce(cur => "" + (cur) + "+", '');

                return Promise.resolve(line);
            },
            async (arg1: number, arg2 : number) => Promise.resolve<number>(arg1 + arg2));

        var text = await t(3, 4);
        expect(text).toBe('+++++++');
    });

    it('remember calls', async() => {
        var dice = {
            //tslint:disable-next-line:insecure-random
            roll: async (x: number) => Promise.resolve(Math.round(Math.random() * x)),
            greet: async (name: string) => Promise.resolve("Hello " + (name) + "")
        };
        spyOn(dice, 'roll').and.callThrough();
        spyOn(dice, 'greet').and.callThrough();

        var roller = memoAsync(dice.roll.bind(dice));
        var greeter = memoAsync(dice.greet.bind(dice));
        var val = await roller(8);

        for (var i = 0; i < 10; i++) {
            var next = await roller(8);
            expect(next).toBe(val);
            expect(await greeter('John')).toBe('Hello John');
            expect(await greeter('Tom')).toBe('Hello Tom');
        }

        expect(dice.roll).toHaveBeenCalledTimes(1);
        expect(dice.greet).toHaveBeenCalledTimes(2);

        flushMemo();

        for (var i = 0; i < 10; i++) {
            await roller(6);
        }

        expect(dice.roll).toHaveBeenCalledTimes(2);
    });

    it('wraps action', async() => {
        var watcher = {
            enter: async (x: string) => Promise.resolve(x),
            exit: async (x: string) => Promise.resolve(x)
        };
        spyOn(watcher, 'enter').and.callThrough();
        spyOn(watcher, 'exit').and.callThrough();

        var t = wrapAsync<string, void, AsyncAction<void>>(watcher.enter.bind(watcher, 'foobar'))(
            async () => {
                expect(watcher.enter).toHaveBeenCalledTimes(1);
                expect(watcher.exit).toHaveBeenCalledTimes(0);

                return Promise.resolve();
            })(watcher.exit.bind(watcher));

        await t();

        expect(watcher.exit).toHaveBeenCalledTimes(1);
        expect(watcher.enter).toHaveBeenCalledWith('foobar');
        expect(watcher.exit).toHaveBeenCalledWith('foobar');
    });
});
