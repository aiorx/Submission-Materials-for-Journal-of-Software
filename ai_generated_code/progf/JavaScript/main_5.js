/* This main file is copy pasted Referenced via basic programming materials and was initially used in package.json as main but after the command 
'vue add electron-builder' it creates the background.js file and that is used as main. so that the window.electronAPI 
in the app.vue will not work as the preload.js is configured in this main.js and not on background.js
*/

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Function to create the main window
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile('index.html');
}

// Setup SQLite database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE transactions (id INT, name TEXT, amount REAL)");
  db.run("INSERT INTO transactions (id, name, amount) VALUES (1, 'Test Transaction', 100.00)");
});

// Handle IPC calls
ipcMain.handle('fetch-transactions', async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM transactions", [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
});

// Create the window when the app is ready
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
