const { app, BrowserWindow, shell, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const log = require('electron-log'); // Optional for debugging
require('dotenv').config();

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Load the app (dev or prod)
    if (process.env.NODE_ENV === 'development')
        win.loadURL('http://localhost:5173');
    else
        win.loadFile(path.join(__dirname, '../dist/index.html'));

    // Intercept new window events and open links in the default browser instead
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Check for updates on startup
    autoUpdater.checkForUpdatesAndNotify();
}

// Auto-updater events
autoUpdater.on('update-available', () => {
    log.info('Update available. Downloading...');
});

autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded. Restarting to install...');
    autoUpdater.quitAndInstall();
});

// Listen to messages from the preload to open external links
ipcMain.on('open-external', (event, url) => {
    shell.openExternal(url);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    // On macOS it is common for applications to stay open until the user explicitly quits.
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window even after all windows have been closed.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});