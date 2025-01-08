import { Button, ImageList, ImageListItem, ImageListItemBar,Paper,Box,Typography, Grid2 as Grid } from '@mui/material';
import React, {FC, useState} from 'react';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
const MoodBoardGui: FC = () =>{

    const [imgList, setImgList] = useState<{url:string, name:string}[]>([]);



    return(
        <Paper
        sx={{
            margin:'2px'
        }}
        >
        <Box>
            <Grid container spacing={2}
            sx={{padding:'10px'}}>
                <Grid size={10}>
                    <Typography
                    sx={{
                    fontSize: '20px',                           // Change font size
                    fontWeight: 'bold',   
                    }}
                    >Mood Board</Typography>
                </Grid>
                <Grid size={2}  sx={{
                    }}>
                    <OpenInFullIcon/>
                </Grid>
           
            </Grid>
        
            <ImageList variant="masonry" cols={3} gap={8}>
                {imgList.map((item)=>(
                    <ImageListItem key={item.url}>
                            <img
                                srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.url}?w=248&fit=crop&auto=format`}
                                alt={item.name}
                                loading="lazy"
                            />
                    <ImageListItemBar position="below" title={item.name} />
                    
                    </ImageListItem>
                ))}
            

            </ImageList>
        </Box>
       

        <Button>Add</Button>
        <Button>Edit</Button>
        <Button>Remove</Button>
        </Paper>

    );

}

export default MoodBoardGui;