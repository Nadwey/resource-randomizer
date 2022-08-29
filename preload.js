const { RendererBridge } = require("electronbb");
const { contextBridge } = require("electron");
const rendererBridge = new RendererBridge();

const Randomize = rendererBridge.GetSync("Randomize");

contextBridge.exposeInMainWorld("Randomize", Randomize);
