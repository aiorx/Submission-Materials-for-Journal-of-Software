var app = require('electron').app;
var webContents = require('electron').webContents;
var parse = require('url').parse;
var EventEmitter = require('events').EventEmitter;
var PROTOCOL_SCHEME = require('../constants').PROTOCOL_SCHEME;
var isBackgroundPage = require('../utils/web-contents').isBackgroundPage;

const sendToExtensionPages = function (channel: string, ...args: any[]) {
  webContents.getAllWebContents().forEach((wc) => {
    if (wc.isDestroyed() || !wc.getURL().startsWith(PROTOCOL_SCHEME)) return;
    wc.send(channel, ...args);
  });
};

export declare interface BackgroundPages {
  on(
    event: 'created',
    listener: function (webContents: Electron.WebContents) { return void; },
  ): this;
  on(event: string, listener: Function): this;
}

class BackgroundPages extends EventEmitter {
  public constructor() {
    super();

    app.on('web-contents-created', function (e, wc) {
      if (isBackgroundPage(wc)) {
        this.emit('created', webContents);
      }
    });
  }

  public get(extensionId: string, session: Electron.Session) {
    return webContents
      .getAllWebContents()
      .find(
        function (x) { return isBackgroundPage(x) &&
          parse(x.getURL()).hostname === extensionId &&
          x.session === session; },
      );
  }
}
