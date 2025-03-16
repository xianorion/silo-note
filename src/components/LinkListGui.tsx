import React, {FC, useState,useEffect} from 'react';
import { 
  Alert,
  Button, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Slide,
  Paper, 
  TextField,
  Typography
 } from '@mui/material';
import {
  Edit,
  InsertLink,
  RemoveCircleOutline
} from '@mui/icons-material';
import ErrorPopup from './ErrorPopup';
import { linkBankContainerStyle, linkBankStyle, linkBankTitleTypographyStyle, linkItemTypographyStyle, linkIconStyle} from './../styles/LinkListStyles';

const testLinkData:{name: string, url: string, notes:string}[]  = [
{
name: "MackAttacksArt",
notes: "art website",
url: "www.mackattacksart.com"
},
{
name: "MaterialUI React List",
notes: "React Library",
url: "https://mui.com/material-ui/react-list/"
}
];

type LinkType = {name: string, url: string, notes:string};

interface LinkListGuiProps {
    styles?: React.CSSProperties;
    links: LinkType[] | [];
    setToast: (newToast: string) => void;
    setLinks: (links: LinkType[]) => void;
}

const emptyLink = {name: '', url: '', notes:''}

const LinkListGui : FC<LinkListGuiProps> = ({links, setToast, setLinks}) =>{
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
    const [editingLinkData, setEditingLinkData] = useState<LinkType>(emptyLink);

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
    
    const validateLink = (link: LinkType) : boolean =>{
      return !link.url.startsWith("http://") && !link.url.startsWith("https://")
    }

    const addLink = (event:React.FormEvent<HTMLFormElement>) =>{
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        console.log("form data", formJson);

        const newLink = {
            url: formJson.url,
            name: formJson.name,
            notes: formJson.notes,
        }
      
        
        //check if name is unqiue
        let isNameUnqiue :boolean = links.every( link =>link.name !== newLink.name);
        //prompt user that link name must be unique
        if(!isNameUnqiue){
            setErrors({...errors,name: "Link name must be unique!", });
            setErrorSubtexts({...errors, name: "The name ["+newLink.name+"] is already in use."});

        }else if(validateLink(newLink)){
          console.log("ERROR WITH LINK", {...errors,url: "Link must start with 'http://' or 'https://'", });
          setErrors({...errors,url: "Link must start with 'http://' or 'https://'", });
        }else{
            console.log("Added link!");
            setLinks([...links, newLink]);
            handleClose();
            setToast("Link was Added!")
            removeError();
        }
    }

    const openEditLink = (link: {name: string, url: string, notes:string})=>{
      setEditingLinkData(link);
      setIsEditing(true);
    }

    const closeEditLinkPopup = () =>{
      setEditingLinkData(emptyLink);
      setIsEditing(false);
    }

    const saveLink = (event:React.FormEvent<HTMLFormElement>) =>{
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      const editedLink = {
          url: formJson.url,
          name: formJson.name,
          notes: formJson.notes,
      }

      const otherLinks = links.filter((link)=> link.name != editedLink.name);
      if(validateLink(editedLink)){
        setErrors({...errors,url: "Link must start with 'http://' or 'https://'", });
      }else{
          console.log("Added link!");
          setLinks([...otherLinks, editedLink]);
          setIsEditing(false);
          setEditingLinkData(emptyLink);
          setToast("Link was Saved!")

      }
  }

  // This function updates the specific field (name, url, or notes)
  const handleEditLinkChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const { value } = event.target;
  
    setEditingLinkData((prevData) => {
      // Ensure we return an object with the full data, filling in the missing fields
      return {
          ...prevData,
          [field]: value, // Update the specified field
      };
  });
};

    const removeLink = (linkName:string) =>{
        const newSrcLinks = links.filter((link)=> link.name != linkName);
        setLinks(newSrcLinks);

    }

    const openLink = async (link:string) =>{
      let opened : boolean = await window.electron.openLink(link);
      if(opened){
        console.log('opened...');
      }else{
        console.log('issue opening link...');
      }
    }


    return <div style={linkBankContainerStyle}> 
        <Typography
        sx={linkBankTitleTypographyStyle}
        >Link Bank</Typography>
        {/* {error != null && <ErrorPopup 
        open={error != null}
         error={error} 
         errorSubtext={errorSubtext}
         handleClose={removeError}
         
         />} */}
         <div style={linkBankStyle}>
         <List>
            {links.map((link) =>(
                <ListItem key={link.name}>
                    <ListItemButton component="a" onClick={() => openLink(link.url)} >
                        <ListItemText primaryTypographyProps={linkItemTypographyStyle}
                        >{link.name}</ListItemText>
                    </ListItemButton>
                    <RemoveCircleOutline sx={linkIconStyle} onClick={() => removeLink(link.name)} />
                    <Edit sx={linkIconStyle} onClick={() => openEditLink(link)}/>
                </ListItem>
            ))}
            </List>
         </div>
            <div>
            <Button  onClick={handleClickOpen}>
        <InsertLink sx={linkIconStyle}/>
        </Button>
         <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            addLink(event);
           
          },
        }}
      >
        <DialogTitle>Add Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Got a good reference link to your project? Add it here!`}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            //type="link"
            helperText={errors.name}
            error={errors.name != null}
            fullWidth
            variant="standard"
            // value={linkName}

            // onChange={e=> setLinkName(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="url"
            name="url"
            label="Link"
            //type="link"
            fullWidth
            variant="standard"
            helperText={errors.url}
            error={errors.url != null}
            // value={linkUrl}
            // onChange={e=> setLinkUrl(e.target.value)}
          />
           <TextField
            autoFocus
            margin="dense"
            id="notes"
            name="notes"
            label="Notes"
            //type="link"
            fullWidth
            variant="standard"
            // value={linkNotes}

            // onChange={e => setLinkNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Apply link</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            saveLink(event);
           
          },
        }}
      >
        <DialogTitle>Edit Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Got a good reference link to your project? Add it here!`}
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
            helperText={errors.name}
            error={errors.name != null}
            value={editingLinkData?.name}
            disabled
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="url"
            name="url"
            label="Link"
            fullWidth
            variant="standard"
            helperText={errors.url}
            error={errors.url != null}
            value={editingLinkData?.url}
            onChange={(e) => handleEditLinkChange(e,'url')}

          />
           <TextField
            autoFocus
            margin="dense"
            id="notes"
            name="notes"
            label="Notes"
            fullWidth
            variant="standard"
            value={editingLinkData?.notes}
            onChange={(e) => handleEditLinkChange(e,'notes')}

          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditLinkPopup}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </DialogActions>
      </Dialog>
            </div>
    </div>
  
}

export default LinkListGui;