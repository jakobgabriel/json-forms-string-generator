// Modules
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { fork } = require('child_process')
const isDev = require('electron-is-dev')
const fs = require('fs')
const Store = require('electron-store')
const store = new Store()

console.log('starting app')

const RWP = fork(
  isDev
    ? './public/processes/RWP.js'
    : process.resourcesPath + '/processes/RWP.js'
)

RWP.on('error', console.log)

let isSavingsList = []

RWP.on('message', ({ type, data, extra }) => {
  console.log({ type, data, extra })

  switch (type) {
    case 'save-combo': {
      isSavingsList = isSavingsList.filter((item) => item !== extra.removeal)
      mainWindow.webContents.send('update-active-ms-id', data, extra.id)
      break
    }

    case 'read-excel': {
      mainWindow.webContents.send('readFile-reply', data)
      break
    }

    case 'open-uni': {
      mainWindow.webContents.send('open-uni', data)
      break
    }

    case 'error': {
      if (extra)
        if (extra.type === 'save-combo') {
          isSavingsList = isSavingsList.filter(
            (item) => item !== extra.removeal
          )
        }
      mainWindow.webContents.send('notify', { message: data })
      mainWindow.webContents.send('stop-loading')
      break
    }

    default:
      console.log(data)
  }
})

ipcMain.on('open-uni', (e, data) => {
  RWP.send({ type: 'open-uni', data })
})

const sendState = (e, state) => {
  if (uniSummaryWindow) {
    uniSummaryWindow.webContents.send('state', state)
  }
}

ipcMain.on('open-uni-summary', (e, state) => {
  if (uniSummaryWindow) uniSummaryWindow.show()
  else {
    uniSummaryWindow = new BrowserWindow({
      width: 1062,
      minWidth: 1062,
      height: 630,
      minHeight: 630,
      backgroundColor: '#f7f8fa',
      // transparent: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    })

    uniSummaryWindow.removeMenu()
    uniSummaryWindow.once('ready-to-show', () => {
      uniSummaryWindow.show()

      uniSummaryWindow.webContents.send('state', state)

      ipcMain.on('state', sendState)
    })
    require('@electron/remote/main').enable(uniSummaryWindow.webContents)

    uniSummaryWindow.loadURL(
      isDev
        ? 'http://localhost:3000#/unisummary'
        : `file://${path.join(__dirname, '../build/index.html#/unisummary')}`
    )
    // uniSummaryWindow.webContents.openDevTools()
  }

  uniSummaryWindow.on('closed', () => {
    ipcMain.removeListener('state', sendState)
    uniSummaryWindow = null
  })
})

ipcMain.on(
  'save-combo',
  (e, { readPath, combo, title, homeFolderPath, stateUpdate, masterId }) => {
    // let fs = require('fs')

    console.log('save to sheet')

    if (!isSavingsList.includes(combo + title + masterId)) {
      isSavingsList.push(combo + title + masterId)

      if (fs.existsSync(readPath)) {
        console.log('file exist')
        RWP.send({
          type: 'save-combo',
          data: {
            readPath,
            writePath: readPath,
            combo,
            title,

            homeFolderPath,
            stateUpdate,
            masterId,
          },
        })
      } else {
        var glob = require('glob')
        console.log('file does not exist')
        console.log('Search in excel folder')
        glob(
          `**/${readPath.split('/').splice(-1)[0]}`,
          {
            cwd: homeFolderPath + '/ito/main/excel',
            absolute: true,
            nodir: true,
          },
          (er, files) => {
            if (files.length !== 0) {
              console.log('found in excel folder')
              let newPath = files[0]

              RWP.send({
                type: 'save-combo',
                data: {
                  readPath: newPath,
                  writePath: newPath,
                  combo,
                  title,
                  homeFolderPath,
                  stateUpdate,
                  masterId,
                },
              })

              mainWindow.webContents.send('update-active-ms-save', {
                path: newPath,
              })
            } else {
              console.log('not found in excel folder')
              console.log('retrive a backup')
              let backupPath =
                homeFolderPath +
                '/ito/backup/excel/' +
                readPath.split('/').splice(-1)[0]
              if (fs.existsSync(backupPath)) {
                console.log('found backup')
                RWP.send({
                  type: 'save-combo',
                  data: {
                    readPath: backupPath,
                    writePath: readPath,
                    combo,
                    title,
                    homeFolderPath,
                    stateUpdate,
                    masterId,
                  },
                })
              } else {
                console.log('did not found a backup')
                mainWindow.webContents.send('notify', {
                  message: 'File not found / no backup',
                })
              }
            }
          }
        )
      }
    } else console.log('processing saving this')
  }
)

ipcMain.on('readFile', (e, path, title) => {
  RWP.send({ type: 'read-excel', data: { path, title } })
})

require('@electron/remote/main').initialize()

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow, uniSummaryWindow

ipcMain.on('open-Dashboard', () => {
  uniSummaryWindow.close()
  mainWindow.show()
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
  require('@electron/remote/main').enable(mainWindow.webContents)
  // Load index.html into the new BrowserWindow
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000#/dashboard'
      : `file://${path.join(__dirname, '../build/index.html#/dashboard')}`
  )

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools()
  // Listen for window being closed

  let listener = (e) => {
    e.preventDefault()
    mainWindow.webContents.send('closeApp')
  }

  mainWindow.on('close', listener)

  ipcMain.on('close', () => {
    mainWindow.removeListener('close', listener)
    mainWindow.close()
  })

  mainWindow.on('closed', (e) => {
    mainWindow = null
    if (uniSummaryWindow) uniSummaryWindow.close()
    uniSummaryWindow = null
  })
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  RWP.kill()
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
    console.log('closing')
    RWP.kill()
    app.quit()
  })

  // When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
  app.on('activate', () => {
    if (mainWindow === null) createWindow()
  })
}
