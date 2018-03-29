const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const debug = true;

let mainWindow;

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});


function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        fullscreenable: false,
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    createMenu();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                { role: 'close' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' }
            ]
        },
        {
            role: 'window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Source Code',
                    click() { require('electron').shell.openExternal('https://github.com/vlaaadislav/sudoku') }
                },
                {
                    label: 'Learn More',
                    click() { require('electron').shell.openExternal('https://electronjs.org') }
                }
            ]
        }
    ];

    if (debug) {
        template[template.length - 1].submenu.push({ role: 'toggledevtools' });
    }

    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);
}
