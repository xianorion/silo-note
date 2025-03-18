import React, {FC, useState,useEffect} from 'react';
import { 
  Button, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List, 
  ListItem, 
  TextField,
  Grid2 as Grid,
 } from '@mui/material';
 import { Close, PostAddRounded} from '@mui/icons-material';
import {
  RemoveCircleOutline
} from '@mui/icons-material';
import { noteStyle, noteContainerStyle,noteHeaderStyle, noteBankStyle, iconCircleStyle,noteBankTitleTypographyStyle, noteItemTypographyStyle, noteTextTitleStyle, noteTextContentStyle, noteTitleStyle, noteBankListStyle, addNoteBtnStyle} from '../styles/NotesGuiStyles';
import { NoteType, ToggleActions } from 'types/GlobalTypes';

interface NoteGuiProps {
    styles?: React.CSSProperties;
    notes: NoteType[] | [];
    setToast: (newToast: string) => void;
    setNotes: (notes: NoteType[]) => void;
    toggle: (obj: string) => void,

}

const emptyNote = {name: '', content:''}

const NoteListGui : FC<NoteGuiProps> = ({notes, setToast, setNotes, toggle}) =>{
    const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = useState<{name:string|null,url:string|null,notes:string|null}>({
      name: null,
      url:null,
      notes:null,
    });
    const [errorSubtexts, setErrorSubtexts] = useState<{name:string|null,url:string|null,notes:string|null}>({
      name: null,
      url:null,
      notes:null,
    });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingNoteData, setEditingNoteData] = useState<NoteType>(emptyNote);

    useEffect(()=>{
      console.log("Errors had changed: ", errors);
      console.log("errors.url != null", errors.url != null)
      console.log("errors.name != null", errors.name != null)

    }, [errors]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const removeError = () =>{
        setErrors({
          name: null,
          url:null,
          notes:null,
        });
    }
    
    const addNote = (event:React.FormEvent<HTMLFormElement>) =>{
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        console.log("form data", formJson);

        const newNote = {
            name: formJson.name,
            content: formJson.content,
        }
      
        
        //check if name is unqiue
        let isNameUnqiue :boolean = notes.every( note =>note.name !== newNote.name);
        //prompt user that note name must be unique
        if(!isNameUnqiue){
            setErrors({...errors,name: "Note name must be unique!", });
            setErrorSubtexts({...errors, name: "The name ["+newNote.name+"] is already in use."});

        }else{
            console.log("Added note!");
            setNotes([...notes, newNote]);
            handleClose();
            setToast("Note was Added!")
            removeError();
        }
    }

    const openEditNote = (note: {name: string, content:string})=>{
      setEditingNoteData(note);
      setIsEditing(true);
    }

    const closeEditNotePopup = () =>{
      setEditingNoteData(emptyNote);
      setIsEditing(false);
    }

    const saveNote = (event:React.FormEvent<HTMLFormElement>) =>{
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      console.log("saving...", formJson);
      //since the name is disabled in the tsx code, we have to use the store note name data 
      const editedNote = {
          name: editingNoteData.name,
          content: formJson.content,
      }

      const otherNotes = notes.filter((note)=> note.name != editedNote.name);
      console.log("saved note!",[...otherNotes, editedNote]);
      setNotes([...otherNotes, editedNote]);
      setIsEditing(false);
      setEditingNoteData(emptyNote);
      setToast("Note was saved!")

      
  }

  // This function updates the specific field (name, url, or notes)
  const handleEditNoteChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const { value } = event.target;
    setEditingNoteData((prevData) => {
      // Ensure we return an object with the full data, filling in the missing fields
      return {
          ...prevData,
          name: editingNoteData.name,
          [field]: value, // Update the specified field
      };
  });
};

    const removeNote = (noteName:string) =>{
        const newSrcNotes = notes.filter((note)=> note.name != noteName);
        setNotes(newSrcNotes);

    }

    const openNote = async (note:string) =>{
     
    }


    return <div style={noteContainerStyle}> 
        <div style={noteHeaderStyle}>
          <Grid size={10}>
          <DialogTitle sx={noteItemTypographyStyle}>Notes</DialogTitle>
          </Grid>
          <Grid size={2}>    
              <Close sx={{width: '3vw', height: '3vw', marginRight: '2vw'}} onClick={()=>{toggle(ToggleActions.NOTES)}}/>
          </Grid>
        </div>
         <div style={noteBankStyle} >
         <List style={noteBankListStyle}>
            {notes.map((note) =>(
              <div key={note.name}>
                 <ListItem 
                 style={noteStyle}
                key={note.name}>
                 <div style={noteTitleStyle}>
                    <div style={noteTextTitleStyle} onClick={() => openEditNote(note)}  >
                        {note.name.length > 20? note.name.substring(0,20)+"...": note.name}

                      </div>
                      <RemoveCircleOutline sx={iconCircleStyle} onClick={() => removeNote(note.name)} />
                 </div>
                  
                </ListItem>

              </div>
               
            ))}
            </List>
            
         </div>
         <div style={noteBankStyle}>
         <Button style={addNoteBtnStyle} onClick={handleClickOpen}>
          <PostAddRounded />
        </Button>
         </div>
       
          
          <div>
            
         <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            addNote(event);
           
          },
        }}
      >
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Add some useful notes to look back on for your project!`}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            helperText={errors.name}
            error={errors.name != null}
            fullWidth
            variant="standard"
          />
           <TextField
            autoFocus
            margin="dense"
            id="content"
            name="content"
            label="Note"
            fullWidth
            variant="standard"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add Note</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            saveNote(event);
           
          },
        }}
      >
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Edit your project note: `}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
            helperText={errors.name}
            error={errors.name != null}
            value={editingNoteData?.name}
            onChange={(e) => handleEditNoteChange(e,'name')}
            disabled
          />
           <TextField
            autoFocus
            margin="dense"
            id="content"
            name="content"
            label="Notes"
            fullWidth
            variant="standard"
            value={editingNoteData?.content}
            onChange={(e) => handleEditNoteChange(e,'content')}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditNotePopup}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </DialogActions>
      </Dialog>
            </div>
    </div>
  
}

export default NoteListGui;