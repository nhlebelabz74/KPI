const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
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

    win.loadURL('http://localhost:5173');
    // win.loadFile(path.join(__dirname, '../dist/index.html'));

    // Intercept new window events and open links in the default browser instead
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

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