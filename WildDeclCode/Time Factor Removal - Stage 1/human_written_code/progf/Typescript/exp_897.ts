declare var describe, it, expect, hot, cold, expectObservable, expectSubscriptions, rxTestScheduler, beforeEach;
var Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/of');
require('rxjs/add/observable/interval');
require('rxjs/add/operator/map');
require('rxjs/add/operator/combineall');
require('rxjs/add/operator/take');

describe('The combineAll operator examples', function () {
    describe('Example 1 - mapping to an inner observable', () => {
        it('should emit the result of both observables as an array', (done) => {
            let results = [];
            const source = Observable.interval(1000).take(2);
            const example = source.map(val => Observable.of(val));
            const combined = example.combineAll();
            const expected = [[0,1]];
            combined.subscribe({
                next: val => results.push(val),
                complete: () => {
                    expect(results).toDeepEqual(expected);
                    done();
                }
            });
        });
    });  
});