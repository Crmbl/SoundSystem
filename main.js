const electron = require('electron');
const eletronReload = require('electron-reload')(__dirname);
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const path = require('path');
const url = require('url');

const ipc = electron.ipcMain;

let mainWindow;
let tray = null;
let labelButton = 'Play';
let contextMenu = null;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 590,
    height: 193,
    frame: false,
    transparent: true,
    resizable: process.env.NODE_ENV === 'development',
    icon: path.join(__dirname, '/public/img/logo.ico')
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.on('hide',function(event){
    event.preventDefault();
    tray = new Tray(path.join(__dirname, '/public/img/logo.ico'));
    buildMenu();
  });
}

function buildMenu() {
  contextManu = null;
  contextMenu = Menu.buildFromTemplate([
    {label: 'Maximize', role:'maximize', click: () => {
      mainWindow.show();
      tray.destroy();
    }},
    {label: labelButton, click: () => {
      mainWindow.webContents.send('toggle', '');
      if (labelButton == 'Play')
        labelButton = 'Pause';
      else
        labelButton = 'Play';
      buildMenu();
    }},
    {label: 'Close', role: 'close', click: () => app.quit()}
  ]);
  tray.setContextMenu(contextMenu);
}

exports.setLabelButton = arg => {
  if (arg == 'PLAYING')
    labelButton = 'Play';
  else
    labelButton = 'Pause';
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})
