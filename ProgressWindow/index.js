const { BrowserWindow } = require("electron");
const path = require("path");
/**
 * @typedef {Object} ProgressWindowOptions
 * @property {string} title
 * @property {Number} [height=200]
 * @property {Number} [width=400]
 */

class ProgressWindow {
    constructor() {}

    /**
     * Creates progress window.
     * @param {ProgressWindowOptions} options
     */
    static async Create(options) {
        const progressWindow = new ProgressWindow();

        progressWindow.window = new BrowserWindow({
            title: options.title,
            width: options.width || 400,
            height: options.height || 200,
            maximizable: false,
            minimizable: false,
            resizable: false,
            fullscreenable: false,
            closable: false,
            webPreferences: {
                preload: require.resolve("./preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: false,
            },
        });

        progressWindow.window.setMenuBarVisibility(false);
        await progressWindow.window.loadFile(path.join(__dirname, "progress.html"));

        return progressWindow;
    }

    /**
     * Sets progress message
     * @param {string} message
     */
    setMessage(message) {
        this.window.webContents.send("set_message", message);
    }

    /**
     * Sets progress percentage
     * @param {number} percentage
     */
    setPercentage(percentage) {
        this.window.webContents.send("set_percentage", percentage);
    }

    /**
     * Sets if window is closable
     * @param {Boolean} closable
     */
    setClosable(closable) {
        this.window.setClosable(closable);
    }

    /**
     * just call it and you will see
     */
    fail() {
        this.window.webContents.send("fail");
    }

    /**
     * setMessage but f a n c i e r
     * @param {string} message
     */
    setError(message) {
        this.setMessage(`${message.toString().replace(/\n/g, "<br />")}
        <br /><br />
        ${new Error().stack.replace(/\n/g, "<br />")}`);
    }

    /**
     * Closes progress window
     */
    close() {
        this.window.destroy();
    }

    /**
     * @private
     * @type {BrowserWindow}
     */
    window = null;
}

module.exports = ProgressWindow;
