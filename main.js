const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let win;
const dataPath = () => path.join(app.getPath('userData'), 'prime-data.json');
const defaults = () => ({
  tasks: [], habits: [
    { id: 'h1', name: 'Wake up without scrolling', archived: false },
    { id: 'h2', name: 'Study with focus', archived: false },
    { id: 'h3', name: 'Practise programming', archived: false },
    { id: 'h4', name: 'Move my body', archived: false },
    { id: 'h5', name: 'Sleep on time', archived: false }
  ], habitLog: {}, morningLog: {}, morningItems: [
    { id: 'm1', name: 'Get out of bed without scrolling' },
    { id: 'm2', name: 'Wash up and get ready' },
    { id: 'm3', name: "Review today's priorities" },
    { id: 'm4', name: 'Begin the first planned activity' }
  ], studyTargets: [], sessions: [], phoneLogs: [], settings: { dailyPhoneTarget: 120, focusLength: 25 }
});
function readData() {
  try {
    const raw = fs.readFileSync(dataPath(), 'utf8');
    const parsed = JSON.parse(raw);
    return { ...defaults(), ...parsed, settings: { ...defaults().settings, ...(parsed.settings || {}) } };
  } catch { return defaults(); }
}
function writeData(data) {
  fs.mkdirSync(path.dirname(dataPath()), { recursive: true });
  const tmp = dataPath() + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, dataPath());
  return true;
}
function createWindow() {
  win = new BrowserWindow({
    width: 1320, height: 860, minWidth: 900, minHeight: 650,
    backgroundColor: '#0b0d12', title: 'PRIME OS',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile('index.html');
}
app.whenReady().then(() => {
  ipcMain.handle('data:load', () => readData());
  ipcMain.handle('data:save', (_event, data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid data format');
    return writeData(data);
  });
  ipcMain.handle('data:export', async (_event, data) => {
    const result = await dialog.showSaveDialog(win, { title: 'Export PRIME OS backup', defaultPath: 'prime-os-backup.json', filters: [{ name: 'JSON backup', extensions: ['json'] }] });
    if (result.canceled || !result.filePath) return { canceled: true };
    fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2), 'utf8');
    return { canceled: false, filePath: result.filePath };
  });
  ipcMain.handle('data:import', async () => {
    const result = await dialog.showOpenDialog(win, { title: 'Import PRIME OS backup', properties: ['openFile'], filters: [{ name: 'JSON backup', extensions: ['json'] }] });
    if (result.canceled || !result.filePaths[0]) return { canceled: true };
    try {
      const parsed = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8'));
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.habits)) throw new Error('This does not look like a PRIME OS backup.');
      return { canceled: false, data: parsed };
    } catch (e) { return { canceled: false, error: e.message || 'Could not read that backup.' }; }
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
