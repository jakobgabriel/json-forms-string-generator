// Modules
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow

let isOpeningLink = false
ipcMain.on('open-link', (e, link) => {
  if (!isOpeningLink) {
    isOpeningLink = true
    require('electron')
      .shell.openExternal(link)
      .then(() => {
        isOpeningLink = false
      })
  }
})

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1062,
    minWidth: 1062,
    height: 630,
    minHeight: 630,
    show: false,
    backgroundColor: '#fff',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })
  mainWindow.removeMenu()

  // Load index.html into the new BrowserWindow
  if (isDev) mainWindow.loadURL('http://localhost:3000')
  else
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    )

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Open DevTools
  if (isDev) mainWindow.webContents.openDevTools()
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // Electron `app` is ready
  app.on('ready', createWindow)

  // Quit when all windows are closed - (Not macOS - Darwin)
  app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin')
    app.quit()
  })

  // When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
  app.on('activate', () => {
    if (mainWindow === null) createWindow()
  })
}
