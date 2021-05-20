/* eslint-disable import/no-extraneous-dependencies */
const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const win = new BrowserWindow({
    title: 'CandleVault desktop client',
    autoHideMenuBar: true,
    backgroundColor: '#131722',
    minWidth: 400,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      contextIsolation: false,
    },
    show: false,
    icon: 'icon.ico',
  });

  win.loadFile('./index.html');
  win.maximize();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  autoUpdater.checkForUpdatesAndNotify().then(async (rs) => {
    console.log('Updates', rs);
    if (rs) {
      await rs.downloadPromise();
      autoUpdater.quitAndInstall();
    }
    if (process.platform !== 'darwin') app.quit();
  });
});
