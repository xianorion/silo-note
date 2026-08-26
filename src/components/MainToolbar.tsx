import React, {FC, useEffect} from 'react';
import { Editor } from '@tiptap/react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'; 
import { RetroToolbar, retroDropDownBtnStyle, retroMenuStyle } from '../styles/MainToolBarStyle';
import { ToggleActions } from './../types/GlobalTypes';
import { IpcRendererEvent } from 'electron';
import { PDF_FILETYPE, TXT_FILETYPE } from '../utils/constants';

interface MainToolbarProps {
editor: Editor ;
newFileEvent: (override: boolean) => Promise<void>,
saveFileEvent: ( isSaveAs: boolean) => Promise<void>,
exportFileEvent: ( type: string) => Promise<void>,
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


const MainToolbar : FC<MainToolbarProps> = ({editor,newFileEvent,saveFileEvent, openFileEvent, exportFileEvent, toggleEvent}) =>{
 
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
     
    };
   const exportListener = (type:string) =>{
        if(type === 'TXT'){
          handleAction(action.EXPORT_DOC);
        }else if(type ==='PDF'){
          handleAction(action.EXPORT_PDF);
        }
        
      };
    const saveAsFileListener = () => {
      handleAction(action.SAVE_AS);
    };

 // Listen for the response from the main process
    window.electron.ipcRenderer.on('undo', undoListener);
    window.electron.ipcRenderer.on('redo', redoListener);
    window.electron.ipcRenderer.on('new-file', newFileListener);
    window.electron.ipcRenderer.on('open-file', openListener);
    window.electron.ipcRenderer.on('export-file', (event, type) => {exportListener(type); });    
    window.electron.ipcRenderer.on('save-file', saveFileListener);
    window.electron.ipcRenderer.on('save-as-file', saveAsFileListener);
    
    // Clean up the listener when the component unmounts
    return () => {
      window.electron.ipcRenderer.removeAllListeners('undo');
      window.electron.ipcRenderer.removeAllListeners('redo');
      window.electron.ipcRenderer.removeAllListeners('new-file');
      window.electron.ipcRenderer.removeAllListeners('open-file');
      window.electron.ipcRenderer.removeAllListeners('export-file');
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
          exportFileEvent(TXT_FILETYPE)
          break;
        }
        case action.EXPORT_PDF:{
          exportFileEvent(PDF_FILETYPE)
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
      <RetroToolbar>
      <div >
        <Button 
        sx={retroDropDownBtnStyle}
          id="basic-button"
          aria-controls={menuState.FILE ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuState.FILE ? 'true' : undefined}
          onClick={handleClick(DROPDOWN_OPTIONS.FILE)}
        >
          File
        </Button>
        <Menu
          id="basic-menu"
          sx={retroMenuStyle}
          anchorEl={menuState.FILE}
          open={!!menuState.FILE}
          onClose={()=>handleClose(DROPDOWN_OPTIONS.FILE)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={(e) => handleAction(action.NEW, DROPDOWN_OPTIONS.FILE)}>New</MenuItem>
          <MenuItem onClick={(e) => handleAction(action.OPEN,DROPDOWN_OPTIONS.FILE)}>Open</MenuItem>
          <MenuItem onClick={(e) => handleAction(action.SAVE,DROPDOWN_OPTIONS.FILE)}>Save</MenuItem>
          <MenuItem onClick={(e) => handleAction(action.SAVE_AS, DROPDOWN_OPTIONS.FILE)}>Save As</MenuItem>
        </Menu>
      </div>
      <div >
      <Button 
        sx={retroDropDownBtnStyle}
        id="basic-button"
        aria-controls={menuState.EDIT ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuState.EDIT ? 'true' : undefined}
        onClick={handleClick(DROPDOWN_OPTIONS.EDIT)}
      >
        Edit
      </Button>
      <Menu
        id="basic-menu"
        sx={retroMenuStyle}
        anchorEl={menuState.EDIT}
        open={!!menuState.EDIT}
        onClose={()=>handleClose(DROPDOWN_OPTIONS.EDIT)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={(e) => handleAction(action.UNDO, DROPDOWN_OPTIONS.EDIT)}>Undo</MenuItem>
        <MenuItem onClick={(e) => handleAction(action.REDO, DROPDOWN_OPTIONS.EDIT)}>Redo</MenuItem>
        {/* <MenuItem onClick={(e) => handleAction(action.COPY,e, DROPDOWN_OPTIONS.EDIT)}>Copy</MenuItem>
        <MenuItem onClick={(e) => handleAction(action.PASTE,e, DROPDOWN_OPTIONS.EDIT)}>Paste</MenuItem>
        <MenuItem onClick={(e) => handleAction(action.CUT,e, DROPDOWN_OPTIONS.EDIT)}>Cut</MenuItem> */}

      </Menu>
      </div>
      <div>
      <Button  
        sx={retroDropDownBtnStyle}
        id="basic-button"
        aria-controls={menuState.EXPORT ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuState.EXPORT ? 'true' : undefined}
        onClick={handleClick("Export")}
      >
        Export
      </Button>
      <Menu
        id="basic-menu"
        sx={retroMenuStyle}
        anchorEl={menuState.EXPORT}
        open={!!menuState.EXPORT}
        onClose={()=>handleClose(DROPDOWN_OPTIONS.EXPORT)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* <MenuItem onClick={() => handleClose(DROPDOWN_OPTIONS.EXPORT)}>Google Drive</MenuItem> */}
        <MenuItem onClick={(e) => handleAction(action.EXPORT_PDF, DROPDOWN_OPTIONS.EXPORT)}>PDF</MenuItem>
        <MenuItem onClick={(e) => handleAction(action.EXPORT_DOC, DROPDOWN_OPTIONS.EXPORT)}>Text</MenuItem>
      </Menu>
    </div>
    <div>
      <Button 
        sx={retroDropDownBtnStyle}
        id="basic-button"
        aria-controls={menuState.VIEW ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuState.VIEW ? 'true' : undefined}
        onClick={handleClick(DROPDOWN_OPTIONS.VIEW)}
      >
        View
      </Button>
      <Menu
        sx={retroMenuStyle}
        id="basic-menu"
        anchorEl={menuState.VIEW}
        open={!!menuState.VIEW}
        onClose={()=>handleClose(DROPDOWN_OPTIONS.VIEW)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={(e) => handleAction(action.OPEN_MOODBOARD, DROPDOWN_OPTIONS.VIEW)}>Mood Board</MenuItem>
        <MenuItem onClick={(e) => handleAction(action.OPEN_LINKS, DROPDOWN_OPTIONS.VIEW)}>Reference Links</MenuItem>
      </Menu>
    </div>
    </RetroToolbar>
    );
}

export default MainToolbar;