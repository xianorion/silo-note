import React, { useState, ChangeEvent, useRef } from "react";
import Box from '@mui/material/Box';
import { Grid2 as Grid } from "@mui/material";
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
import MoodBoardGui from "./MoodBoardGui";
import LinkListGui from "./LinkListGui";



const SiloTextEditor = () =>{
    const [text, setText] = useState("Welcome!");
    const textEditorRef = useRef<HTMLInputElement>(null);
    const selectionRangeRef = useRef<Range | null>(null); // Ref to store the selection range

    const [fontSize, setFontSize] = useState('3');
    const [contextMenuOpen, setContextMenuOpen] = React.useState<boolean>(false);
    const [contextMenuPos, setContextMenuPos] =  React.useState<{x:number, y:number}>({x:0 , y:0});
    const [selectedText, setSelectedText] = React.useState<string |null>(null);
    const [mousePos, setMousePos] = React.useState<{start:number, end:number}>({start:0, end:0});

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        // Store the current selection range in the ref
        selectionRangeRef.current = selection.getRangeAt(0);
      }
    
      // console.log("Showing menu: ", contextMenuOpen);
      setContextMenuOpen(true);
      // console.log("Showing menu after..: ", contextMenuOpen);
      // console.log("Showing menu x..: ", event.clientX);
      // console.log("Showing menu y..: ", event.clientY);

      setContextMenuPos({x: event.clientX, y: event.clientY});
    }

    const closeContextMenu = (event: React.MouseEvent | MouseEvent) =>{
      event.preventDefault();
      setContextMenuOpen(false);
    }
 

    const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
      // We can directly use the div's innerText or innerHTML to update the state
      const newText:string = event.currentTarget.innerText;  // Use innerText for plain text
      setMousePos({start: newText.length, end: newText.length});
      // console.log(`mouse start: ${newText.length} \nand end:${newText.length}`);

      setText(newText);  // Update the text state
    };

    // const handleCursorPos = (event: React.MouseEvent) =>{
    //   if(textEditorRef.current){
    //     const newPos = textEditorRef.current.selectionStart || 0; // Get the cursor position directly
    //     setMousePos(newPos); // Update state with cursor position
    //     console.log("New cursor pos", newPos); // Log the updated cursor position
    //     console.log("mouse event info", event);
    //   }
    // }

    const handleTextSelection = (event: React.MouseEvent) => {
      //console.log("document selection info:  ",document.getSelection());
      const selection = window.getSelection();
      console.log("window Selection is: ", selection);
      const selectionText = selection?.toString();
      let start = 0, end = 0;
      if (selection) {
        if(selection.focusOffset > selection.anchorOffset){
          start = selection.anchorOffset;
          end = selection.focusOffset;
        }else{
          end = selection.anchorOffset;
          start = selection.focusOffset;
        }
        console.log(`mouse start: ${start} \nand end:${end}`);
        setMousePos({start, end});
        setSelectedText(selectionText || null);
      }
    };

    const handleTextPaste = (textToPaste: string) => {
      console.log("You are in the parent paste function");
      console.log("mosPos: ", mousePos);

      console.log("textEditorRef.current:", textEditorRef.current);
      const editor= textEditorRef.current;
      const selection = window.getSelection();
      console.log("selection is: ", selection);

      if (selection &&editor) {
        editor.focus();
        let writtenText = editor.innerText;
        writtenText = writtenText.slice(0, mousePos.start) + textToPaste + writtenText.slice(mousePos.end);
        console.log("The new text i now: ", writtenText);

        editor.innerText = writtenText;

        console.log("Text pasted: ", textToPaste);
     
      }
    }
    // const handleTextPaste = (textToPaste: string) => {
    //   console.log("You are in the parent paste function");
    //   console.log("mousePos: ", mousePos);
    
    //   const editor = textEditorRef.current;
    //   const selection = window.getSelection();
    //   console.log("selection is: ", selection);
    
    //   if (selection && editor) {
    //     // Loop through all ranges in the selection
    //     const rangeCount = selection.rangeCount;
        
    //     // The starting index for the paste text
    //     let pasteIndex = 0;
    
    //     for (let i = 0; i < rangeCount; i++) {
    //       const range = selection.getRangeAt(i);  // Get each range in the selection
    //       const startContainer = range.startContainer;
    //       const endContainer = range.endContainer;
    
    //       // Ensure we're working with text nodes
    //       if (startContainer.nodeType === Node.TEXT_NODE && endContainer.nodeType === Node.TEXT_NODE) {
    //         const rangeText = range.toString(); // Get the selected text
            
    //         console.log("Selected range:", rangeText);
    
    //         // Delete the selected text from the range
    //         range.deleteContents();
    
    //         // Create a new text node with the paste text for the current range
    //         const newTextNode = document.createTextNode(textToPaste.slice(pasteIndex, pasteIndex + rangeText.length));
            
    //         // Insert the new text node in place of the selected text
    //         range.insertNode(newTextNode);
            
    //         // Increment the paste index to move to the next chunk of text to paste
    //         pasteIndex += rangeText.length;
    
    //         // Optionally, move the cursor after the pasted text
    //         const newRange = document.createRange();
    //         newRange.setStartAfter(newTextNode);
    //         newRange.setEndAfter(newTextNode);
    //         selection.removeAllRanges();
    //         selection.addRange(newRange);
    
    //         console.log("Pasted text into range:", textToPaste.slice(pasteIndex, pasteIndex + rangeText.length));
    //       }
    //     }
    //   }
    // };
    

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
        <div 
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '4px',
          outline: 'none',

        }}
        onContextMenu={handleContextMenu} 
        onMouseLeave={closeContextMenu}   
        >
        { contextMenuOpen && <ContextMenu 
        style={{left: contextMenuPos.x, top: contextMenuPos.y}} 
        selectedText={selectedText} 
        handlePasteEvent={handleTextPaste} 
        onClose={closeContextMenu} 
        />}
  

             {/* <Toolbar sx={{ display: 'flex', }}>
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
        <DialogTitle>Paste Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Paste a link to apply to the selected text: \"${selectedText}\"`}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="Link"
            label="Link"
            //type="link"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Apply link</Button>
        </DialogActions>
      </Dialog>
      </div>
      
      </Toolbar> */}
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, md: 8 }}>
      <Box
            contentEditable
            suppressContentEditableWarning
            ref={textEditorRef}
            onInput={handleChange}
            onMouseUp={handleTextSelection}
            sx={{
                minHeight: '300px',
                minWidth: '100%',
                maxWidth: '100%',
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
      </Grid>
       <Grid size={{ xs: 6, md: 4 }}>
        <MoodBoardGui/>
        <LinkListGui/>
      </Grid>

    </Grid>
     

          
        </div>

    );
}

export default SiloTextEditor;