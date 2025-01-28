import React, {FC, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Paper, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'; 
import InsertLinkIcon from '@mui/icons-material/InsertLinkRounded'
import Button from '@mui/material/Button';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ErrorPopup from './ErrorPopup';

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

interface LinkListGuiProps {
    styles?: React.CSSProperties;
    links: {name: string, url: string, notes:string}[] | [];
    setLinks: (links: {name: string, url: string, notes:string}[]) => void;
}

const ListItemTextStyle:{fontSize:number} =  {
    fontSize:15
}

const LinkListGui : FC<LinkListGuiProps> = ({links, setLinks}) =>{
    // const [linkUrl, setLinkUrl] = useState<string>("");
    // const [linkName, setLinkName] = useState<string>("");
    // const [linkNotes, setLinkNotes] = useState<string>("");
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState<string|null>(null);
    const [errorSubtext, setErrorSubtext] = useState<string|null>(null);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const removeError = () =>{
        setError(null);
    }

    const addLink = (event:React.FormEvent<HTMLFormElement>) =>{
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        console.log("form data", formJson);

        const newLink = {
            url: formJson.link,
            name: formJson.name,
            notes: formJson.notes,
        }
      
        
        //check if name is unqiue
        let isNameUnqiue :boolean = links.every( link =>link.name != newLink.name);
        //prompt user that link name must be unique
        if(!isNameUnqiue){
            setError("Link name must be unique!");
            setErrorSubtext("The name ["+newLink.name+"] is already in use.")

        }else if(!formJson.link.startsWith("http://") && !formJson.link.startsWith("https://")){
          setError("Link must start with 'http://' or 'https://'");
        }else{
            console.log("Added link!");
            setLinks([...links, newLink]);
            handleClose();
        }
    }

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


    return <Paper>
        <Typography
        sx={{
        fontSize: '20px',                           // Change font size
        fontWeight: 'bold',   
        }}
        >Link Bank</Typography>
        {error != null && <ErrorPopup 
        open={error != null}
         error={error} 
         errorSubtext={errorSubtext}
         handleClose={removeError}
         
         />}
        <List>
            {links.map((link) =>(
                <ListItem key={link.name}>
                    <ListItemButton component="a" onClick={() => openLink(link.url)} >
                        <ListItemText primaryTypographyProps={{...ListItemTextStyle}}
                        >{link.name}</ListItemText>
                    </ListItemButton>
                    <RemoveCircleOutlineIcon onClick={() => removeLink(link.name)} />
                </ListItem>
            ))}
            </List>
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
            addLink(event);
           
          },
        }}
      >
        <DialogTitle>Paste Link</DialogTitle>
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
            fullWidth
            variant="standard"
            // value={linkName}

            // onChange={e=> setLinkName(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="link"
            name="link"
            label="Link"
            //type="link"
            fullWidth
            variant="standard"
            helperText={error}
            error={error != null}
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
            </div>
    </Paper>
  
}

export default LinkListGui;