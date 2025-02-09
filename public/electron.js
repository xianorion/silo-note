// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, protocol, ipcMain, dialog, shell } = require("electron");
const path = require("path");
var fs = require("fs");
const url = require("url");
let mainWindow;
let hasConfirmedClose = false;
let isContentEdited = true; 

// Create the native browser window.
function createWindow() {
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
 
  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);
 
  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}


 
// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    },
  );
}
 
// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();
 
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

   // Prevent sudden close without saving...
   mainWindow.on("close", async (e) => {
    console.log("On close activated with hasConfirmedClose as", hasConfirmedClose);
    try{
      if (!hasConfirmedClose) {
        e.preventDefault(); // Prevent default close action until confirmation
  
        // Await the dialog confirmation
        const choice = await dialog.showMessageBox(mainWindow, {
          type: "question",
          buttons: ["Yes", "No"],
          title: "Confirm",
          message: isContentEdited?"Are you sure you want to quit? You're text file isn't saved.":"Are you sure you want to quit?",
        });
  
        if (choice.response === 0) {
          console.log("Quitting....");
          hasConfirmedClose = true; // Set the confirmation flag to true
          app.quit(); // Close the app
        }
      }
    }catch(e){
      console.log("error closing app: ", e);
    }
   
  });

// Listen for changes to the save state from the renderer (React)
ipcMain.on('set-save-status', (event, isSaved) => {
  console.log("Is content isContentEdited?", isContentEdited);
  isContentEdited = isSaved;
});

});

// select a folder dialog and return the file path
// ipcMain.handle('select-folder-dialog', async () => {
//     const result = await dialog.showOpenDialog(mainWindow, {
//       properties: ['openDirectory','createDirectory'],
//       buttonLabel: 'Save'
//     });
//     return result.filePaths[0];  // Return the path of the selected file
//   });
ipcMain.handle('save-file-dialog', async (event, defaultFilename) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      buttonLabel: 'Save',
      defaultPath: defaultFilename,
    });
    return result.filePath;  // Return the path of the selected file
  });


// Open the file dialog and return the file data
ipcMain.handle('open-file-dialog', async (event, fileTypes) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      buttonLabel: 'Open',
      filters: [
        { name: 'Files', extensions: fileTypes},
      ]
    });
    if (result.canceled) {
      return null;  // Return null if user cancels
    }
  
    const selectedFilePath = result.filePaths[0];  // Get the first selected file path
  
    // Read the file as a Blob
    const fileBuffer = fs.readFileSync(selectedFilePath); // Read file as buffer
    // Convert the Buffer to a base64 string
    const fileData = fileBuffer.toString('base64');

    return { ...result, blob: fileData };  // Return both the file path and Blob
  });



ipcMain.handle('readFile', async (event, path) => {
    try {
      const data = await fs.promises.readFile(path, 'utf8');
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  });

  ipcMain.handle('writeFile', async (event, path, data) => {
    try {
      await fs.promises.writeFile(path, data);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  });

  //take in a link from the elction application and opens it in a browser
  ipcMain.handle("open-link", async(event, link)=>{
    let returnObj = {status: 200, msg:""}
    if (typeof link === 'string' && link.startsWith('http')) {
      shell.openExternal(link);
    } else {
      returnObj.status = 400;
      returnObj.msg = "Invalid URL:, "+link+"\n"+"Please use links prefixed with 'https://' or 'http:'"
      console.error('Invalid URL:', link);  // Log error if URL is invalid

    }

    return 

  }); 
// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
 
// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
 
    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});
 
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.