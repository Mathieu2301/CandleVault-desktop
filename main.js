const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    title: 'CandleVault desktop client',
    autoHideMenuBar: true,
    minWidth: 400,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      contextIsolation: false,
    },
    show: false,
    icon: 'icons/128.png',
  });

  win.loadFile('./index.html');

  win.on('ready-to-show', () => {
    win.maximize();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
