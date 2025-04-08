const { contextBridge, ipcRenderer } = require('electron');

// Expose a minimal API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // General utilities
  getCurrentDir: () => ipcRenderer.invoke('get-current-dir'),
  
  // External link handling
  openExternal: (url) => {
    if (typeof url === 'string' && /^https?:/i.test(url)) {
      ipcRenderer.send('open-external', url);
    }
  },

  // File dialog
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options)
});

// Handle external links securely
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href]');
    if (anchor && /^https?:/i.test(anchor.href)) {
      event.preventDefault();
      window.electronAPI.openExternal(anchor.href);
    }
  });
});