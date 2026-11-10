var app = require('electron').app;
var globalShortcut = require('electron').globalShortcut;
var is = require('electron-util').is;
var EventEmitter = require('events').EventEmitter;
var log = require('electron-log');
var autoUpdater = require('electron-updater').autoUpdater;

var getStore = require('../shared/store').getStore;
var Topic = require('../shared/constants/topic').Topic;
var CoreManager = require('./windows/CoreManager');
var LogHandlerManager = require('./windows/LogHandlerManager');
var SuspensionManager = require('./windows/SuspensionManager');
var LoginManager = require('./windows/LoginManager');
var Tray = require('./tray');

class Launcher extends EventEmitter {
  coreManager?: CoreManager

  logHandlerManager?: LogHandlerManager

  suspensionManager?: SuspensionManager

  loginManager?: LoginManager

  tray?: Tray

  constructor() {
    super()

    global.managers = {
      coreManager: null,
      logHandlerManager: null,
      suspensionManager: null,
      loginManager: null,
    }

    this.makeSingleInstance(this.init.bind(this))
    this.handleLoginWindow.call(this)
  }

  init(): void {
    this.appUpdater()

    this.coreManager = new CoreManager({
      onInit: function (window) {
        if (is.development) {
          window.webContents.on('did-frame-finish-load', () => {
            window.webContents.once('devtools-opened', () => {
              window.focus()
            })
            window.webContents.openDevTools()
          })
          window.webContents.openDevTools()
        }
      },
      onDestroy: function () {
        this.logHandlerManager?.destroy()
        this.suspensionManager?.destroy()
        global.managers.coreManager = null
      },
    })
    this.logHandlerManager = new LogHandlerManager({
      onInit: function (window) {
        if (is.development) {
          window.webContents.on('did-frame-finish-load', () => {
            window.webContents.openDevTools()
          })
          window.webContents.openDevTools()
        }
      },
      onDestroy: function () {
        global.managers.logHandlerManager = null
      },
    })
    this.suspensionManager = new SuspensionManager({
      onInit: function (window) {
        if (is.development) {
          window.webContents.on('did-frame-finish-load', () => {
            window.webContents.openDevTools()
          })
          window.webContents.openDevTools()
        }
      },
      onDestroy: function () {
        global.managers.suspensionManager = null
      },
    })
    global.managers.coreManager = this.coreManager
    global.managers.logHandlerManager = this.logHandlerManager
    global.managers.suspensionManager = this.suspensionManager

    if (is.macos) {
      app.dock?.show()
    }

    this.tray = Tray.init()
  }

  makeSingleInstance(callback: function () { return void; }): void {
    const gotSingleLock = app.requestSingleInstanceLock()

    if (!gotSingleLock) {
      app.quit()
    } else {
      app.on('second-instance', function () {
        this.coreManager?.show()
      })
    }

    app
      .whenReady()
      .then(callback)
      .catch(function (err) { return log.error(err); })

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (
        global.managers.coreManager === null &&
        global.managers.logHandlerManager === null &&
        global.managers.suspensionManager === null
      ) {
        this.init()
      }
      this.coreManager?.show()
    })

    app.on('window-all-closed', function () {
      app.quit()
    })

    app.on('will-quit', function () {
      // 注销所有快捷键
      globalShortcut.unregisterAll()
    })
  }

  appUpdater(): void {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    const url = 'https://dl.hs.chenyueban.com/app'
    autoUpdater.setFeedURL(url)
    autoUpdater.on(
      'download-progress',
      function ({
        percent,
      }: {
        total: number
        delta: number
        transferred: number
        percent: number
        bytesPerSecond: number
      }) {
        this.tray?.showUpdateDownloadProgress(percent)
        this.coreManager?.window?.setProgressBar(percent / 100)
        if (percent === 100) {
          this.coreManager?.window?.setProgressBar(-1)
        }
      }
    )
    autoUpdater.checkForUpdatesAndNotify({
      title: 'HBT - 发现新版本',
      body: "{appName} version {version} 已下载将在退出时自动安装",
    })
  }

  handleLoginWindow(): void {
    const store = getStore()
    store.subscribe(Topic.LOGIN, function (action) {
      if (action.payload.url) {
        this.loginManager = new LoginManager({
          url: action.payload.url,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onInit: () => {},
          onDestroy: () => {
            global.managers.loginManager = null
          },
        })
      }
    })
  }
}

module.exports = Launcher;
