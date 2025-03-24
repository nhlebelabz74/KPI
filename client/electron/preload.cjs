const { contextBridge, ipcRenderer } = require('electron');

// Expose an API to the renderer process for opening external links
contextBridge.exposeInMainWorld('electronAPI', {
    openExternal: (url) => ipcRenderer.send('open-external', url)
});

// Intercept clicks on anchor tags with external URLs
window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a[href]');
        if (anchor && anchor.href.startsWith('http')) {
            event.preventDefault();
            window.electronAPI.openExternal(anchor.href);
        }
    });
});