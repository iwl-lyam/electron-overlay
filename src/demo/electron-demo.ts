import { app, BrowserWindow, globalShortcut } from "electron";
import { OverlayController, OVERLAY_WINDOW_OPTS } from "../index";
import path from "path";

// https://github.com/electron/electron/issues/25153
app.disableHardwareAcceleration();

let window: BrowserWindow;

const toggleMouseKey = "CmdOrCtrl + J";

function createWindow() {
  window = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Ensure this path is correct
      nodeIntegration: true,
      contextIsolation: true,
    },
    ...OVERLAY_WINDOW_OPTS,
  });

  window.loadURL("http://localhost:3000/overlay");

  // NOTE: if you close Dev Tools overlay window will lose transparency
  window.webContents.openDevTools({ mode: "detach", activate: false });

  makeDemoInteractive();

  OverlayController.attachByTitle(
    window,
    process.platform === "darwin" ? "Roblox" : "Untitled - Notepad",
    { hasTitleBarOnMac: true }
  );
}

function makeDemoInteractive() {
  let isInteractable = false;

  function toggleOverlayState() {
    if (isInteractable) {
      isInteractable = false;
      OverlayController.focusTarget();
      window.webContents.send("focus-change", false);
    } else {
      isInteractable = true;
      OverlayController.activateOverlay();
      window.webContents.send("focus-change", true);
    }
    if (window) window.webContents.send("commandKeyPressed", "Cmd+J");
  }

  window.on("blur", () => {
    isInteractable = false;
    window.webContents.send("focus-change", false);
  });

  globalShortcut.register(toggleMouseKey, toggleOverlayState);

  // globalShortcut.register(toggleShowKey, () => ws.send(JSON.stringify({op: 3, cmd: toggleShowKey, id})))
  // globalShortcut.register(expandKey, () => ws.send(JSON.stringify({op: 3, cmd: expandKey, id})))
  globalShortcut.register("CmdOrCtrl + E", () => {
    if (window) window.webContents.send("commandKeyPressed", "Cmd+E");
  });
  globalShortcut.register("CmdOrCtrl + Shift + E", () => {
    if (window) window.webContents.send("commandKeyPressed", "Cmd+Shift+E");
  });
  globalShortcut.register("CmdOrCtrl + Shift + K", () => {
    if (window) window.webContents.send("commandKeyPressed", "Cmd+Shift+K");
  });
  globalShortcut.register("CmdOrCtrl + Shift + V", () => {
    if (window) window.webContents.send("commandKeyPressed", "Cmd+Shift+V");
  });
  globalShortcut.register("Alt + C", () => {
    if (window) window.webContents.send("commandKeyPressed", "Alt+C");
  });
  globalShortcut.register("Alt + H", () => {
    if (window) window.webContents.send("commandKeyPressed", "Alt+H");
  });
  globalShortcut.register("Alt + L", () => {
    if (window) window.webContents.send("commandKeyPressed", "Alt+L");
  });
  globalShortcut.register("Alt + O", () => {
    if (window) window.webContents.send("commandKeyPressed", "Alt+O");
  });
}

app.on("ready", () => {
  setTimeout(
    createWindow,
    process.platform === "linux" ? 1000 : 0 // https://github.com/electron/electron/issues/16809
  );
});
