const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
require("./randomizer")();

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 560,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            sandbox: false,
        },
        resizable: false,
        maximizable: false,
    });

    if (isDev) win.setMenuBarVisibility(false);
    else win.setMenu(null);

    win.loadFile("index.html");
}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});
