const electron = require('electron')
const {app, BrowserWindow, ipcMain, Tray} = electron
const path = require('path')

const assetsDirectory = path.join(__dirname, 'assets')
const iconsDirectory = path.join(__dirname, 'icons')

let tray = undefined
let window = undefined

require('electron-debug')();

// Don't show the app in the doc
app.dock.hide()
app.commandLine.appendSwitch("ignore-certificate-errors")

app.on('ready', () => {
  createTray()
  createWindow()
})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit()
})

const createTray = () => {
  //tray = new Tray(path.join(assetsDirectory, 'sunTemplate.png'))
  tray = new Tray(path.join(iconsDirectory,'8x8-Logo.png'))
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()

  const {width, height} =  electron.screen.getPrimaryDisplay().workAreaSize

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {x: x, y: y}
}

const createWindow = () => {
  window = new BrowserWindow({
    width: 300,
    height: 500,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  })

  window.webContents.openDevTools()

  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  //window.loadURL(`https://192.84.19.117:8445/sso/login?bg=0`)
  //window.loadURL(`https://192.84.19.117:8445/logout`)

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })


  window.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    window.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  });

}

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

ipcMain.on('login-updated', (event, data) => {
     //window.loadURL(`http://www.google.com`);
     //window.loadURL(`file://${path.join(__dirname, 'index.html')}`)
     window.loadURL(`https://192.84.19.117:8445/sso/login?bg=0`)
     console.log(data);
})
