// Add this file to declare the `electron` object on the `window` global object.

declare global {
  interface FileReturnValue extends Electron.OpenDialogReturnValue{
    blob: string,
  }
    interface Window {
      types:{
        fileReturnValue: FileReturnValue
      }
      electron: {
        openFileDialog: (fileTypes) => Promise<FileReturnValue>;
        readFile: (filePath: string) => Promise<string | null>;
        writeFile: (filePath: string, content: string) => Promise<boolean>;
        saveFileDialog: (defaultFile: string) => Promise<string | null>;
        openLink: (link: string) => Promise<boolean>;
        setSaveStatus: (isSaved:boolean) => Promise<void>,

      };
    }
  }
  
  // This is required for TypeScript to know about the new `electron` object on the window.
  export {};