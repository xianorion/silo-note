import React, {FC} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'; 
import {MainTextBox} from  './../styles/SiloTextBoxStyle';



const MainToolbar : FC = () =>{
  const [menuState, setMenuState] =  React.useState<{[key: string]: HTMLElement | null}>({
    File: null,
    Edit: null,
    Export: null,
    View: null
  });

 

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
        <MenuItem onClick={() => handleClose("Edit")}>Undo</MenuItem>
        <MenuItem onClick={() => handleClose("Edit")}>Redo</MenuItem>
        <MenuItem onClick={() => handleClose("Edit")}>Cut</MenuItem>
        <MenuItem onClick={() => handleClose("Edit")}>Copy</MenuItem>
        <MenuItem onClick={() => handleClose("Edit")}>Paste</MenuItem>
        <MenuItem onClick={() => handleClose("Edit")}>Paste With Link</MenuItem>
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