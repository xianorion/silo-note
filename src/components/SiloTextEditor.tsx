import React, { useState, ChangeEvent } from "react";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'; 
import InsertLinkIcon from '@mui/icons-material/InsertLinkRounded'
import ContextMenu from './ContextMenu';



const SiloTextEditor = () =>{
    const [text, setText] = useState("Welcome!");
    const [fontSize, setFontSize] = useState('3');
    const [contextMenuOpen, setContextMenuOpen] = React.useState<boolean>(false);
    const [contextMenuPos, setContextMenuPos] =  React.useState<{x:number, y:number}>({x:0 , y:0});
  
    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      console.log("Showing menu: ", contextMenuOpen);
      setContextMenuOpen(true);
      console.log("Showing menu after..: ", contextMenuOpen);
      console.log("Showing menu x..: ", event.clientX);
      console.log("Showing menu y..: ", event.clientY);

      setContextMenuPos({x: event.clientX, y: event.clientY});
    }

    const closeContextMenu = (event: React.MouseEvent | MouseEvent) =>{
      event.preventDefault();
      setContextMenuOpen(false);
    }
 

    const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
        console.log("font size is: ", fontSize);
        setText(event.currentTarget.innerHTML)
    }


    const applyStyle = (command: string, value?: string) => {
        if(command === "fontSize"){
            console.log("Font size in apply is: ",value);

        }
        document.execCommand(command, false, value);
      };

      const changeFontSize = (type : string) =>{
        let newFontSize = fontSize;
        const value = +fontSize;
        if(type === 'subtract' && value > 1){
            newFontSize = `${Number(value-1)}`;
        }else if (type === 'add' && value < 7){
            newFontSize = `${Number(value+1)}`;
        }
        setFontSize(newFontSize);
        applyStyle("fontSize", newFontSize);
      }
    
      const [open, setOpen] = React.useState(false);

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };


    return (
        // <TextField  style={mainToolBarStyle}>
        <div onContextMenu={handleContextMenu} onMouseLeave={closeContextMenu}  >
        { contextMenuOpen && <ContextMenu style={{left: contextMenuPos.x, top: contextMenuPos.y}} onClose={closeContextMenu} />}
  
        <div>

             <Toolbar sx={{ display: 'flex', }}>
        <Button  onClick={() => applyStyle('bold')}>
        <img src={'/img/text-editor-imgs/format_bold.svg'}/> 

        </Button>
        <Button onClick={() => applyStyle('italic')}>
            <img src={'/img/text-editor-imgs/format_italic.svg'}/> 
        </Button>
        <Button  onClick={() => applyStyle('underline')}>
        <img src={'/img/text-editor-imgs/format_underlined.svg'}/> 
        </Button>
        <Button  onClick={() => applyStyle('foreColor', 'red')}>
        <img src={'/img/text-editor-imgs/color_lens.svg'}/> 
        </Button>
       
      <div>
      <Button  onClick={() => changeFontSize("subtract")}>
        <img src={"/img/text-editor-imgs/subtract_icon.svg"}/>
        </Button>
        <img src={'/img/text-editor-imgs/format_size.svg'}/> 

        <Button  onClick={() => changeFontSize("add")}>
        <img src={"/img/text-editor-imgs/add_icon.svg"}/>
        </Button>
      </div>

      <div>
      <Button  onClick={handleClickOpen}>
        <InsertLinkIcon/>
        </Button>
         <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>
      </div>
      
      </Toolbar>
    
      <Box
            contentEditable
            suppressContentEditableWarning
            onInput={handleChange}
            sx={{
                minHeight: '200px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                outline: 'none',
                textAlign: 'left',
                '&:focus': {
                  border: '1px solid #D3D3D3',
                },
              }}
            >

            </Box>
    </div>
          
        </div>

    );
}

export default SiloTextEditor;