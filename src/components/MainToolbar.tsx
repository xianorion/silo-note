import React, {FC} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'; 
import {MainTextBox} from  './../styles/SiloTextBoxStyle';

interface MainToolbarProps {
  style?: React.CSSProperties; // style prop for inline styles
  selectedText: string | null,
  handlePasteEvent: (text:string) => void,
  handleTextCutEvent: () => void,
  handleUndoEvent: () => void,
  handleRedoEvent: () => void,
  onClose: (event: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent> ) => void;

}

enum action {
  COPY =  "COPY",
  PASTE = "PASTE",
  CUT = "CUT",
  UNDO = "UNDO",
  REDO = "REDO",
}


const MainToolbar : FC<MainToolbarProps> = ({selectedText, handlePasteEvent,handleTextCutEvent,handleUndoEvent, handleRedoEvent, onClose}) =>{
  const [menuState, setMenuState] =  React.useState<{[key: string]: HTMLElement | null}>({
    File: null,
    Edit: null,
    Export: null,
    View: null
  });

  const handleAction = (commmand: action |null, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    // event.preventDefault();
    console.log("Handing click...");
    console.log("with selection", selectedText);
    // onClose(event);
    switch(commmand) {
      case action.COPY:
        if (selectedText) {
          // Copy to the clipboard
          navigator.clipboard.writeText(selectedText)
            .then(() => {
              console.log("Text copied to clipboard");
            })
            .catch((error) => {
              console.error("Failed to copy text: ", error);
            });
        } 
        break;
        case action.PASTE: {
          navigator.clipboard.readText().then(
            (res) =>{
              handlePasteEvent(res)
              console.log("text to paste is ", res);

            }
          );
        }
        break;
        case action.CUT:{
          if(selectedText){
            navigator.clipboard.writeText(selectedText).then(
              (res)=>{
                handleTextCutEvent();
                console.log("text to cut is ", res);
              }
            ).catch(()=>{
              console.log("ERROR: Cutting text failed...")
            });
          }
          
        }
        break;
        case action.UNDO:{
          handleUndoEvent();
        }
        break;  
        case action.REDO:{
          handleRedoEvent();
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
          <MenuItem onClick={() => handleClose("File")}>New</MenuItem>
          <MenuItem onClick={() => handleClose("File")}>Open</MenuItem>
          <MenuItem onClick={() => handleClose("File")}>Save</MenuItem>
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
        <MenuItem onClick={(e) => handleAction(action.CUT,e)}>Cut</MenuItem>
        <MenuItem onClick={(e) => handleAction(action.COPY,e)}>Copy</MenuItem>
        <MenuItem onClick={(e) => handleAction(action.PASTE,e)}>Paste</MenuItem>
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