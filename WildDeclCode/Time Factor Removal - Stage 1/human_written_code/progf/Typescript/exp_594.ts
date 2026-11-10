var http = require('http');
var express = require('express');
var container = require('./inversify.config').container;
var Server = require('./server').Server;
var TYPES = require('./common/types');
var Log = require('./common/log').Log;
var Socket = require('./common/socket-util').Socket;
var CommonHandlers = require('./common/handlers').CommonHandlers;
var ResponseWriter = require('./common/response-writer').ResponseWriter;
var SystemInfoController = require('./service/system-info/system-info.controller').SystemInfoController;
var SystemStatsController = require('./service/system-stats/system-stats.controller').SystemStatsController;
var SystemFailureController = require('./service/system-failure/system-failure.controller').SystemFailureController;

class Application {

    private static readonly LOGGER = Log.getLogger("Application");
    private _httpHandler: express.Application;

    get httpHandler(): function (req: http.IncomingMessage, res: http.ServerResponse) { return void {
        return this._httpHandler;
    }

    public constructor() {
        this._httpHandler = express();
    }

    public start(): Promise<void> {
        Application.LOGGER.info("loading app...");
        return new Promise<void>((resolve, reject) => {

            let commonHandlers: CommonHandlers = new CommonHandlers();
            commonHandlers.handlers.forEach(handler => this._httpHandler.use(handler));

            let systemInfoController: SystemInfoController = container.get<SystemInfoController>(TYPES.SystemInfoController);
            this._httpHandler.use("/system", systemInfoController.getRouter());

            let systemStatsController: SystemStatsController = container.get<SystemStatsController>(TYPES.SystemStatsController);
            this._httpHandler.use("/stats", systemStatsController.getRouter());

            let systemFailureController: SystemFailureController = container.get<SystemFailureController>(TYPES.SystemFailureController);
            this._httpHandler.use("/failure", systemFailureController.getRouter());

            this._httpHandler.use(commonHandlers.errorHandler);
            Application.LOGGER.info("app loaded");
            return resolve();
        });
    }

    public initSocket(server: Server): void {
        let socket: Socket = container.get<Socket>(TYPES.Socket);
        socket.initSocketServer(server.server);
    }

    public close(): Promise<void> {
        Application.LOGGER.info("closing app...");
        let socket: Socket = container.get<Socket>(TYPES.Socket);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }; }}
