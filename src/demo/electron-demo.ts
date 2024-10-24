import { app, BrowserWindow, globalShortcut } from 'electron'
import { OverlayController, OVERLAY_WINDOW_OPTS } from '../index'
import path from 'path'

// https://github.com/electron/electron/issues/25153
app.disableHardwareAcceleration()

let window: BrowserWindow

const toggleMouseKey = 'CmdOrCtrl + J'
const toggleShowKey = 'CmdOrCtrl + K'
const expandKey = 'CmdOrCtrl + E'

function createWindow () {
  window = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload script remains in JS
      nodeIntegration: true,
      contextIsolation: false
    },
    ...OVERLAY_WINDOW_OPTS
  })

  window.loadURL("http://localhost:3000/overlay")

  // NOTE: if you close Dev Tools overlay window will lose transparency
  window.webContents.openDevTools({ mode: 'detach', activate: false })

  makeDemoInteractive()

  OverlayController.attachByTitle(
    window,
    process.platform === 'darwin' ? 'Roblox' : 'Untitled - Notepad',
    { hasTitleBarOnMac: true }
  )
}

function makeDemoInteractive () {
  let isInteractable = false

  function toggleOverlayState () {
    if (isInteractable) {
      isInteractable = false
      OverlayController.focusTarget()
      window.webContents.send('focus-change', false)
    } else {
      isInteractable = true
      OverlayController.activateOverlay()
      window.webContents.send('focus-change', true)
    }
  }

  window.on('blur', () => {
    isInteractable = false
    window.webContents.send('focus-change', false)
  })

  globalShortcut.register(toggleMouseKey, toggleOverlayState)

  // globalShortcut.register(toggleShowKey, () => ws.send(JSON.stringify({op: 3, cmd: toggleShowKey, id})))
  // globalShortcut.register(expandKey, () => ws.send(JSON.stringify({op: 3, cmd: expandKey, id})))
  globalShortcut.register(expandKey, () => {
    if (window) {
      console.log('yes')
      window.webContents.send('commandKeyPressed', 'CmdShiftE');
    }
  });

}

app.on('ready', () => {
  setTimeout(
    createWindow,
    process.platform === 'linux' ? 1000 : 0 // https://github.com/electron/electron/issues/16809
  )
})
