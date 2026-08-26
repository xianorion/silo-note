// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");
const ALLOWED_LISTEN_CHANNELS = ['undo', 'redo','new-file','open-file','export-file','save-file', 'save-file-as'];


// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
});

// Expose a limited API to the renderer process
// The renderer process can only access the APIs that we explicitly expose here
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
    subscribe: (channel, callback) => {
    // Security check: Ignore unauthorized channels
    if (!ALLOWED_LISTEN_CHANNELS.includes(channel)) {
      console.warn(`Blocked unauthorized listener registration on channel: ${channel}`);
      return () => {}; // Return a dummy cleanup function
    }

    // Wrap the callback to strip the internal Electron event object
    const subscription = (_event, ...args) => callback(...args);
    
    // Attach the listener
    ipcRenderer.on(channel, subscription);

    // Return a bulletproof cleanup function tied specifically to this instance
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
    
    // Add other file system operations as needed
  });