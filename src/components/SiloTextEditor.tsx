import React, { useState, ChangeEvent, useRef } from "react";
import Box from '@mui/material/Box';
import { Grid2 as Grid } from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ContextMenu from './ContextMenu';
import MoodBoardGui from "./MoodBoardGui";
import LinkListGui from "./LinkListGui";
import MainToolbar from "./MainToolbar";



const SiloTextEditor = () =>{
    const [text, setText] = useState<string>("");
    const [textHistory, setTextHistory] = useState<string[]>([text]);
    const textIndex = useRef(0);

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
    
      setContextMenuOpen(true);
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
      textIndex.current= textIndex.current +1; 
      setTextHistory([...textHistory.slice(0, textIndex.current), newText]);

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

    const moveCursorTo = (position:number) =>{
      const editor= textEditorRef.current;
      const selection = window.getSelection();

      if(editor && selection){

         // Create a new range and set the cursor position
          const range = document.createRange();
          const textNode = editor.firstChild; // Get the text node (assuming it's the first child)
          console.log("children: ",editor.childNodes);
          if (textNode) {
            // Set the start of the range at the desired position (mousePos.start)
            range.setStart(textNode, position);
            range.setEnd(textNode, position); // Collapse the range to the start (this places the cursor)

            // Apply the range to the selection
            selection.removeAllRanges();
            selection.addRange(range);
          }
          setMousePos({start: position, end: position});

      }
     
    }

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
      const editor= textEditorRef.current;
      const selection = window.getSelection();
      console.log("selection is: ", selection);

      if (selection &&editor) {
        editor.focus();
        let writtenText = editor.innerText;
        const afterPasteText = writtenText.slice(0, mousePos.start) + textToPaste;
        writtenText = afterPasteText + writtenText.slice(mousePos.end);
        console.log("The new text i now: ", writtenText);

        editor.innerText = writtenText;
         //move cursor to after paste
         moveCursorTo(afterPasteText.length);

        console.log("Text pasted: ", textToPaste);
     
      }
    }

    const handleTextCut = () => {
      const editor= textEditorRef.current;
      const selection = window.getSelection();
      console.log("selection is: ", selection);

      if (selection &&editor) {
        let writtenText = editor.innerText;
        const afterPasteText = writtenText.slice(0, mousePos.start);
        writtenText = afterPasteText + writtenText.slice(mousePos.end);
        console.log("The new text i now: ", writtenText);

        editor.innerText = writtenText;
        //move cursor to after cut
         moveCursorTo(afterPasteText.length);
      }
    }

    const undoEvent = () =>{
      const editor= textEditorRef.current;
      const selection = window.getSelection();

      if(textIndex.current > 0 ){

        textIndex.current= textIndex.current - 1;   
        if (selection &&editor) {
          let writtenText = editor.innerText;
  
          editor.innerText = textHistory[textIndex.current];
          setText(editor.innerText);
          //move cursor to after cut
           moveCursorTo(writtenText.length -1);
        }
        
      }
     

    }

    const redoEvent = () =>{
      const editor= textEditorRef.current;
      const selection = window.getSelection();

      if(textIndex.current < textHistory.length -1 ){

        textIndex.current= textIndex.current + 1;   
        if (selection &&editor) {
          let writtenText = editor.innerText;
  
          editor.innerText = textHistory[textIndex.current];
          setText(editor.innerText);
          //move cursor to after cut
           moveCursorTo(writtenText.length +1);
        }
        
      }
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
    
     

    return (
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
        handleTextCutEvent={handleTextCut}
        handleUndoEvent = {undoEvent}
        handleRedoEvent={redoEvent}
        onClose={closeContextMenu} 
        />}
  
      <MainToolbar 
      selectedText={selectedText} 
       handlePasteEvent={handleTextPaste} 
       handleTextCutEvent={handleTextCut}
       handleUndoEvent = {undoEvent}
       handleRedoEvent={redoEvent}
       onClose={closeContextMenu} 
      />

      <Toolbar 
      sx={{ display: 'flex', }}
      >
       
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
      
      </div>
      
      </Toolbar>
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, md: 8 }}>
      <Box
            contentEditable
            suppressContentEditableWarning
            ref={textEditorRef}
            onInput={handleChange}
            onMouseUp={handleTextSelection}
            sx={{
                fontFamily:'Poiret-One-Latin',
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