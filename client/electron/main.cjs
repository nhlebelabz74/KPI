const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Auto updater configuration
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'nhlebelabz74',
  repo: 'KPI',
  private: false,
  releaseType: 'release',
  token: process.env.GH_TOKEN,
});

// Security: Validate file paths
const validatePath = (filePath) => {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  if (!resolvedPath.startsWith(process.cwd())) {
    throw new Error('Invalid file path');
  }
  return resolvedPath;
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true, // Keep sandbox enabled
      enableRemoteModule: false // Disable remote module for security
    }
  });

  // Load app
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadURL('https://kpi-tracker-lnp.netlify.app');
    // const indexPath = path.join(__dirname, '../dist/index.html');
    // if (fs.existsSync(indexPath)) {
    //   win.loadFile(indexPath);
    //   log.info('Loaded index.html from:', indexPath);
    //   win.webContents.openDevTools(); // Open DevTools in production for debugging
    // } else {
    //   log.error('Failed to load index.html');
    //   win.loadURL('about:blank');
    // }
  }

  // Handle external links
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
};

// Other IPC handlers (keep existing ones)
ipcMain.on('open-external', (_, url) => {
  if (/^https?:/i.test(url)) {
    shell.openExternal(url);
  }
});

ipcMain.handle('get-current-dir', () => process.cwd());

ipcMain.handle('show-open-dialog', async (_, options) => {
  return dialog.showOpenDialog(options);
});

// Auto updater events (keep existing)
autoUpdater.on('checking-for-update', () => log.info('Checking for updates...'));
autoUpdater.on('update-available', (info) => log.info('Update available:', info));
autoUpdater.on('update-not-available', (info) => log.info('No updates available:', info));
autoUpdater.on('error', (err) => log.error('Auto updater error:', err));
autoUpdater.on('download-progress', (progress) => log.info(`Download progress: ${progress.percent.toFixed(2)}%`));
autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded. Installing...');
  autoUpdater.quitAndInstall();
});

// App lifecycle (keep existing)
app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});