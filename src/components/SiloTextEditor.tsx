import React, { useState,useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import { Grid2 as Grid } from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ContextMenu from './ContextMenu';
import MoodBoardGui from "./MoodBoardGui";
import LinkListGui from "./LinkListGui";
import MainToolbar from "./MainToolbar";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

const siloNodeTextBoxId = "SILOTEXT";


const SiloTextEditor = () =>{
    const [text, setText] = useState<string>("");
    const [textHistory, setTextHistory] = useState<string[]>([text]);
    const textIndex = useRef(0);
    const [selectedRange, setSelectedRange] = useState<{ node: number; start: number; end: number; }[]>([]);

    const textEditorRef = useRef<HTMLInputElement>(null);
    const selectionRangeRef = useRef<Range | null>(null); // Ref to store the selection range

    const [fontSize, setFontSize] = useState('3');
    const [contextMenuOpen, setContextMenuOpen] = React.useState<boolean>(false);
    const [contextMenuPos, setContextMenuPos] =  React.useState<{x:number, y:number}>({x:0 , y:0});
    const [selectedText, setSelectedText] = React.useState<string |null>(null);
    const [mousePos, setMousePos] = React.useState<{start:number, end:number}>({start:0, end:0});


    ///TEST STUFF
    


    ///-----------

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
 

    const sanitizeContent = (html: string): string => {
       html = html.replace(/<\/?(div|p|h1|h2|h3|h4|h5|h6|ul|ol|li)[^>]*>/gi, "");

      // // Convert <br> to newline characters (preserving line breaks)
      html = html.replace(/<br\s*\/?>/gi, "\n");
      return html;
    };
  

    const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
      // We can directly use the div's innerText or innerHTML to update the state
      //const newText:string = sanitizeContent(event.currentTarget.innerHTML);  // Use innerText for plain text
      const newText:string = event.currentTarget.innerText;  // Use innerText for plain text

      setMousePos({start: newText.length, end: newText.length});
      // console.log(`mouse start: ${newText.length} \nand end:${newText.length}`);
      textIndex.current= textIndex.current +1; 
      setTextHistory([...textHistory.slice(0, textIndex.current), newText]);
      console.log("nee text is: ", newText); 
      console.log("mouse position: ", newText.length);
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
          console.log("selection", selection);
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
    
      const selectionText = selection?.toString();
      let start = 0, end = 0;
      if (selection) {
        //const range = selection.getRangeAt(0);  // The range representing the selection
    
        // Get the start and end of the range
        // console.log("selction is: ", selection);
        // const startNode = range.startContainer;
        // const endNode = range.endContainer;

        //  // Get the start and end offsets
        // const startOffset = range.startOffset;
        // const endOffset = range.endOffset;
        
        // console.log(`Start Node:`, startNode);
        // console.log(`Start Node startNode TYPE:`, startNode.nodeType);

        
        // console.log(`Start Node PARENT:`, startNode.parentNode);
        // console.log(`Start Node PARENT ID IS:`, startNode.parentElement?.id);
        // console.log(`Start Node PARENT SIBLING:`, startNode.parentNode?.nextSibling);
        // console.log(`Start Node PARENT SIBLING TYPE:`, startNode.parentNode?.nextSibling?.nodeType);

        // console.log(`Start first child Node:`, startNode.TEXT_NODE);

        // console.log(`End Node:`, endNode);
        // console.log(`Start first child Node:`, endNode.TEXT_NODE);

        // console.log(`Start Offset: ${startOffset}`);
        // console.log(`End Offset: ${endOffset}`);
        // let totalLength = 0;
        let selectionSpan: {node:number, start:number, end:number}[] = [];
        let node = 0;

        // if (startNode !== endNode) {
        //   // You may want to handle each node separately here
        //   console.log("The selection spans across multiple nodes.");
        //   // If the selection spans multiple nodes, we loop through the nodes between startNode and endNode
        //   let nodePointer: Node | null = startNode;
        //    //get the parent node that not the text box
        //    let handleParent = false;
        //    while(nodePointer.parentNode && nodePointer.parentElement && nodePointer.parentElement.id != siloNodeTextBoxId){
        //     nodePointer = nodePointer.parentNode;
        //     handleParent = true;
        //    }

        //   // Loop through the nodes from startNode to the endNode (inclusive)
        //   console.log("------------STARTING NODE SCAN!!!-------------");
        //   while (nodePointer) {
        //     console.log("nodePointer: ", nodePointer);
        //     console.log("selection data is: ", selection);
        //       if(nodePointer === startNode || handleParent){
        //         handleParent=false;
        //         if(selection.focusOffset > selection.anchorOffset){
        //           start = selection.anchorOffset;
        //           end = selection.focusOffset;
        //         }else{
        //           end = selection.anchorOffset;
        //           start = selection.focusOffset;
        //         }
        //         end = nodePointer.textContent? nodePointer.textContent.length: end;

        //         selectionSpan = [{node:node++, start, end}];
        //         console.log("------------FIRST NODE SCANNED-------------");
        //         console.log("Adding start as..", start);
        //         console.log("Adding end as..", end);
        //       }else if (nodePointer.textContent){
        //         if(nodePointer.nextSibling != null){
        //           end = nodePointer.textContent.length;
        //         }else{
        //           if(selection.focusOffset > selection.anchorOffset){
        //             end = selection.focusOffset;
        //           }else{
        //             end = selection.anchorOffset;
        //           }
        //         }
        //         console.log("------------ADDING NODE...-------------");

        //         selectionSpan = [...selectionSpan, {node:node++, start: 0, end} ];
        //       }
        //     nodePointer = nodePointer.nextSibling; // Move to the next sibling node
        //     console.log("current span selection: ", selectionSpan);

        //   }
        //   console.log("------------END NODE SCAN-------------");
        //   // console.log("Selection span is: ", selectionSpan);
         
        // }else{
          if(selection.focusOffset > selection.anchorOffset){
            start = selection.anchorOffset;
            end = selection.focusOffset;
          }else{
            end = selection.anchorOffset;
            start = selection.focusOffset;
          }
          selectionSpan = [{node:node++, start, end}];
          console.log("Start should be: ", start);
          console.log("End should be: ", end);
          console.log("!!!!!!!!!! ONLY ONE NODE !!!!!!!!!!!!");

       // }
        console.log(">>>>>> FINAL selectionSpan", selectionSpan);
        console.log(">>>>>> selectionText [", selectionText,"]");
        setSelectedRange(selectionSpan);
        // console.log(`mouse start: ${start} \nand end:${end}`);
        setMousePos({start:start, end:end});
        // console.log("selected text:", selectionText);
        setSelectedText(selectionText || null);
      }
    };

    const handleTextPaste = (textToPaste: string) => {
      const editor= textEditorRef.current;
      const selection = window.getSelection();
      console.log("pasting in selected range, ", selectedRange); 

      if (selectedRange &&editor) {
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
      console.log("------ HANDLE TEXT CUT ------");
      const editor= textEditorRef.current;
      const selection = window.getSelection();
      console.log("selection is: ", selection);
      console.log(">>>>>> selectionText [", selectedText,"]");

      if (selectedRange && selectedRange.length >0  &&editor) {
        let writtenText = editor.innerText;
        console.log("Start should be: ", selectedRange[0].start);
        console.log("End should be: ", selectedRange[0].end);
        const afterPasteText = writtenText.slice(0, selectedRange[0].start);
        writtenText = afterPasteText + writtenText.slice(selectedRange[0].end);
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
           //moveCursorTo(writtenText.length -1);
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

      useEffect(() => {
        const div = document.getElementById(siloNodeTextBoxId)
        div?.focus();
        document.execCommand("selectAll", false, undefined);
        document.getSelection()?.collapseToEnd();
      }, [text])

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
            id={siloNodeTextBoxId}
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
                whiteSpace: 'pre-wrap',
                '&:focus': {
                  border: '1px solid #D3D3D3',
                },
              }}
              dangerouslySetInnerHTML={{ __html: text }}

            >
              </Box>
              <div>${text}</div>
      </Grid>
       <Grid size={{ xs: 6, md: 4 }}>
      </Grid>

    </Grid>
     

          
        </div>

    );
}

export default SiloTextEditor;