import React, {FC, useRef, useEffect} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

interface ContextMenuProps {
  style?: React.CSSProperties; // style prop for inline styles
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  onClose: (event: MouseEvent) => void;
}

const listItemTextStyle = {
  fontSize: '13px',
  m:'0px',
  paddin: '10px'
}

const ContextMenu: FC<ContextMenuProps> = ({style, onClose}) =>{

  const menuRef = useRef<HTMLDivElement>(null);

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
      backgroundColor: 'white',
      position: 'absolute',
      border: '1px solid #ccc',
      width: '20%', maxWidth: '30%',
      borderRadius: '4px',
    
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'  // Optional shadow for a modal effect
    }} >
 <List >
    <ListItem disablePadding>
     
      <ListItemText primary="Undo" 
      primaryTypographyProps={{...listItemTextStyle}}
      />
    </ListItem>
    <ListItem disablePadding>
      {/* <ListItemAvatar>
        <Avatar>
          <WorkIcon />
        </Avatar>
      </ListItemAvatar> */}
      <ListItemText primary="Redo" primaryTypographyProps={{...listItemTextStyle}}
      />
    </ListItem>
    <ListItem disablePadding>
      <ListItemText primary="Cut" primaryTypographyProps={{...listItemTextStyle}}/>
    </ListItem>
    <ListItem disablePadding>
      <ListItemText primary="Copy" primaryTypographyProps={{...listItemTextStyle}}/>
    </ListItem>
    <ListItem disablePadding>
      <ListItemText primary="Paste"  primaryTypographyProps={{...listItemTextStyle}}/>
    </ListItem>
    <ListItem disablePadding>
      <ListItemText primary="Paste With Link" primaryTypographyProps={{...listItemTextStyle}}/>
    </ListItem>
  </List>
    </div>
   );

}

export default ContextMenu;