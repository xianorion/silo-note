// import './styles.scss'
import './../styles/editor.css';
import Electron from 'electron';

import { Editor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
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
import { TEXT_FILETYPES, IMAGE_FILETYPES, SILONOTE_FILETYPE } from '../utils/constants';
import { ImgListType, SiloNoteFile, SourceLinksType } from 'types/GlobalTypes';
import { RetroBtn, iconStyles, RetroDialog, RetroDialogTitle, linkDrawerStyle } from './../styles/SiloTextBoxStyle';
import TextAlign from '@tiptap/extension-text-align';
import { ToggleActions } from './../types/GlobalTypes';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface MenuBarProps {

editor:Editor | null;
}


interface MenuToolbarProps {

  className: string;
  editor: Editor | null;
}

const NEW_FILE = "NEW_FILE";
const OPEN_FILE = "OPEN_FILE";

const MenuToolbar : FC<MenuToolbarProps>= ({className, editor}) =>{
  if (!editor) {
    return null
  }
  return (
    <div className={className}>
      <div ><h1><img id='logo' src={`${process.env.PUBLIC_URL}/img/silonote_logo.png`}  alt='SiloNotelogo'/></h1></div>
       <Toolbar 
      sx={{ display: 'flex', }}
      >
       
      <div>
        <RetroBtn  onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}>
        <FormatBoldRounded className='icon'/>
        </RetroBtn>
        <RetroBtn  onClick={() => editor.chain().focus().toggleItalic().run()}
          
          className={editor.isActive('italic') ? 'is-active' : ''}>
       <FormatItalicRounded className='icon'/>
        </RetroBtn>
         {/* undo button */}
        <RetroBtn onClick={() => { editor.chain().focus().undo().run();}}>
        <UndoOutlined className='icon' />
        </RetroBtn>
         {/* redo button */}
        <RetroBtn  onClick={() => editor.chain().focus().redo().run()}>
        <RedoOutlined className='icon'/>
        </RetroBtn>
        <RetroBtn onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <FormatListBulletedRounded className='icon'/>
        </RetroBtn>
        <RetroBtn onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <FormatListNumberedRounded className='icon'/>
        </RetroBtn>
        
      </div>

      <div>
      
      </div>
      
      </Toolbar>
    </div>
  );
}


const editorProps = {
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'left'
    }),
  ],
  editorProps: {
    attributes: {
      spellcheck: 'true',
    },
  }
};

const SiloTextEditor =() => {
  const editorRef = useRef<Editor | null>(null); // Use useRef to persist editor instance
  const [currentFile, setCurrentFile] = useState<string|  null>(null);
  const [edited, setEdited] = useState(false);
  const [linkSection, setLinkSection] = useState(false);
  const [mbSection, setMBSection] = useState(false);
  const [imgList, setImgList] = useState<ImgListType[]>([]);
  const [srcLinks, setSrcLinks] = useState<SourceLinksType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveAlert, setSaveAlert] = useState<{msg:string, location:string} | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [content, setContent] = useState<string | undefined>(undefined);

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

  useEffect(()=>{
    console.log("is content edited?", edited);
    //let electron know to save to already file is saves
    window.electron.setEditStatus(edited);
  },[edited]);

  const toggle = (obj :string) =>{
    switch (obj){
      case ToggleActions.LINK:
        setLinkSection(!linkSection);
        break;
      case ToggleActions.MB:
        setMBSection(!mbSection);
        break;
    }
   
  }
  

  // const editor: Editor |null = useEditor({
  //   extensions: [
  //     StarterKit,
  //     TextAlign.configure({
  //       types: ['heading', 'paragraph'],
  //     }),
  //   ],
  //   editorProps: {
  //     attributes: {
  //       spellcheck: 'true',
  //     },
  //   }
  // })

  const stringIsEmptyOrUndefined  = (str:string | undefined): boolean => {
    return str === undefined || str === '';
  }

  const handleUpdate = useCallback(() => {
    const currentContent = editorRef.current?.getText();

    // Check if the content has changed
    if (currentContent !== content && !(stringIsEmptyOrUndefined(currentContent) && stringIsEmptyOrUndefined(content) )) {
      setEdited(true);         

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
      
    }else{
      result.status = true;
      result.msg = "User canceled adding image";
      console.log("Canceled adding image");
    }
    return result;
  }

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

  const saveFile = async (event : React.MouseEvent<any>, isSaveAs:boolean) =>{
    setIsLoading(true);
    console.log("SaveFile --- data is: ", event);
    let path =currentFile;
    if(path == null || isSaveAs){
      const fileName = "newFile.sn";

      path = await window.electron.saveFileDialog(fileName);
     console.log("Path to write in: ", path);
 
     //save as sd file
     if(path && !path.endsWith(SILONOTE_FILETYPE)){
       path = path + SILONOTE_FILETYPE;
     }
    }
    

    let content = (editorRef.current!=null ? editorRef.current.getText():"");
    if(path !=null && path.length >0){
      const newFile : SiloNoteFile = {
        content: content,
        links: srcLinks,
        imageRefs: imgList,
      }
      const serializedData = JSON.stringify(newFile);
      const data = await window.electron.writeFile(path, serializedData);
      console.log(data);
      //Message that save was successful
      console.log("Saving was successful!!");
      setToast('Your file has been saved!');
       //Since the file has been saved we are no longer in an 'edited' state
       setEdited(false);
    }else{
      //Message that path is empty

    }

    setIsLoading(false);
    
  }
  const updateLinks = (links:SourceLinksType[]) => { 
    console.log("LINKS HAVE BEEN EDITED!!!");
    setSrcLinks(links); 
    setEdited(true);
  
  }

  const newFile = async (event : React.MouseEvent<any>, override: boolean) =>{
    console.log("triggering new file event: ", event);
    //have screen loader
    console.log("----------NEW FILE ASK-----------");

    console.log("edited is: ",edited );
    console.log("override is ", override);

    //if editor has text, check with user if they want to save it or discard
    if(edited && !override){
      setSaveAlert({msg:"Your current file has not been saved, would you like to continue?",location: NEW_FILE});
      console.log("ALERT!!!");
    }else{

      //clear out current file settings
      setCurrentFile(null);
      //clear UI content 
      startNewEditor();
      setSrcLinks([]);
      setImgList([]);
        //Since a new file is loaded we are no longer in an 'edited' state
        console.log("setting content edoted to false")
        setEdited(false);
      }
    }

  const openFile = async (event : React.MouseEvent<any>, override: boolean) =>{
    console.log("Opening File --- event is: ", event);
    //have screen loader
    console.log("edited is: ",edited );
    console.log("override is ", override);

    //if editor has text, check with user if they want to save it or discard
    if(edited && !override){
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
          editorRef.current.commands.insertContent(fileData.content);
      

        }else{
          editorRef.current.commands.insertContent(data);
          //console.log("DATA READ FROM FILE:",data);
        }
        //set current file path
        setCurrentFile(pathObj.filePaths[0]);
        //Since a new file is loaded we are no longer in an 'edited' state
        setEdited(false);
      }

    }catch(e){
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
        openFile(event, true);

      }else if (location === NEW_FILE ){
        newFile(event, true)

      }
    }
    setSaveAlert(null);
  }

  return (
    <div style={{margin:'auto'}}>
      {/* <MenuBar editor={editor} />
      <br/> */}
      {/*TOAST/ERROR POPUP*/}

       <Slide in={toast !=null} mountOnEnter unmountOnExit>
                <Alert style={{
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  zIndex: 1500,
                  backgroundColor: '#FFFFFF',
                  boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.7)',
                }} 
                variant="outlined" 
                severity='success'
                color='success'
                >
                {toast}
              </Alert>
            </Slide>
 {/*MOOD BOARD DIALOG POPUP*/}
 <Dialog  open={mbSection} 
 
 sx={{ 
  justifyContent: 'center', 
  alignItems: 'center', 
  width: 'auto', 
  height: 'auto', 
  padding: 0, // Remove padding to allow full space for content
  overflow: 'auto', // Prevents scrollbars on the dialog content
}}>
        <DialogContent sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 'auto', 
    height: 'auto', 
    background: "rgb(244, 208, 172)",  /* Darker border for depth */
    padding: 0, // Remove padding to allow full space for content
    overflow: 'auto', // Prevents scrollbars on the dialog content
  }}>
        <MoodBoardGui imgList={imgList} addImage={addImage} setImageList={setImgList} removeImage={removeImage} onClose={() =>toggle(ToggleActions.MB)}/>

          </DialogContent>
        </Dialog>
      {/*TIPTAP EDITOR LOADER VERIFICATION AND MAINTOOLBAR*/}

      {editorRef.current !=null?<MainToolbar
            editor={editorRef.current}
            newFileEvent={newFile}
      saveFileEvent={saveFile}
      openFileEvent={(event: React.MouseEvent<HTMLButtonElement>)=> openFile(event, false)}
      toggleEvent={toggle}
      />:null}
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

      <Grid container columnSpacing={2} >
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
      <Grid size={12}>
        <div>
          <SiloToolBar editor={editorRef.current} toggle={toggle} linkSection={linkSection} 
          srcLinks={srcLinks} setToast={setToast} updateLinks={updateLinks}/>
        
      <br/>
      <EditorContent editor={editorRef.current}  onChange={()=>{
        console.log("edited is:", true );
        setEdited(true)}}/>     
        </div>
      
      </Grid>
       <Grid 
       size={3}
    component="div" 
    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}
  >
      
      </Grid>

    </Grid>
    <br/>
     
    </div>
  )
}

export default SiloTextEditor;

