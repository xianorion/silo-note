import React, {FC, useEffect} from 'react';
import { Editor, getHTMLFromFragment } from '@tiptap/react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'; 
import { RetroToolbar, retroDropDownBtnStyle, retroMenuStyle } from '../styles/MainToolBarStyle';
import { ToggleActions } from './../types/GlobalTypes';
import { IpcRendererEvent } from 'electron';

interface MainToolbarProps {
editor: Editor ;
newFileEvent: (override: boolean) => Promise<void>,
saveFileEvent: ( isSaveAs: boolean) => Promise<void>,
openFileEvent: (override: boolean) => Promise<void>,
toggleEvent: (obj: string) => void

}

enum action {
  NEW = "NEW",
  SAVE =  "SAVE",
  SAVE_AS = "SAVE_AS",
  OPEN = "OPEN",
  CUT = "CUT",
  COPY = "COPY",
  PASTE = "PASTE",
  UNDO = "UNDO",
  REDO = "REDO",
  EXPORT_DOC = "EXPORT_DOC",
  EXPORT_PDF = "EXPORT_PDF",
  OPEN_MOODBOARD = "OPEN_MOODBOARD",
  OPEN_LINKS = "OPEN_LINKS",
}

enum DROPDOWN_OPTIONS {
  FILE= "FILE",
  EDIT = "EDIT",
  EXPORT = "EXPORT",
  VIEW = "VIEW"
}


const MainToolbar : FC<MainToolbarProps> = ({editor,newFileEvent,saveFileEvent, openFileEvent, toggleEvent}) =>{
 
  const [menuState, setMenuState] =  React.useState<{[key in DROPDOWN_OPTIONS]: HTMLElement | null}>({
    [DROPDOWN_OPTIONS.FILE]: null,
    [DROPDOWN_OPTIONS.EDIT]: null,
    [DROPDOWN_OPTIONS.EXPORT]: null,
    [DROPDOWN_OPTIONS.VIEW]: null
  });

  useEffect(() => {
    const undoListener = () => {
      handleAction(action.UNDO);
      console.log('Received from Electron: UNDO');
    };

    const redoListener = () => {
      handleAction(action.REDO, 'edit');
      console.log('Received from Electron: REDO');
    };
    const newFileListener = () => {
      handleAction(action.NEW);
    };

    const openListener = () => {
      handleAction(action.OPEN);
    };
    const saveFileListener = () => {
      handleAction(action.SAVE);
    };

    const saveAsFileListener = () => {
      handleAction(action.SAVE_AS);
    };

 // Listen for the response from the main process
    window.electron.ipcRenderer.on('undo', undoListener);
    window.electron.ipcRenderer.on('redo', redoListener);
    window.electron.ipcRenderer.on('new-file', newFileListener);
    window.electron.ipcRenderer.on('open-file', openListener);
    window.electron.ipcRenderer.on('save-file', saveFileListener);
    window.electron.ipcRenderer.on('save-as-file', saveAsFileListener);
    
    // Clean up the listener when the component unmounts
    return () => {
      window.electron.ipcRenderer.removeAllListeners('undo');
      window.electron.ipcRenderer.removeAllListeners('redo');
      window.electron.ipcRenderer.removeAllListeners('new-file');
      window.electron.ipcRenderer.removeAllListeners('open-file');
      window.electron.ipcRenderer.removeAllListeners('save-file');
      window.electron.ipcRenderer.removeAllListeners('save-as-file');

    }
  }, []);


  const handleAction = async (commmand: action |null, origin?: string |undefined) => {
    // event.preventDefault();
    console.log("Handing click...");
    // onClose(event);
    switch(commmand) {
      case action.NEW:
        newFileEvent( false);
        break;
      case action.SAVE:
        saveFileEvent(false);
        break;
        case action.SAVE_AS:
          saveFileEvent(true);
        break;
        case action.OPEN: {
         openFileEvent( false);
        }
        break;
        case action.COPY:{
          // const data = await window.electron.copyTextToClipboard()
          // console.log("pasting...: ", data);
         
          break;
        }
        case action.PASTE:{
          // // clipboard.writeText("clipboard.readText()");
          // const data = await window.electron.pasteClipboardText()
          // console.log("pasting...: ", data);
          break;
        }
        case action.CUT:{
          const from = editor.state.selection.from;
          const to = editor.state.selection.to;
          
          const endPos = editor.state.doc.nodeSize - 2;
          
          // Cut out content from range and put it at the end of the document
          editor.commands.cut({ from, to }, endPos);
          
        }
        break;
        case action.UNDO:{
          console.log("Undoing....");
          editor.chain().focus().undo().run();
        }
        break;  
        case action.REDO:{
          editor.chain().focus().redo().run();
        }
        break;
        case action.EXPORT_DOC:{
          
          break;
        }
        case action.EXPORT_PDF:{
          
          break;
        }

        case action.OPEN_MOODBOARD:{
          toggleEvent(ToggleActions.MB);
          break;
        }
        case action.OPEN_LINKS:{
          toggleEvent(ToggleActions.LINK);
          break;
        }

      default:
        break;

    }
    console.log("Handling close about to be called with origin: ", origin);
    if(origin !=undefined)
      handleClose(origin);

  }


 

    const handleClick = (menu:string) =>  (event: React.MouseEvent<HTMLButtonElement>) => {
      setMenuState((prevState) => ({
        ...prevState,
        [menu] : event.currentTarget,
      }));
    };

    const handleClose = (menu:string)  => {
      console.log("Maintoolbar - HANDLING CLOSE: ", menu);
      setMenuState((prevState) => ({
        ...prevState,
        [menu] : null,
      }));
    };

    return (
     <></>
    );
}

export default MainToolbar;