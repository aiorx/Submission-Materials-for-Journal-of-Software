var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var autoUpdater = require('electron-updater').autoUpdater;
var mainWinDimensions = require('common/mainWinDimensions');
var mainWinContent = require('common/mainWinContent');
var mainWinIcon = require('common/mainWinIcon');
var mainWinMenu = require('common/mainWinMenu');

let mainWin

const gotTheLock = app.requestSingleInstanceLock()

const inDev = process.env.NODE_ENV === 'development'

autoUpdater.checkForUpdatesAndNotify()

function createMainWin() {
  const [width, height] = mainWinDimensions()

  mainWin = new BrowserWindow({
    width,
    height,
    title: 'Exam Simulator',
    icon: mainWinIcon,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWin.loadURL(mainWinContent(inDev))

  mainWin.setMenu(mainWinMenu())

  installReactDevtools(inDev)

  mainWin.on('close', function () {
    mainWin = null
  })
}

function installReactDevtools(inDev) {
  if (inDev) {
    var REACT_DEVELOPER_TOOLS = require.REACT_DEVELOPER_TOOLS;('electron-devtools-installer')
    mainWin.webContents.openDevTools({ mode: 'detach' })

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(function name { return console.log("Installed -->  " + (name) + ""); })
      .catch(console.log)
  }
}

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', function () {
    if (mainWin) {
      if (mainWin.isMinimized()) {
        mainWin.restore()
      }
      mainWin.focus()
    }
  })
  app.on('ready', createMainWin)
}

app.on('window-all-closed', function () { return app.quit(); })
