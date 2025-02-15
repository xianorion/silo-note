import { Button, Dialog, ImageList, ImageListItem, ImageListItemBar,IconButton, Paper,Box,Typography, Grid2 as Grid, Tooltip } from '@mui/material';
import React, {FC, useEffect} from 'react';
import {Delete, OpenInFull} from '@mui/icons-material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { ImgListType } from 'types/GlobalTypes';
import Slide from '@mui/material/Slide';
//import { DndContext, useDroppable, useDraggable, MouseSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
//import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { corkboardStyle, corkboardImage, corkboardTitle, corkboardTextOptions} from './../styles/MoodBoardStyle';
import { Dispatch, SetStateAction } from 'react';


interface MoodBoardGuiProps {
    imgList:ImgListType[] | [];
    addImage: (event:React.MouseEvent) => Promise<{ status: boolean; msg: string; }>;
    setImageList: Dispatch<SetStateAction<any>>;
    removeImage: (event:React.MouseEvent, imgPath:string) => Promise<{ status: boolean; msg: string; }>;
    onClose: () => void
}
const MoodBoardGui: FC<MoodBoardGuiProps> = ({imgList, addImage, removeImage, setImageList, onClose}) =>{

    useEffect(()=>{
        console.log("New LIMAGE LIST: ", imgList);
    },[imgList]);


  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = imgList.findIndex((image) => image.name === active.name);
      const newIndex = imgList.findIndex((image) => image.name === over?.name);

      // Reorder the array based on the active and over elements
      const updatedImages = [...imgList];
      updatedImages.splice(oldIndex, 1);
      updatedImages.splice(newIndex, 0, imgList[oldIndex]);

      setImageList(updatedImages);
    }
  };

    const addImageToList = async (event:React.MouseEvent) =>{
        const res = await addImage(event);
       
        console.log("Returned to MoodBoardGui addimagefunction.")
        console.log("Recieved addImge result: ", res);
    }

    const removeImageFromList = async (event:React.MouseEvent, imgPath:string) =>{
        const res = await removeImage(event, imgPath);
        console.log("removeImageFromList event triggered: ", event);     
    }

    const editImageMsg= async (event:React.MouseEvent) =>{
        console.log("Edit event triggered: ", event)       
    }

    const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  const handleClose = () => setSelectedItem(null);


    return(
        <Paper
        sx={corkboardStyle}
        >
        <Box>
            <Grid container spacing={2}
            sx={{padding:'10px'}}>
                <Grid size={10}>
                    <Typography
                    sx={corkboardTitle}
                    >Mood Board</Typography>
                </Grid>
                <Grid size={2}  sx={{
                    }}>
                     
                    <OpenInFullIcon onClick={onClose}/>
                </Grid>
           
            </Grid>

        <ImageList sx={{ overflowX: 'auto', height: '100%', padding:'5px', margin:'10px'}} >
          
          {imgList && imgList.map((item)=>(
                 item && <Slide in timeout={1000} key={item.name}>
                    <ImageListItem 
                    >
                        <ImageListItemBar
              position="top"
              style={{
                background:
                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                'rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 0%)',
                width:'30vw',
                height:'auto',
                display: 'flex', 
                              padding:'5px',
                              flexDirection: 'row',
                              textAlign: 'center'
               }}
              actionIcon={
                <IconButton
                onClick={(e) => removeImageFromList(e, item.name)}
                  sx={{ color: 'white', "&:hover": { color: "black" }, zIndex:800}}
                >
                  <Tooltip id="button-remove" title="remove">
                    <Delete sx={{ color: 'white', width: '3vw', height: '3vw' }}/>
                  </Tooltip>
                </IconButton>
              }
              actionPosition="right"
            />
                      
                      <img
                          // srcSet={`${item?.data}`}
                          src={item.data}
                          alt={item?.name}
                          onClick={ () => setSelectedItem(item.data)}
                          style={{
                              ...corkboardImage

                             }}

                      />    
              </ImageListItem>
              </Slide>
          ))}
      

      </ImageList>

        </Box>
        <Dialog
        onClose={handleClose}
        open={!!selectedItem}
      >
        {selectedItem &&<img
          src={selectedItem}
          alt={selectedItem}
          loading="lazy"
        />}
      </Dialog>
       

        <Button  sx={corkboardTextOptions}  onClick={addImageToList}>Add</Button>
        <Button sx={corkboardTextOptions} >Edit</Button>
        <Button sx={corkboardTextOptions}>Remove</Button>
        </Paper>

    );

}

export default MoodBoardGui;