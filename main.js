const { app, BrowserWindow } = require("electron");

let win;

function createWindow() {
    // Create the browser window
    win = new BrowserWindow({
        width: 750,
        height: 600,
        minWidth: 750,
        minHeight: 600,
        backgroundColor: "#ffffff",
        icon: `file://${__dirname}/dist/assets/logo.icns`,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        title: 'Tesla eyes'
    });

    win.loadURL(`file://${__dirname}/dist/index.html`);

    //// uncomment below line to open the DevTools.
    win.webContents.openDevTools()

    // Event when the window is closed.
    win.on("close", function () {
        win = null;
    });
}

// Create window on electron intialization
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On MacOS specific close process
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    // macOS specific close process
    if (win == null) {
        createWindow();
    }
});
