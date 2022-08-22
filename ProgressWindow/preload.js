const { ipcRenderer, contextBridge } = require("electron");

let events = {};

ipcRenderer.on("set_message", (e, message) => {
    events?.onMessageChange(message);
});

ipcRenderer.on("set_percentage", (e, percentage) => {
    events?.onPercentageChange(percentage);
});

ipcRenderer.on("fail", (e) => {
    events?.onFail();
});

contextBridge.exposeInMainWorld("setEvents", (newEvents) => {
    events = newEvents;
});
