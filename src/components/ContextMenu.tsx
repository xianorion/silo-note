import React, {FC, useRef, useEffect} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';
// import ImageIcon from '@mui/icons-material/Image';
// import WorkIcon from '@mui/icons-material/Work';
// import BeachAccessIcon from '@mui/icons-material/BeachAccess';

enum action {
  COPY =  "COPY",
  PASTE = "PASTE",
  CUT = "CUT",
  UNDO = "UNDO",
  REDO = "REDO",
}

interface ContextMenuProps {
  style?: React.CSSProperties; // style prop for inline styles
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  onClose: (event: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent> ) => void;
  selectedText: string | null,
  handlePasteEvent: (text:string) => void,
  handleTextCutEvent: () => void,
  handleUndoEvent: () => void,
  handleRedoEvent: () => void,
  editor?: HTMLInputElement
}

const listItemTextStyle = {
  fontSize: '13px',
  m:'0px',
  paddin: '10px'
}

const ContextMenu: FC<ContextMenuProps> = ({style, editor, selectedText, handlePasteEvent,handleTextCutEvent,handleUndoEvent, handleRedoEvent, onClose}) =>{

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = (commmand?: action |null) =>  (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    console.log("Handing click...");
    console.log("with selection", selectedText);
    onClose(event);
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

  }


  const handleClickAwayEvent = (event: MouseEvent) =>{
    if(menuRef.current && !menuRef.current.contains(event.target as Node)){
      onClose(event);

    }
  }

  useEffect(() => {
    document.addEventListener('click',handleClickAwayEvent );

    return () =>{
      document.removeEventListener('click', handleClickAwayEvent);
    }

    }
,[]);

    return (<div 
      ref={menuRef}
      style= {{
      ...style,
      zIndex: 1000,
      backgroundColor: 'var(--silo-paper)',
      position: 'absolute',
      border: '1px solid var(--silo-ink)',
      width: '8%',
      borderRadius: '4px',
      padding:'20px',
      boxShadow: '0 4px 6px rgba(75, 42, 27, 0.2)'  // Optional shadow for a modal effect
    }} >
 <List >
    <ListItem disablePadding>
     
      <ListItemText onClick={handleClick(action.UNDO)} primary="Undo" 
      primaryTypographyProps={{...listItemTextStyle}}
      />
    </ListItem>
    <ListItem disablePadding>
      <ListItemText onClick={handleClick(action.REDO)} primary="Redo" primaryTypographyProps={{...listItemTextStyle}}
      />
    </ListItem>
    <ListItem disablePadding>
      <ListItemText onClick={handleClick(action.CUT)} primary="Cut" primaryTypographyProps={{...listItemTextStyle}}/>
    </ListItem>
    <ListItem disablePadding>
      <ListItemText onClick={handleClick(action.COPY)} primary="Copy" primaryTypographyProps={{...listItemTextStyle}}/>
    </ListItem>
    <ListItem disablePadding>
      <ListItemText primary="Paste" onClick={handleClick(action.PASTE)}  primaryTypographyProps={{...listItemTextStyle}}/>
    </ListItem>
  </List>
    </div>
   );

}

export default ContextMenu;