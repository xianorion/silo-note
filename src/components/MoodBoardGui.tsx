import { Button, ImageList, ImageListItem, ImageListItemBar,Paper,Box,Typography, Grid2 as Grid } from '@mui/material';
import React, {FC, useEffect} from 'react';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { ImgListType } from 'types/GlobalTypes';
import Zoom from '@mui/material/Zoom';
import Slide from '@mui/material/Slide';


interface MoodBoardGuiProps {
    imgList:ImgListType[] | [];
    addImage: (event:React.MouseEvent) => void;
    onClose: () => void
}
const MoodBoardGui: FC<MoodBoardGuiProps> = ({imgList, addImage, onClose}) =>{

    useEffect(()=>{
        console.log("New LIMAGE LIST: ", imgList);
    },[imgList]);

    const addImageToList = async (event:React.MouseEvent) =>{
        const res = await addImage(event);
       
        console.log("Returned to MoodBoardGui addimagefunction.")
        console.log("Recieved addImge result: ", res);
    }

    const removeImageFromList = async (event:React.MouseEvent) =>{
        console.log("removeImageFromList event triggered: ", event);     

    }

    const editImageMsg= async (event:React.MouseEvent) =>{
        console.log("Edit event triggered: ", event)       
    }


    return(
        <Paper
        sx={{
            margin:'2px',
            width: '80vw'
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
                     
                    <OpenInFullIcon onClick={onClose}/>
                </Grid>
           
            </Grid>
        
        <ImageList sx={{ overflowX: 'auto', height: '100%', padding:'5px', margin:'10px'}} >
          
          {imgList && imgList.map((item)=>(
                 item && <Slide in timeout={1000} key={item.name}><ImageListItem key={item.name}>
                      <img
                          // srcSet={`${item?.data}`}
                          src={item.data}
                          alt={item?.name}
                          style={{
                              width:'30vw',
                              height:'auto',
                              display: 'flex', 
                              padding:'5px',
                              flexDirection: 'row',
                              textAlign: 'center'

                             }}


                      />
              
              </ImageListItem></Slide>
          ))}
      

      </ImageList>
            
        </Box>
       

        <Button onClick={addImageToList}>Add</Button>
        <Button>Edit</Button>
        <Button>Remove</Button>
        </Paper>

    );

}

export default MoodBoardGui;