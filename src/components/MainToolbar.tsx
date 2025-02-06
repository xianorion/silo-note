import React, {FC} from 'react';
import { Editor } from '@tiptap/react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'; 
import {MainTextBox} from  '../styles/SiloTextBoxStyle';

interface MainToolbarProps {
editor: Editor ;
newFileEvent: (event: React.MouseEvent<any>, override: boolean) => Promise<void>,
saveFileEvent: (event: React.MouseEvent<any>, isSaveAs: boolean) => Promise<void>,
openFileEvent: (event: React.MouseEvent<any>, override: boolean) => Promise<void>
}

enum action {
  NEW = "NEW",
  SAVE =  "SAVE",
  SAVE_AS = "SAVE_AS",
  OPEN = "OPEN",
  CUT = "CUT",
  UNDO = "UNDO",
  REDO = "REDO",
}


const MainToolbar : FC<MainToolbarProps> = ({editor,newFileEvent,saveFileEvent, openFileEvent}) =>{
 
  const [menuState, setMenuState] =  React.useState<{[key: string]: HTMLElement | null}>({
    File: null,
    Edit: null,
    Export: null,
    View: null
  });

  const handleAction = (commmand: action |null, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    // event.preventDefault();
    console.log("Handing click...");
    // onClose(event);
    switch(commmand) {
      case action.NEW:
        newFileEvent(event, false);
        break;
      case action.SAVE:
        saveFileEvent(event, false);
        break;
        case action.SAVE_AS:
          saveFileEvent(event, true);
        break;
        case action.OPEN: {
         openFileEvent(event, false);
        }
        break;
        case action.CUT:{
          const from = editor.state.selection.from;
          const to = editor.state.selection.to;
          
          const endPos = editor.state.doc.nodeSize - 2;
          
          // Cut out content from range and put it at the end of the document
          editor.commands.cut({ from, to }, endPos);
          
        }
        break;
        case action.UNDO:{
          editor.chain().focus().undo().run();
        }
        break;  
        case action.REDO:{
          editor.chain().focus().redo().run();
        }
        break;

      default:
        break;

    }

    handleClose("Edit");

  }


 

    const handleClick = (menu:string) =>  (event: React.MouseEvent<HTMLButtonElement>) => {
      setMenuState((prevState) => ({
        ...prevState,
        [menu] : event.currentTarget,
      }));
    };

    const handleClose = (menu:string) =>  (event: React.MouseEvent<HTMLButtonElement>) => {

      setMenuState((prevState) => ({
        ...prevState,
        [menu] : null,
      }));
    };

    return (
      <div style={{display: 'flex', justifyContent: 'normal', alignItems: 'center', width: '80%' }} >
      <div >
        <Button style={MainTextBox}
          id="basic-button"
          aria-controls={menuState.File ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuState.File ? 'true' : undefined}
          onClick={handleClick("File")}
        >
          File
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={menuState.File}
          open={!!menuState.File}
          onClose={handleClose("File")}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={(e) => handleAction(action.NEW,e)}>New</MenuItem>
          <MenuItem onClick={(e) => handleAction(action.OPEN,e)}>Open</MenuItem>
          <MenuItem onClick={(e) => handleAction(action.SAVE,e)}>Save</MenuItem>
          <MenuItem onClick={(e) => handleAction(action.SAVE_AS, e)}>Save As</MenuItem>
        </Menu>
      </div>
      <div >
      <Button style={MainTextBox}
        id="basic-button"
        aria-controls={menuState.Edit ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuState.Edit ? 'true' : undefined}
        onClick={handleClick("Edit")}
      >
        Edit
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={menuState.Edit}
        open={!!menuState.Edit}
        onClose={handleClose("Edit")}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={(e) => handleAction(action.UNDO,e)}>Undo</MenuItem>
        <MenuItem onClick={(e) => handleAction(action.REDO,e)}>Redo</MenuItem>
      </Menu>
      </div>
      <div>
      <Button style={MainTextBox}
        id="basic-button"
        aria-controls={menuState.Export ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuState.Export ? 'true' : undefined}
        onClick={handleClick("Export")}
      >
        Export
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={menuState.Export}
        open={!!menuState.Export}
        onClose={handleClose("Export")}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleClose("Export")}>Google Drive</MenuItem>
        <MenuItem onClick={() => handleClose("Export")}>PDF</MenuItem>
        <MenuItem onClick={() => handleClose("Export")}>DOC</MenuItem>
      </Menu>
    </div>
    <div>
      <Button style={MainTextBox}
        id="basic-button"
        aria-controls={menuState.View ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuState.View ? 'true' : undefined}
        onClick={handleClick("View")}
      >
        View
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={menuState.View}
        open={!!menuState.View}
        onClose={handleClose("View")}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleClose("View")}>Mood Board</MenuItem>
        <MenuItem onClick={() => handleClose("View")}>Reference Links</MenuItem>
      </Menu>
    </div>
    </div>
    );
}

export default MainToolbar;