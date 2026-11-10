var Construct = require('constructs').Construct;
var App = require('cdk8s').App;
var Chart = require('cdk8s').Chart;
var ChartProps = require('cdk8s').ChartProps;

// imported constructs
var KubeDeployment = require('./imports/k8s').KubeDeployment;
var KubeService = require('./imports/k8s').KubeService;
var IntOrString = require('./imports/k8s').IntOrString;


class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const label = { app: 'hello-k8s' };

    new KubeService(this, 'service', {
      spec: {
        type: 'LoadBalancer',
        ports: [{ port: 80, targetPort: IntOrString.fromNumber(8080) }],
        selector: label
      }
    });

    new KubeDeployment(this, 'deployment', {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'hello-kubernetes',
                image: 'paulbouwer/hello-kubernetes:1.7',
                ports: [{ containerPort: 8080 }]
              }
            ]
          }
        }
      }
    });
  }
}

const app = new App();
new MyChart(app, 'hello');
app.synth();