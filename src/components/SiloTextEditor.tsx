// import './styles.scss'
import './../styles/editor.css';
import Electron from 'electron';
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {FC, useEffect, useState} from 'react'
import {
  Alert, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText,
  DialogTitle,
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
      <div><h1>SiloNote</h1></div>
       <Toolbar 
      sx={{ display: 'flex', }}
      >
       
      <div>
        <Button  onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}>
        <FormatBoldRounded className='icon'/>
        </Button>
        <Button  onClick={() => editor.chain().focus().toggleItalic().run()}
          
          className={editor.isActive('italic') ? 'is-active' : ''}>
       <FormatItalicRounded className='icon'/>
        </Button>
         {/* undo button */}
        <Button onClick={() => editor.chain().focus().undo().run()}>
        <UndoOutlined className='icon' />
        </Button>
         {/* redo button */}
        <Button  onClick={() => editor.chain().focus().redo().run()}>
        <RedoOutlined className='icon'/>
        </Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <FormatListBulletedRounded className='icon'/>
        </Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <FormatListNumberedRounded className='icon'/>
        </Button>
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
  const [savePopupVisible, setSavePopupVisible] = useState<boolean>(false);

  useEffect(()=>{
    console.log("is content edited?", edited);
    window.electron.setSaveStatus(edited);

  },[edited]);


  useEffect(()=>{

      // Set the timer to change the variable after 3 seconds
      const timer = setTimeout(() => {
        setSavePopupVisible(false);
      }, 3000); // 3000ms = 3 seconds
  
      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);

  },[savePopupVisible]);

  const toggle = (obj :string) =>{
    switch (obj){
      case 'link':
        setLinkSection(!linkSection);
        break;
      case 'mb':
        setMBSection(!mbSection);
        break;
    }
   
  }


  const editor: Editor |null = useEditor({
    extensions: [
      StarterKit,
    ],
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
  })

  editor?.on('update', ({ editor }) => {
    // The content has changed.
    setEdited(true);
  })

  const addImage = async (event:React.MouseEvent<any>) =>{
    console.log("Add image clicked...");
    let pathObj : FileReturnValue = await window.electron.openFileDialog(IMAGE_FILETYPES);
    
    console.log("Image file opened...", pathObj.filePaths[0]);
    console.log("image file? pathObj.canceled...", pathObj.canceled);
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
      
    }
    return result;
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
      setSavePopupVisible(true);
       //Since the file has been saved we are no longer in an 'edited' state
       setEdited(false);
    }else{
      //Message that path is empty

    }

    setIsLoading(false);
    
  }

  const newFile = async (event : React.MouseEvent<any>, override: boolean) =>{
    console.log("triggering new file event: ", event);
    //have screen loader
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

      setSrcLinks([]);
      setImgList([]);
        //Since a new file is loaded we are no longer in an 'edited' state
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
      console.log("pathObj.canceled...", pathObj.canceled);
  
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
        setError("Error opening file...")
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
      <Slide in={savePopupVisible} mountOnEnter unmountOnExit>
          <Alert style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 900,
            backgroundColor: '#FFFFFF',
            boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.7)',
          }} 
          variant="outlined" 
          severity="success"
          color='success'
          >
          Your file has been saved!
        </Alert>
      </Slide>
     
      {editor !=null?<MainToolbar
            editor={editor}
            newFileEvent={newFile}
      saveFileEvent={saveFile}
      openFileEvent={(event: React.MouseEvent<HTMLButtonElement>)=> openFile(event, false)}
      />:null}
      {saveAlert &&<Dialog
        open={saveAlert !== null}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleAlertClose}
        aria-describedby="alert-dialog-slide-description"
      >
       
        (<DialogTitle>{"Hey!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {saveAlert.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(event) => handleAlertAction(event,saveAlert.location, true)}>Continue</Button>
          <Button onClick={(event) =>handleAlertAction(event,saveAlert.location,false)}>Abort</Button>
        </DialogActions>)
      </Dialog>}
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
      <EditorContent 
      id='editor'
      editor={editor} 
      className='editor'
      />
        </div>
      
      </Grid>
       <Grid 
       size={3}
    component="div" 
    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}
  >
       <Button onClick={() => toggle('link')}>
        <DatasetLinkedRounded/>
      </Button>
      <Drawer anchor='right' open={linkSection} onClose={() => toggle('link')}>
        <LinkListGui links={srcLinks} setLinks={(links) => { setSrcLinks(links); setEdited(true);}} />
      </Drawer>
      <Button onClick={() =>toggle('mb')}>
        <PhotoLibraryRounded/>
      </Button>
      <Drawer anchor='right' open={mbSection} onClose={() =>toggle('mb')}>
        <MoodBoardGui imgList={imgList} addImage={addImage} onClose={() =>toggle('mb')}/>
      </Drawer>
      </Grid>

    </Grid>
    <br/>
     
    </div>
  )
}

export default SiloTextEditor;