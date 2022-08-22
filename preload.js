const { RendererBridge } = require("electronbb");
const { contextBridge } = require("electron");
let rendererBridge = new RendererBridge();

const Randomize = rendererBridge.GetSync("Randomize");

contextBridge.exposeInMainWorld("Randomize", Randomize);
