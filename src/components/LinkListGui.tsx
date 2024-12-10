import React, {FC, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Paper } from '@mui/material';

const testLinkData:{name: string, url: string}[]  = [
{
name: "MackAttacksArt",
url: "www.mackattacksart.com"
},
{
name: "MaterialUI React List",
url: "https://mui.com/material-ui/react-list/"
}
];


const LinkListGui : FC = () =>{
    const [srcLinks, setSrcLinks] = useState<{name: string, url: string}[]>(testLinkData);


    return <Paper>
        <List>
            {srcLinks.map((link) =>(
                <ListItem>
                    <ListItemButton component="a" href={link.url}>
                        <ListItemText>{link.name}</ListItemText>
                    </ListItemButton>
                </ListItem>
            ))}
            </List>
    </Paper>
  
}

export default LinkListGui;