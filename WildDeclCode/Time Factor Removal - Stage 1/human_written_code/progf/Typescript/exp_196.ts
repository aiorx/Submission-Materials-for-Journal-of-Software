var MyChart = require('./main').MyChart;
var Testing = require('cdk8s').Testing;

describe('Placeholder', function () {
  test('Empty', () => {
    const app = Testing.app();
    const chart = new MyChart(app, 'test-chart');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
});
