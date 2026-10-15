const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('primeAPI', {
  load: () => ipcRenderer.invoke('data:load'),
  save: (data) => ipcRenderer.invoke('data:save', data),
  exportData: (data) => ipcRenderer.invoke('data:export', data),
  importData: () => ipcRenderer.invoke('data:import')
});
