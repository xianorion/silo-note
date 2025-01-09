// Add this file to declare the `electron` object on the `window` global object.

declare global {
    interface Window {
      electron: {
        openFileDialog: () => Promise<Electron.OpenDialogReturnValue>;
        readFile: (filePath: string) => Promise<string | null>;
        writeFile: (filePath: string, content: string) => Promise<boolean>;
        saveFileDialog: (defaultFile: string) => Promise<string | null>;
      };
    }
  }
  
  // This is required for TypeScript to know about the new `electron` object on the window.
  export {};