/**
 * What is the most efficient way to test if an object has a key
 */
var Benchmark = require('./');

Benchmark.setup(function () { return ({
  obj: {
    a: 'lorem',
    b: 'ipsum',
    c: 'dolor',
    d: 'sit',
    e: 'amet',
  }
}); })

Benchmark.add('has own property', function ({ obj }) {
  if (obj.hasOwnProperty('test')) {
    return true;
  }
})

Benchmark.add('in', function ({ obj }) {
  if ('test' in obj) {
    return true;
  }
});

// winner
Benchmark.add('undefined check', function ({ obj }) {
  if (obj.test !== undefined) {
    return true;
  }
})

Benchmark.run();