// import './styles.scss'
import './../styles/editor.css';
import Electron from 'electron';
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {FC, useEffect, useState} from 'react'
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
import LinkListGui from './LinkListGui';
import MoodBoardGui from './MoodBoardGui';
import { Drawer } from '@mui/material';
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

const MenuBar : FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </button>
        <button onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </button>
      </div>
    </div>
  )
}

const MenuToolbar : FC<MenuToolbarProps>= ({className, editor}) =>{
  if (!editor) {
    return null
  }
  return (
    <div className={className}>
      <div ><h1><img id='logo' src='/silonote_logo.png' alt='SiloNotelogo'/></h1></div>
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
        <RetroBtn onClick={() => editor.chain().focus().undo().run()}>
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
        <br/>
        
      </div>

      <div>
      
      </div>
      
      </Toolbar>
    </div>
  );
}

const SiloTextEditor =() => {
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
    window.electron.setSaveStatus(edited);
    editor?.commands.setTextAlign('left');  // Align text to the left

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


  const editor: Editor |null = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
    onUpdate({editor}){
    }
  })


  editor?.on('update', ({ editor }) => {
    // The content has changed.
  })

  useEffect(() => {
    // Set initial previous content
    setContent(editor?.getText());
    editor?.commands.setTextAlign('left');
    const handleUpdate = () => {
      const currentContent = editor?.getText();

      // Check if the content has changed
      if (currentContent !== content) {
        console.log("Text has changed!");
        setEdited(true);
        setContent(currentContent); // Update previous content
      } else {
        setContent(''); // Update previous content

        //setEdited(false);
      }
    };

    // Listen for updates to the editor
    editor?.on('update', handleUpdate);

    return () => {
      editor?.off('update', handleUpdate);
    };
  }, [editor, content]);

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
    

    let content = (editor!=null ? editor.getText():"");
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
      editor?.commands.clearContent();
      editor?.commands.setTextAlign('left');  // Align text to the left
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
  
      if(pathObj.canceled === false && pathObj.filePaths.length === 1 && editor){
        const data = await window.electron.readFile(pathObj.filePaths[0]);

        //clear the whole document
        editor.commands.clearContent();
        //if it is a silo note file, parse
        if(pathObj.filePaths[0].endsWith(SILONOTE_FILETYPE) && data){
          const fileData:SiloNoteFile = JSON.parse(data);

          setSrcLinks(fileData.links);
          setImgList(fileData.imageRefs);
          editor.commands.insertContent(fileData.content);
      

        }else{
          editor.commands.insertContent(data);
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

      {editor !=null?<MainToolbar
            editor={editor}
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
      <Grid size={7}>
        <div>
        <MenuToolbar  className='MenuToolbar' editor={editor} />
      <br/>
      <EditorContent editor={editor}  onChange={()=>{
        console.log("edited is:", true );
        setEdited(true)}}/>     
        </div>
      
      </Grid>
       <Grid 
       size={3}
    component="div" 
    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}
  >
       <RetroBtn  onClick={() => toggle(ToggleActions.LINK)}>
        <DatasetLinkedRounded sx={iconStyles}/>
      </RetroBtn>
      <Drawer 
      PaperProps={{
        sx: linkDrawerStyle,
      }}
      anchor='right' 
      open={linkSection} 
      onClose={() => toggle(ToggleActions.LINK)}>
        <LinkListGui  links={srcLinks} setToast={(newToast:string) =>setToast(newToast)} setLinks={updateLinks} />
      </Drawer>
      <RetroBtn onClick={() =>toggle(ToggleActions.MB)}>
        <PhotoLibraryRounded sx={iconStyles}/>
      </RetroBtn>
      {/* <Drawer anchor='right' open={mbSection} onClose={() =>toggle('mb')}>
        <MoodBoardGui imgList={imgList} addImage={addImage} setImageList={setImgList} removeImage={removeImage} onClose={() =>toggle('mb')}/>
      </Drawer> */}
      </Grid>

    </Grid>
    <br/>
     
    </div>
  )
}

export default SiloTextEditor;