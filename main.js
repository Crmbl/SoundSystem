//! CHANGE THIS VALUE development/production !//
process.env.NODE_ENV = 'production';
//!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/
const electron = require('electron');
if (process.env.NODE_ENV === 'development') {
  const eletronReload = require('electron-reload')(__dirname);
}
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const path = require('path');
const url = require('url');
const ipc = electron.ipcMain;
const fs = require('fs');

let mainWindow;
let tray = null;
let labelButton = 'None';
let pathToIcon = '/public/img/play.ico';
let contextMenu = null;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 590,
    height: 193,
    frame: false,
    transparent: true,
    resizable: process.env.NODE_ENV === 'development',
    icon: path.join(__dirname, '/public/img/logo.ico'),
    webPreferences: { devTools: process.env.NODE_ENV === 'development' } 
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

  mainWindow.on('hide', function(event) {
    event.preventDefault();
    tray = new Tray(path.join(__dirname, '/public/img/logo.ico'));
    tray.addListener("double-click", () => { mainWindow.show(); tray.destroy(); });
    mainWindow.setSkipTaskbar(true);
    buildMenu();
  });

  mainWindow.on('show', function() {
    mainWindow.setSkipTaskbar(false);
    if (labelButton == 'None') return;

    if (labelButton == 'Play')
      buildThumbarButtons(true);
    else
      buildThumbarButtons(false);
  });
}

function buildMenu() {
  contextManu = null;
  if (labelButton == 'None') {
    contextMenu = Menu.buildFromTemplate([
      {label: 'Maximize', role:'maximize', click: () => {
        mainWindow.show();
        tray.destroy();
      }},
      {label: 'Close', role: 'close', click: () => app.quit()}
    ]);
  } else {
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
  }

  tray.setContextMenu(contextMenu);
}

exports.setLabelButton = isPaused => {
  if (isPaused == true)
    labelButton = 'Play';
  else if (isPaused == false)
    labelButton = 'Pause';
  else
    labelButton = 'None';
}

function buildThumbarButtons(isPaused) {
  if (isPaused == true)
    pathToIcon = '/public/img/play.ico';
  else
    pathToIcon = '/public/img/pause.ico';

  mainWindow.setThumbarButtons([
    {
      icon: path.join(__dirname, pathToIcon),
      click() { mainWindow.webContents.send('toggle', ''); }
    }
  ]);
}

exports.buildThumbar = arg => {
  buildThumbarButtons(arg);
}

exports.removeThumbar = arg => {
  mainWindow.setThumbarButtons([]);
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
})
