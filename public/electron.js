// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, protocol, ipcMain, dialog, shell, clipboard, Menu} = require("electron");
const isMac = process.platform === 'darwin'
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
  //main menu 
  const template = [
    ...(isMac
      ? [{
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        }]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          click: () => {
            // Send IPC to React to call a function
            mainWindow.webContents.send('new-file');
          }
        },
        {
          label: 'Open',
          click: () => {
            // Send IPC to React to call a function
            mainWindow.webContents.send('open-file');
          }
        },
        {
          label: 'Save',
          click: () => {
            // Send IPC to React to call a function
            mainWindow.webContents.send('save-file');
          }
        }, {
          label: 'Save As',
          click: () => {
            // Send IPC to React to call a function
            mainWindow.webContents.send('save-as-file');
          }
        },
        isMac ? { role: 'close' } : { role: 'quit' },

      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          click: () => {
            // Send IPC to React to call a function
            mainWindow.webContents.send('undo');
          }
        },
        {
          label: 'Redo',
          click: () => {
            // Send IPC to React to call a function
            mainWindow.webContents.send('redo');
          }
        }
      ]
    },
    {
      label: 'Export',
      submenu: [
        {
          label: 'as .txt',
          click: () => {
            // Send IPC to React to call a function
            mainWindow.webContents.send('export-file',null, '.txt');
          }
        },
        {
          label: 'as .pdf',
          click: () => {
            // Send IPC to React to call a function
            mainWindow.webContents.send('export-file',null, ".pdf");
          }
        }
      ]
    },
    // other menu items...
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  //context menu template
  var contextTemplate = [
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
];
   // Build the context menu from the template
   const contextMenu = Menu.buildFromTemplate(contextTemplate);

   // Listen for right-click event to show the context menu
   mainWindow.webContents.on('context-menu', (e, params) => {
     contextMenu.popup({ window: mainWindow, x: params.x, y: params.y });
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
ipcMain.on('set-edit-status', (event, isEdited) => {
  console.log("isContentEdited current?", isContentEdited);

  isContentEdited = isEdited;
      console.log("isContentEdited new?", isContentEdited);

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

// Open the save file dialog and return the selected file path
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
      return {canceled: true};  // Return null if user cancels
    }
  
    const selectedFilePath = result.filePaths[0];  // Get the first selected file path
  
    // Read the file as a Blob
    const fileBuffer = fs.readFileSync(selectedFilePath); // Read file as buffer
    // Convert the Buffer to a base64 string
    const fileData = fileBuffer.toString('base64');

    return { ...result, blob: fileData };  // Return both the file path and Blob
  });


// Open the file dialog and return the file data
ipcMain.handle('readFile', async (event, path) => {
    try {
      const data = await fs.promises.readFile(path, 'utf8');

      //if file has images, load them first
      const fileData = JSON.parse(data);

      //loading the file images when the file loads to avoid space issues.
      if(fileData.imageRefs != null && fileData.imageRefs.length >0){
       //Read the file as a Blob
       fileData.imageRefs.forEach(element => {

        const imgFile = element.id;
        try{
          const fileBuffer = fs.readFileSync(imgFile); // Read file as buffer
          // Convert the Buffer to a base64 string
          const dataRecieved = fileBuffer.toString('base64');

          //set file data and convert it into base64 for app to read
          element.data = `data:image/png;base64,${dataRecieved}`;
          console.log("set data");

        }catch(e){
          console.log("Error reading file: ", e);
          element.data = null;
        }
       });
      }
      return JSON.stringify(fileData);
    } catch (err) {
      console.error(err);
      return null;
    }
  });

  // Write data to a file 
  ipcMain.handle('writeFile', async (event, path, data) => {
    try {
      await fs.promises.writeFile(path, data);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  });


  //TODO: add export to file functionality for PDF and TXT
  ipcMain.handle('exportToFile', async (event, path,type, data) => {
    try {
      if(type == 'PDF'){

      }else if(type == 'TXT'){
        
      }
      await fs.promises.writeFile(path, data);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  });

  //take in a link from the electron application and opens it in a browser
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
 
// copy and paste functionality
ipcMain.handle('copy-to-clipboard', (event, text) => {
  let textWritten=false;
  let pastedText='';

  let error=null;

  try{
    //write text that in clipboard
    pastedText = text;
    
    clipboard.writeText(pastedText, text);
    textWritten = true;
  }catch(e){
    error = e.toString();
  }
  return {status:textWritten, error, pasted: pastedText};
});

ipcMain.handle('paste-clipboard-text', () => {
  return clipboard.readText();
});

ipcMain.handle('read-image-file',(event, filePath)=>{
const ext = path.extname(filePath).slice(1).toLowerCase();
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    const buffer = fs.readFileSync(filePath);
    return `data:${mime};base64,${buffer.toString('base64')}`;

})