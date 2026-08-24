// import './styles.scss'
import './../styles/editor.css';
import Electron, { IpcRendererEvent } from 'electron';

import { Editor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import React, {FC, useCallback, useEffect, useState, useRef} from 'react'
import {
  Alert, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText,
  Toolbar, 
  Slide,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import { FormatListBulletedRounded, RedoOutlined, UndoOutlined, FormatListNumberedRounded, FormatBoldRounded, FormatItalicRounded, DatasetLinkedRounded, PhotoLibraryRounded } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import MainToolbar from './MainToolbar';
import MoodBoardGui from './MoodBoardGui';
import SiloToolBar from './SiloToolbar';
import { Grid2 as Grid } from "@mui/material";
import { TEXT_FILETYPES, IMAGE_FILETYPES, SILONOTE_FILETYPE, PDF_FILETYPE, TXT_FILETYPE } from '../utils/constants';
import { ImgListType, SiloNoteFile, SourceLinksType, NoteType } from 'types/GlobalTypes';
import { RetroBtn, iconStyles, RetroDialog, RetroDialogTitle, linkDrawerStyle, toastStyle } from './../styles/SiloTextBoxStyle';
import TextAlign from '@tiptap/extension-text-align';
import { ToggleActions } from './../types/GlobalTypes';
import NoteListGui from './NoteListGui';
import { editorContainerStyle,textEditorOuterLayerStyle, notesOuterLayerStyle} from './../styles/SiloTextEditorStyles';
import { corkboardParentDialogStyle, corkboardParentDialogContentStyle } from './../styles/MoodBoardStyle';
import { Buffer } from 'buffer';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NEW_FILE = "NEW_FILE";
const OPEN_FILE = "OPEN_FILE";



const editorProps = {
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'left'
    }),
  ],
  parseOptions:{
    preserveWhitespace: true,
  },
  editorProps: {
    attributes: {
      spellcheck: 'true',
    },
  }
};

const SiloTextEditor =() => {
  const editorRef = useRef<Editor | null>(null); // Use useRef to persist editor instance
  const [edited, setEdited] = useState(false);
  const currentFileRef = useRef<string | null>(null);
  const editedRef = useRef<boolean>(false);
  const [linkSection, setLinkSection] = useState(false);
  const [mbSection, setMBSection] = useState(false);
  const [notesSection, setNotesSection] = useState(true); // Initially open
  const [imgList, setImgList] = useState<ImgListType[]>([]);
  const [srcLinks, setSrcLinks] = useState<SourceLinksType[]>([]);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveAlert, setSaveAlert] = useState<{msg:string, location:string} | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [content, setContent] = useState<string | undefined>(undefined);

  //Action handler for top toolbar
  useEffect(() => {
    console.log()
      const undoListener = () => {
        editorRef.current?.chain().focus().undo().run();
        console.log('Received from Electron: UNDO');
      };
  
      const redoListener = () => {
        editorRef.current?.chain().focus().undo().run();
        console.log('Received from Electron: REDO');
      };
      const newFileListener = () => {
        newFile(false);
      };
  
      const openListener = () => {
        openFile(false);
      };
      const saveFileListener = () => {
        saveFile(false);
      };
const exportListener = (_event: IpcRendererEvent, type: string ) => {
  console.log("Type to convert to is:", type);
  exportFile(type);
};

      const saveAsFileListener = () => {
        saveFile(true);
      };
  
   // Listen for the response from the main process
      window.electron.ipcRenderer.on('undo', undoListener);
      window.electron.ipcRenderer.on('redo', redoListener);
      window.electron.ipcRenderer.on('new-file', newFileListener);
      window.electron.ipcRenderer.on('open-file', openListener);
    window.electron.ipcRenderer.on('export-file', exportListener);    
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
    }, [edited, notes,srcLinks, imgList]); //reload component when a 'saveable' value changes.

    useEffect(()=>{
      console.log("is content edited?", edited);
      console.log("is content edited editedRef?", editedRef);
      console.log("is content edited current?", editedRef.current);
      //let electron know to save to already file is saves
      window.electron.setEditStatus(edited);
    },[edited]);
  
  

  /*initialize editor reference. 
  We use a reference since i want to be able to create and detroy an editor 
  when a new file is created. Help restart undo and redo history too.
 */
  useEffect(() => {
    // Initialize the editor after the component mounts
    editorRef.current = new Editor(editorProps);
    // Cleanup the editor when the component unmounts
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  /*This starts a new editor by destroying old one and reapplying props. */
  const startNewEditor = () => {
  if (editorRef.current) {
    editorRef.current.destroy();
    editorRef.current = new Editor(editorProps);
  }
  }
  useEffect(()=>{
      // Set the timer to change the variable after 3 seconds
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000); // 3000ms = 3 seconds
  
      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);

  },[toast]);


  const handleUpdate = useCallback(() => {
    const currentContent = editorRef.current?.getText();
    console.log("Handling editor content update...");
    // Check if the content has changed
    if (currentContent !== content && !(stringIsEmptyOrUndefined(currentContent) && stringIsEmptyOrUndefined(content) )) {
      setEdited(true);  
      editedRef.current = true;       
      setContent(currentContent); // Update previous content
    } else {
      setContent(''); // Update previous content

      //setEdited(false);
    }
  },[editorRef.current]);

  useEffect(() => {
    // Set initial previous content
    setContent(editorRef.current?.getText());
    // Listen for updates to the editor
    editorRef.current?.on('update', handleUpdate);
    return () => {
      editorRef.current?.off('update', handleUpdate);
    };
  }, [editorRef.current]);

 
  const toggle = (obj :string) =>{
    switch (obj){
      case ToggleActions.LINK:
        setLinkSection(!linkSection);
        break;
      case ToggleActions.MB:
        setMBSection(!mbSection);
        break;
      case ToggleActions.NOTES:
        setNotesSection(!notesSection);
        break;
    }
  }


  const stringIsEmptyOrUndefined  = (str:string | undefined): boolean => {
    return str === undefined || str === '';
  }

  const addImage = async (event:React.MouseEvent<any>) =>{
    console.log("Add image clicked...");
    let pathObj : FileReturnValue = await window.electron.openFileDialog(IMAGE_FILETYPES);
    
    let imgPath: string= '';
    let result = {
      status: false,
      msg: "Error loading image"
    };
    if(!pathObj.canceled){
        imgPath = pathObj.filePaths[0];
        console.log("Adding image...", pathObj);
        console.log("from path...", pathObj.filePaths[0]);
        //create the image URL using blob
        const imageUrl = `data:image/png;base64,${pathObj.blob}`;
        const  newImage ={
          id: imgPath,
          data: imageUrl,
          name: imgPath,
          note: null
        }
       
        //TODO: check if item was added to the list or not
        const ImgsWithSamePath = imgList.filter((item)=> item.name === imgPath);
        if(ImgsWithSamePath.length > 0){
          result.status = false;
          result.msg = "This image already exists!";
        }else{
          //TODO:if not, add
          result.status = true;
          result.msg = "Added Image to Mood Board list!!!";
          setImgList([newImage, ...imgList]);
        }
        setEdited(true);
        editedRef.current = true;
      
    }else{
      result.status = true;
      result.msg = "User canceled adding image";
      console.log("Canceled adding image");
    }
    return result;
  }

  //Remove the image from the list of images. This does not delete the image from the file system, just removes it from the list of images in the mood board.
  const removeImage = async (event:React.MouseEvent<any>, imageName: string) =>{
    console.log("Add image clicked...");
    let result = {
      status: false,
      msg: "Error removing image"
    };
    try{
      const newImageList = imgList.filter((item)=> item.name !== imageName);
      setImgList([...newImageList]);
      setEdited(true);
      editedRef.current = true;
      setToast("Image Successfully Removed");
      result.status = true;
      result. msg =  "Image Successfully Removed";
    }catch(e){
      result.status = false;
      result. msg =  `Error removing image: ${e}`;
    }finally{
      return result;
    }
  }

  const generateSiloNoteTxt = (file: SiloNoteFile): string => {
const { content, links, imageRefs, notes } = file;

  let txt = `===========================\nSilo Note Export\n===========================\n\n`;

  // Content
  txt += `Content:\n--------\n${content}\n\n`;

  // Links
  txt += `Links:\n-------\n`;
  links.forEach(link => {
    txt += `• ${link.name}\n`;
    txt += `  URL: ${link.url}\n`;
    if (link.notes) txt += `  Note: ${link.notes}\n`;
    txt += `\n`;
  });

  // Images
  txt += `Images:\n--------\n`;
  imageRefs.forEach(img => {
    txt += `• ${img.name}\n`;
    if (img.note) txt += `  Note: ${img.note}\n`;
    txt += `\n`;
  });

  // Notes
  txt += `Notes:\n-------\n`;
  notes.forEach(note => {
    txt += `- ${note.name}\n`;
    if (note.content) txt += `  ${note.content}\n`;
    txt += `\n`;
  });

  return txt;

  }

 const generateSiloNotePdf = async (
  file: SiloNoteFile
): Promise<Uint8Array> => {
  const { content, links, imageRefs, notes } = file;

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();

  let y = height - 50;
  const lineHeight = 18;

  const drawText = (text: string, size = 12, indent = 0) => {
    if (y < 50) {
      page = pdfDoc.addPage([600, 800]);
      y = height - 50;
    }
    page.drawText(text, {
      x: 50 + indent,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  };

  // Content
  drawText('Content:', 14);
  drawText(content);

  // Links
  drawText('');
  drawText('Links:', 14);
links.forEach(link => {
  drawText(`• ${link.name}`, 12, 10);
  drawText(`  URL: ${link.url}`, 10, 20);
  if (link.notes) {
    drawText(`  Note: ${link.notes}`, 10, 20);
  }
  drawText(''); // spacing
});


  // Notes
  drawText('');
  drawText('Notes:', 14);
 notes.forEach(note => {
  drawText(`- ${note.name}`, 12, 10);
  if (note.content) {
    drawText(`  ${note.content}`, 10, 20);
  }
  drawText(''); // spacing
});

  // Images
  drawText('');
  drawText('Images:', 14);
  for (const img of imageRefs) {
    if (!img.data && img.name) {
    try {
      img.data = await window.electron.readImageFile(img.name);
    } catch (err) {
      console.warn(`Failed to read image file: ${img.name}`, err);
    }
  }

  if (!img.data) {
    drawText(`(Missing image data for ${img.name})`, 10, 10);
    continue;
  }

  try {
    console.log("Image data type:", typeof img.data);
console.log("IT IS:",img.data);
    const imageBytes = Uint8Array.from(atob(img.data.split(',')[1]), c => c.charCodeAt(0));
    const embeddedImage = img.data.startsWith('data:image/jpeg')
      ? await pdfDoc.embedJpg(imageBytes)
      : await pdfDoc.embedPng(imageBytes);

    const imgDims = embeddedImage.scale(0.5);
    if (y - imgDims.height < 50) {
      page = pdfDoc.addPage([600, 800]);
      y = height - 50;
    }

    page.drawImage(embeddedImage, {
      x: 50,
      y: y - imgDims.height,
      width: imgDims.width,
      height: imgDims.height,
    });

    y -= imgDims.height + lineHeight;

    if (img.note) {
      drawText(`Note: ${img.note}`, 10, 10);
    }
  } catch (err) {
    console.log("FAILED TO EMBED IMAGE: ", err);
    drawText(`(Failed to embed image: ${img.name})`, 10, 10);
  }
}


  return await pdfDoc.save();
}



  const exportFile = async (type:string) =>{
    setIsLoading(true);
    let path =currentFileRef.current;
      let fileName = 'newFile.sn';
      if(type ===PDF_FILETYPE){
        fileName = "newFile.pdf";
      }else if(type === TXT_FILETYPE){
        fileName = "newFile.txt";
      }
      

      path = await window.electron.saveFileDialog(fileName);
     console.log("Path to write in: ", path);
 
     //save as file with correct type
     if(path && !path.endsWith(type)){
       path = path + type;
     }

    

    let content = (editorRef.current!=null ? editorRef.current.getHTML():"");
    if(path !=null && path.length >0){
      //clear data to new image list
      let saveImgList:ImgListType[]=[];
      imgList.forEach((img) =>{
        saveImgList.push({id: img.id,name: img.name, note: img.note, data:null})
      });
      console.log("saving notes: ", notes);
      console.log("saving srcLinks: ", srcLinks);
      console.log("saving content: ", content);
      console.log("saving saveImgList: ", saveImgList);
      const newFile : SiloNoteFile = {
        content: content,
        links: srcLinks,
        imageRefs: saveImgList,
        notes: notes
      }
      if (type === PDF_FILETYPE) {
    console.log("Handing pdf type");
    const pdfBytes = await generateSiloNotePdf(newFile); // This is a Uint8Array

    // Convert to Node-friendly Buffer
    const buffer = Buffer.from(pdfBytes);
console.log("buffer is", buffer);
        const isWritten = await window.electron.writeFile(path, buffer);
        console.log("Write success:", isWritten);
        if(isWritten){
          setToast('Your file has been saved!');
        }else{
          setToast("Error Saving to file.\nPlease check if file is not open or corrupted.")
        }
   
  } else if (type === TXT_FILETYPE) {
    // TXT is already string, just write it
    const txtContent = generateSiloNoteTxt(newFile);

    const textWritten = await window.electron.writeFile(path, txtContent);
    console.log("Write success:", textWritten);
      if(textWritten){
          setToast('Your file has been saved!');
        }else{
          setToast("Error Saving to file.\nPlease check if file is not open or corrupted.");
        }
  }
    }else{
      //Message that path is empty

    }

    setIsLoading(false);
  }

  const saveFile = async (isSaveAs:boolean) =>{
    setIsLoading(true);
    let path =currentFileRef.current;
    if(path == null || isSaveAs){
      const fileName = "newFile.sn";

      path = await window.electron.saveFileDialog(fileName);
     console.log("Path to write in: ", path);
 
     //save as sd file
     if(path && !path.endsWith(SILONOTE_FILETYPE)){
       path = path + SILONOTE_FILETYPE;
     }
    }
    
    //get the content of the editor
    let content = (editorRef.current!=null ? editorRef.current.getHTML():"");
    console.log("Content to save: ", content);
    console.log("rich content HTML: ", editorRef.current?.getHTML());
        console.log("rich content JSON: ", editorRef.current?.getJSON());

    //get the links and image references
    if(path !=null && path.length >0){
      //clear data to new image list
      let saveImgList:ImgListType[]=[];
      imgList.forEach((img) =>{
        saveImgList.push({id: img.id,name: img.name, note: img.note, data:null})
      });
      console.log("saving notes: ", notes);
      console.log("saving srcLinks: ", srcLinks);
      console.log("saving content: ", content);
      console.log("saving saveImgList: ", saveImgList);
      const newFile : SiloNoteFile = {
        content: content,
        links: srcLinks,
        imageRefs: saveImgList,
        notes: notes
      }
      const serializedData = JSON.stringify(newFile);
      const data = await window.electron.writeFile(path, serializedData);
      console.log(data);
      //Message that save was successful
      console.log("Saving was successful!!");
      setToast('Your file has been saved!');
       //Since the file has been saved we are no longer in an 'edited' state
       setEdited(false);
       editedRef.current = false;
       currentFileRef.current = path;
    }else{
      //Message that path is empty
      setToast('Failed to find file path to save to. Please try again.');
    }

    setIsLoading(false);
    
  }

  //Update the links in the state when they are edited 
  // in the SiloToolBar component. 
  // This function is passed down to the SiloToolBar 
  // component as a prop and is called when the links are edited. 
  // It updates the srcLinks state and sets the edited state to true, 
  // indicating that the content has been modified.
  const updateLinks = (links:SourceLinksType[]) => { 
    console.log("LINKS HAVE BEEN EDITED!!!", links);
    setSrcLinks(links); 
    setEdited(true);
    editedRef.current = true;
  
  }

  const updateNotes = (notes:NoteType[]) => { 
    console.log("NOTES HAVE BEEN EDITED!!!", notes);
    setNotes(notes); 
    setEdited(true);
    editedRef.current = true;
  
  }

  const newFile = async ( override: boolean) =>{
    //have screen loader
    console.log("----------NEW FILE ASK-----------");

    console.log("edited is: ",edited );
    console.log("editedRef.current is: ",editedRef.current );

    console.log("override is ", override);

    //if editor has text, check with user if they want to save it or discard
    if(editedRef.current && !override){
      setSaveAlert({msg:"Your current file has not been saved, would you like to continue?",location: NEW_FILE});
      console.log("ALERT!!!");
    }else{

      //clear out current file settings
      currentFileRef.current = null;
      //clear UI content 
      startNewEditor();
      setSrcLinks([]);
      setImgList([]);
      setNotes([]);
        //Since a new file is loaded we are no longer in an 'edited' state
        console.log("setting content edited to false")
        setEdited(false);
        editedRef.current = false;
      }
    }

  const openFile = async (override: boolean) =>{
    //have screen loader
    console.log("edited is: ",edited );
    console.log("override is ", override);

    //if editor has text, check with user if they want to save it or discard
    if(editedRef.current && !override){
      setSaveAlert({msg:"Your current file has not been saved, would you like to continue?", location: OPEN_FILE});
      console.log("ALERT!!!");
    }else{
      setIsLoading(true);
      try{
      let pathObj : Electron.OpenDialogReturnValue = await window.electron.openFileDialog(TEXT_FILETYPES);
      console.log("File opened...", pathObj?.filePaths[0]);
      console.log("pathObj.canceled...", pathObj?.canceled);
  
      if(pathObj.canceled === false && pathObj.filePaths.length === 1 && editorRef.current){
        const data = await window.electron.readFile(pathObj.filePaths[0]);
        //clear the whole document
        editorRef.current.commands.clearContent();
        //if it is a silo note file, parse
        if(pathObj.filePaths[0].endsWith(SILONOTE_FILETYPE) && data){
          const fileData:SiloNoteFile = JSON.parse(data);
          setSrcLinks(fileData.links);
          setImgList(fileData.imageRefs);
          if(fileData.notes)
          setNotes(fileData.notes);

          //convert text to html format before adding to editor
          const htmlContent = fileData.content.replace(/\n/g, '<br>');
          editorRef.current.commands.setContent(htmlContent);
        }else{
          const htmlContent = data?.replace(/\n/g, '<br>');
          if(htmlContent)
          editorRef.current.commands.setContent(htmlContent);
          //console.log("DATA READ FROM FILE:",data);
        }
        //set current file path
        currentFileRef.current = pathObj.filePaths[0];
        //Since a new file is loaded we are no longer in an 'edited' state
        setEdited(false);
        editedRef.current = false;
      }

    }catch(e){
      console.log("ERROR", e);
      //log error with opening file
      setToast("Error opening file...")
    }finally{
      setIsLoading(false);
    }
    }
  }

  const handleAlertClose = () =>{
    setSaveAlert(null);
  }
  const handleAlertAction = (event: React.MouseEvent<HTMLButtonElement> , location: string, continueOperation: boolean) =>{
    if(continueOperation){
      if(location === OPEN_FILE){
        openFile(true);

      }else if (location === NEW_FILE ){
        newFile(true)

      }
    }
    setSaveAlert(null);
  }


  return (
    <div className='silo-editor-layout'>
    <div style={editorContainerStyle}>
      {/* <MenuBar editor={editor} />
      <br/> */}
      {/*TOAST/ERROR POPUP*/}

       <Slide in={toast !=null} mountOnEnter unmountOnExit>
                <Alert sx={toastStyle} 
                variant="outlined" 
                severity='success'
                color='success'
                >
                {toast}
              </Alert>
            </Slide>
        {/*MOOD BOARD DIALOG POPUP*/}
        <Dialog onClose={() =>toggle(ToggleActions.MB)} open={mbSection} 
        id='popupMoodBoardDialog'
        /* overriding the Dialogs paper component max width*/
        PaperProps={{
          style:{...corkboardParentDialogStyle}
        }}

        >
          {/*Style seems to work better in this case. Mui sx is causing styleing issues with the different native*/}
        <DialogContent style={corkboardParentDialogContentStyle} >
        <MoodBoardGui imgList={imgList} addImage={addImage} setImageList={setImgList} removeImage={removeImage} onClose={() =>toggle(ToggleActions.MB)}/>

          </DialogContent>
        </Dialog>
      {/*TIPTAP EDITOR LOADER VERIFICATION AND MAINTOOLBAR*/}

        {editorRef.current != null && <MainToolbar
          editor={editorRef.current}
          newFileEvent={newFile}
          saveFileEvent={saveFile}
          exportFileEvent={exportFile}
          openFileEvent={openFile}
          toggleEvent={toggle}
        />}

      {saveAlert &&<RetroDialog
        open={saveAlert !== null}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleAlertClose}
        aria-describedby="alert-dialog-slide-description"
      >
      <RetroDialogTitle>{"Hey!"}</RetroDialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {saveAlert.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <RetroBtn onClick={(event) => handleAlertAction(event,saveAlert.location, true)}>Continue</RetroBtn>
          <RetroBtn onClick={(event) =>handleAlertAction(event,saveAlert.location,false)}>Abort</RetroBtn>
        </DialogActions>
      </RetroDialog>}

     
    
      {/*MAIN TEXT AREA AND SIDE DRAWERS + BUTTONS*/}

      <Grid className='silo-content-grid' container columnSpacing={0} >
       {isLoading && <CircularProgress style={{
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    zIndex: 900 
  }}    />}
      <Grid className='silo-main-grid' size={12} sx={{ display: 'flex' , margin: '1%'}}>
        <div className='silo-editor-shell'>
              <SiloToolBar editor={editorRef.current} toggle={toggle} linkSection={linkSection} 
              srcLinks={srcLinks} setToast={setToast} updateLinks={updateLinks}/>
          <Grid className='silo-workspace-row'
            size={12}
            sx={{
              display: 'flex', 
              alignItems: 'flex-start',  // Align to the top instead of flex-end
              gap: '8px', 
              flexDirection: 'row', 
              maxWidth: '100%',
              flex: 1,
              minHeight: 0,
            }}
          >
              {/* Conditionally render the NoteListGui */}
              <div style={{
                flex: notesSection ? '0 1 33%' : '0 1 0',  // Take 1/3 space when open, none when closed
                transition: 'flex 0.3s ease',  // Smooth transition
                ...notesOuterLayerStyle
              }}>
                {notesSection ? (
                  <NoteListGui 
                    notes={notes} 
                    setToast={(newToast: string) => setToast(newToast)} 
                    setNotes={updateNotes} 
                    toggle={toggle}
                  />
                ) : null}
              </div>

            {/* EditorContent takes up the remaining space */}
            <div className='scroll-container' style={{
              flex: notesSection ? '1 0 66%' : '1 0 100%',  // 2/3 when open, 100% when closed
              transition: 'flex 0.3s ease',  //  Smooth transition
              ...textEditorOuterLayerStyle
            }}>
              <EditorContent className='typing-area'
                editor={editorRef.current}  
                onChange={() => {
                  console.log("EditorContent edited is:", true);
                  setEdited(true);
                  editedRef.current = true;
                }}
              />
            </div>
          </Grid>

        </div>
      </Grid>
    </Grid>
     
    </div>
    </div>
  )
}

export default SiloTextEditor;