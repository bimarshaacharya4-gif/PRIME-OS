# PRIME OS — Windows desktop app

PRIME OS is a local-first personal productivity desktop app built with Electron, HTML, CSS, and JavaScript.

## Requirements
- Windows 10/11
- Node.js LTS (includes npm)
- Internet access for the first dependency installation only; the app itself works offline afterward

## Run in development
1. Install Node.js LTS from the official Node.js website if it is not installed.
2. Extract this folder somewhere convenient.
3. Open the `PRIME-OS` folder in VS Code.
4. Open Terminal → New Terminal.
5. Run:
   ```powershell
   npm install
   npm start
   ```

## Data persistence
Your data is stored in Electron's app data folder as `prime-data.json`, separate from browser storage. Closing and reopening the app preserves saved data. Use **Settings & backup → Export JSON** regularly. Import replaces current data only after confirmation.

## Features
- Dashboard, tasks, daily habits, historical habit check-ins
- Study planner for Physics, Chemistry, Mathematics, Computer Science, English, and Nepali
- Focus timer with subject/task association and saved completed sessions
- Manual phone-use logs and configurable target
- Morning routine check-ins
- Weekly analytics
- JSON backup and restore
- Offline use after dependencies are installed

## Limitations
- Phone usage is manual; this app cannot automatically read phone usage from a Windows desktop.
- This source project is run with Node/Electron. To create a standalone Windows installer, add a packaging tool such as Electron Forge or electron-builder and configure it separately.
- Import and export use native file dialogs. Keep backups somewhere safe.

## Notes
This is a starter build. Test the workflows you use and keep a JSON backup before importing or clearing data.
