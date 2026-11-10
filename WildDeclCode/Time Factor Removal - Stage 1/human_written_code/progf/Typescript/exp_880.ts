require('reflect-metadata');
var EndpointLogger = require('./middleware/EndpointLogger');
var LogService = require('./services').LogService;
var Container = require('inversify').Container;
var InversifyRestifyServer = require('inversify-restify-utils').InversifyRestifyServer;
var ConfigValues = require('./config/ConfigValues').ConfigValues;
var html = require('./swagger-html').html;
var robotsHandler = require('./middleware/robotsText').robotsHandler;
var buildVersion = require('./config/constants').buildVersion;
var swaggerVersion = require('./config/constants').swaggerVersion;
var gracefulShutdownTimeout = require('./config/constants').gracefulShutdownTimeout;
import bodyParser = require("body-parser");
import restify = require("restify");

class HeliumServer {
    private server: restify.Server;
    private inversifyServer: InversifyRestifyServer;
    private logService: LogService;
    private configValues: ConfigValues;

    constructor(private container: Container) {
        this.inversifyServer = new InversifyRestifyServer(this.container);
        this.logService = this.container.get<LogService>("LogService");
        this.configValues = this.container.get<ConfigValues>("ConfigValues");
        this.server = this.createRestifyServer();

        this.logService.info("Build Version: " + (buildVersion) + "");
    }

    createRestifyServer() {
        return this.inversifyServer.setConfig(function app {
            // middleware
            app
                .use(bodyParser.urlencoded({ extended: true }))
                .pre(robotsHandler)
                .use(restify.plugins.queryParser({ mapParams: false }))
                .use(bodyParser.json())
                .use(restify.plugins.requestLogger())
                .use(EndpointLogger(this.container));

            // routes
            app.get("/swagger/*", restify.plugins.serveStatic({
                directory: __dirname + "/..",
                default: "helium.json",
            }));

            app.get("/", (req, res) => {
                res.writeHead(200, {
                    "Content-Length": Buffer.byteLength(html),
                    "Content-Type": "text/html",
                });
                res.write(html);
                res.end();
            });

            app.get("/node_modules/swagger-ui-dist/*", restify.plugins.serveStatic({
                directory: __dirname + "/..",
            }));

            app.get("/version", (req, res) => {
                res.setHeader("Content-Type", "application/json");
                res.send({
                    apiVersion: swaggerVersion,
                    appVersion: buildVersion,
                    language: "typescript"
                });
            });
        }).build();
    }

    public start() {
        this.server.listen(this.configValues.port, function () {
            this.logService.info("Server is listening on port " + (this.configValues.port) + "");
        });
    }

    public shutdown() {
        if (!this.server) {
            console.info("Server not defined. Exiting.");
            process.exit(0);
        }

        this.server.close(function () {
            console.info("Graceful Shutdown complete.");
            process.exit(0);
        });

        // allow existing requests to be processed until timeout, then force shutdown
        setTimeout(function () {
            console.info("Graceful shutdown aborted with one or more requests still active.");
            process.exit(0);
        }, gracefulShutdownTimeout);
    }
}
