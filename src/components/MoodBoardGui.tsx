import { Button, Dialog, ImageList, ImageListItem, ImageListItemBar,IconButton, Paper,Box,Typography, Grid2 as Grid, Tooltip } from '@mui/material';
import React, {FC, useEffect, useState} from 'react';
import {Close} from '@mui/icons-material';
import { ImgListType } from 'types/GlobalTypes';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { corkboardStyle, corkboardTitle, corkboardTextOptions} from './../styles/MoodBoardStyle';
import { Dispatch, SetStateAction } from 'react';
import SortableImageItem from './SortableImageItem';


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

    const [isDragging, setIsDragging] = useState<boolean>(false);



  const handleDragEnd = (event: DragEndEvent) => {
    console.log("Handing drag....");
    setIsDragging(false);
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = imgList.findIndex((image) => image.name === active.id);
      const newIndex = imgList.findIndex((image) => image.name === over?.id);

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

      console.log("Click remove image from list!");     

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
        id="PAPER_MOOD_BOARD"
        sx={corkboardStyle}
        >
        <Box  sx={{width:'100%'}}>
            <Grid container spacing={2}
            sx={{padding:'10px', width:'100%'}}>
                <Grid size={10}>
                    <Typography
                    sx={corkboardTitle}
                    >Mood Board</Typography>
                </Grid>
                <Grid size={2}  sx={{
                    }}>    
                    <Close sx={{width: '3vw', height: '3vw'}} onClick={onClose}/>
                </Grid>
           
            </Grid>
            <Grid sx={{width:'100%'}}container spacing={2}>
            <Grid size={12}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '60vh', // Adjust the height as needed, can change based on content
              overflow: 'auto', // Enable scrolling inside Box
            }}
            >
                      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={()=> setIsDragging(true)}>
                      <SortableContext  items={imgList} strategy={rectSortingStrategy}>
                    <ImageList sx={{ height: '100%', width: '100%', overflowY: 'auto',  padding:'5px', margin:'5px'}} >
                    
                    {imgList && imgList.map((item)=>(
                          item && 
                            <SortableImageItem key={item.id} removeImageFromList={removeImageFromList} item={item} dragging={isDragging} setSelectedItem={setSelectedItem}/>
                            ))}
                
              
                </ImageList>
                </SortableContext>
                
                </DndContext>
                </Grid>

            </Grid>
            
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
       

        <Button  sx={corkboardTextOptions} style={{margin:'10px',padding:'10px'}} onClick={addImageToList}>Add</Button>
        </Paper>

    );

}

export default MoodBoardGui;

