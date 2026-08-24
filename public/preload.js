// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");


// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
});


contextBridge.exposeInMainWorld('electron', {
    openFileDialog: (fileTypes) => ipcRenderer.invoke('open-file-dialog', fileTypes),
    readFile: (path) => ipcRenderer.invoke('readFile', path),
    writeFile: (path, data) => ipcRenderer.invoke('writeFile', path, data),
    saveFileDialog: (defaultFilename) => ipcRenderer.invoke('save-file-dialog',defaultFilename),
    exportFile: (path, data) => ipcRenderer.invoke('exportFile', path, data),
    openLink: (link) => ipcRenderer.invoke('open-link',link),
    setEditStatus: (isEdited) => ipcRenderer.send('set-edit-status', isEdited),
    copyTextToClipboard: () => ipcRenderer.invoke('copy-to-clipboard'),
    pasteClipboardText: () => ipcRenderer.invoke('paste-clipboard-text'),
    readImageFile: (path) => ipcRenderer.invoke('read-image-file', path),
    ipcRenderer: {
      sendMessage(channel, args) {
        ipcRenderer.send(channel, args);
      },
      removeAllListeners(channel){
        ipcRenderer.removeAllListeners(channel);
      },
      on(channel, func) {
        const subscription = (_event, ...args) => func(...args);
        ipcRenderer.on(channel, subscription);
  
        // Return a cleanup function that removes the listener
        return () => {
          ipcRenderer.removeListener(channel, subscription);
        };
      },
      once(channel, func) {
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      },
    },
    // Add other file system operations as needed
  });