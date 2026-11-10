var Application = require('@loopback/core').Application;
var ApplicationConfig = require('@loopback/core').ApplicationConfig;
var HttpServer = require('@loopback/http-server').HttpServer;
var express = require('express');
var path = require('path');
var WebSocketController = require('./controllers').WebSocketController;
var WebSocketServer = require('./websocket.server').WebSocketServer;

// tslint:disable:no-any

class WebSocketDemoApplication extends Application {
  readonly httpServer: HttpServer;
  readonly wsServer: WebSocketServer;

  constructor(options: ApplicationConfig = {}) {
    super(options);

    /**
     * Create an Express app to serve the home page
     */
    const expressApp = express();
    const root = path.resolve(__dirname, '../../public');
    expressApp.use('/', express.static(root));

    // Create an http server backed by the Express app
    this.httpServer = new HttpServer(expressApp, options.websocket);

    // Create ws server from the http server
    const wsServer = new WebSocketServer(this.httpServer);
    this.bind('servers.websocket.server1').to(wsServer);
    wsServer.use(function (socket, next) {
      console.log('Global middleware - socket:', socket.id);
      next();
    });
    // Add a route
    const ns = wsServer.route(WebSocketController, /^\/chats\/\d+$/);
    ns.use(function (socket, next) {
      console.log(
        'Middleware for namespace %s - socket: %s',
        socket.nsp.name,
        socket.id,
      );
      next();
    });
    this.wsServer = wsServer;
  }

  start() {
    return this.wsServer.start();
  }

  stop() {
    return this.wsServer.stop();
  }
}
