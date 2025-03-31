const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const { Buffer } = require('buffer');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations for hours tracking
  readHoursFile: async () => {
    const filePath = path.join(process.cwd(), 'hours.json');
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error reading hours file:', error);
      return null;
    }
  },
  
  saveHoursFile: async (data) => {
    const filePath = path.join(process.cwd(), 'hours.json');
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return filePath;
    } catch (error) {
      console.error('Error saving hours file:', error);
      throw error;
    }
  },

  // Qualitative KPI operations
  saveQualitativeData: async (kpiData) => {
    try {
      // Save text data to JSON
      const jsonPath = path.join(process.cwd(), 'qualitative-kpis.json');
      let existingData = {};
      
      if (fs.existsSync(jsonPath)) {
        existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      }
      
      // Merge new data with existing
      const mergedData = { ...existingData, ...kpiData.textData };
      fs.writeFileSync(jsonPath, JSON.stringify(mergedData, null, 2));
      
      // Save PDF files if they exist
      const savedFiles = {};
      for (const [kpiNumber, file] of Object.entries(kpiData.files)) {
        if (file) {
          const pdfPath = path.join(process.cwd(), `KPI-${kpiNumber}-Evidence.pdf`);
          const arrayBuffer = await file.arrayBuffer();
          fs.writeFileSync(pdfPath, Buffer.from(arrayBuffer));
          savedFiles[kpiNumber] = pdfPath;
        }
      }
      
      return { jsonPath, savedFiles };
    } catch (error) {
      console.error('Error saving qualitative data:', error);
      throw error;
    }
  },

  loadQualitativeData: async () => {
    const jsonPath = path.join(process.cwd(), 'qualitative-kpis.json');
    try {
      if (fs.existsSync(jsonPath)) {
        return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      }
      return {};
    } catch (error) {
      console.error('Error loading qualitative data:', error);
      return {};
    }
  },

  checkPdfExists: (kpiNumber) => {
    const pdfPath = path.join(process.cwd(), `KPI-${kpiNumber}-Evidence.pdf`);
    return fs.existsSync(pdfPath);
  },

  // General utilities
  getCurrentDir: () => process.cwd(),
  
  // External link handling
  openExternal: (url) => ipcRenderer.send('open-external', url),

  // File dialog for selecting files
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options)
});

// Security: Intercept clicks on anchor tags with external URLs
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href]');
    if (anchor && anchor.href.startsWith('http')) {
      event.preventDefault();
      window.electronAPI.openExternal(anchor.href);
    }
  });
});