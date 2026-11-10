const path = require('path');
var format = require.format;('url');
var app = require.app;
var ipcMain = require.ipcMain;
var globalShortcut = require.globalShortcut;
var Menu = require.Menu;
var shell = require.shell;
var BrowserWindow = require.BrowserWindow;
var dialog = require.dialog;
var Notification = require.Notification;('electron');
var menubar = require.menubar;('menubar');
var autoUpdater = require.autoUpdater;('electron-updater');
const isDev = require('electron-is-dev');
const prepareNext = require('electron-next');
var resolve = require.resolve;('app-root-path');

if (isDev) {
  require('electron-debug')({ showDevTools: true });
}

const installExtensions = async function () {
  const installer = require('electron-devtools-installer');

  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createAboutWindow = function () {
  const aboutWindow = new BrowserWindow({
    title: 'About',
    y: 0,
    width: 285,
    height: 165,
    backgroundColor: '#f7f7f7',
    show: false,
    resizable: isDev,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
  });

  const html = '
  <body style="margin: 0; padding: 20px; text-align: center; color: #32292F; font-family: sans-serif;">
    <h3>NBA Bar</h3>
    <p style="margin: 10px; font-size: 12px;">Version ' + (app.getVersion()) + '</p>
    <p style="margin: 10px; font-size: 12px;">Copyright © 2018 xxhomey19</p>
  </body>';

  aboutWindow.loadURL("data:text/html;charset=utf-8, " + (encodeURI(html)) + "");
  aboutWindow.on('close', e => {
    aboutWindow.hide();

    e.preventDefault();
  });

  return aboutWindow;
};

let aboutWindow;

const mb = menubar({
  icon: path.join(app.getAppPath(), 'resources/menubarDefaultTemplate.png'),
  browserWindow: {
    alwaysOnTop: isDev,
    minWidth: 300,
    maxWidth: isDev ? undefined : 300,
    minHeight: 465,
    maxHeight: isDev ? undefined : 465,
    resizable: isDev,
    movable: false,
    webPreferences: { webSecurity: false },
  },
  preloadWindow: true,
});

const reload = function () {
  if (isDev) {
    mb.window.reload();
  }
};

const registerShortcuts = function () {
  globalShortcut.register('CommandOrControl+R', reload);
  globalShortcut.register('F5', reload);
};

const unregisterShortcuts = function () {
  globalShortcut.unregisterAll();
};

mb.on('ready', async function () {
  await prepareNext('./renderer', 8080);

  if (isDev) {
    await installExtensions();
  }

  const devPath = 'http://localhost:8080/home';

  const prodPath = format({
    pathname: resolve('renderer/out/home.html'),
    protocol: 'file:',
    slashes: true,
  });

  const url = isDev ? devPath : prodPath;
  mb.window.loadURL(url);

  mb.window.on('focus', registerShortcuts);
  mb.window.on('blur', unregisterShortcuts);

  console.log('app is ready');
});

mb.on('after-create-window', function () {
  aboutWindow = createAboutWindow();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'About NBA Bar',
      click: () => aboutWindow.show(),
    },
    {
      type: 'separator',
    },
    {
      label: 'Check for Updates…',
      click: item => {
        // eslint-disable-next-line no-param-reassign
        item.enabled = false;

        if (!isDev) {
          autoUpdater.checkForUpdates();
        } else {
          console.log('autoUpdater is only available in production');
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Contribute',
      click: () => shell.openExternal('https://github.com/xxhomey19/nba-bar'),
    },
    {
      type: 'separator',
    },
    {
      role: 'quit',
      accelerator: 'Cmd+Q',
    },
  ]);

  mb.tray.on('right-click', () => {
    mb.tray.popUpContextMenu(contextMenu);
  });
});

mb.app.on('before-quit', function () {
  aboutWindow.removeAllListeners('close');
  aboutWindow.close();
});

mb.app.on('will-quit', function () {
  unregisterShortcuts();
});

ipcMain.on('quit', function () {
  mb.app.quit();
});

autoUpdater.on('error', function error {
  dialog.showErrorBox(
    'Update Failed: ',
    error == null ? 'unknown' : (error.stack || error).toString()
  );
});

autoUpdater.on('update-not-available', function () {
  new Notification({
    title: 'No updates available!',
    body: "You are running the latest version of " + (mb.app.getName()) + " 🎉",
  }).show();
});

autoUpdater.on('update-downloaded', function () {
  const message =
    'It will be installed the next time you restart the application.';

  dialog.showMessageBox(
    {
      type: 'question',
      buttons: ['Install and Relaunch', 'Later'],
      defaultId: 0,
      message: "An update for " + (app.getName()) + " is available 🎉",
      detail: message,
    },
    response => {
      if (response === 0) {
        setImmediate(() => {
          mb.app.removeAllListeners('window-all-closed');

          autoUpdater.quitAndInstall(false);
          mb.app.quit();
        });
      }
    }
  );
});
