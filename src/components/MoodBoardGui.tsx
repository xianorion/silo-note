import { Button, Dialog, ImageList, Paper,Box,Typography, Grid2 as Grid } from '@mui/material';
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
  className='scroll-container'
  sx={corkboardStyle}
>
  {/* Header */}
  <Grid container alignItems="center" justifyContent="space-between" sx={{ marginBottom: '8px' }}>
    <Typography
      sx={corkboardTitle}
    >
      Mood Board
    </Typography>
    <Close
      sx={{
        width: 20,
        height: 20,
        cursor: 'pointer',
        color: 'var(--silo-ink)',
        transition: 'transform 0.2s ease-in-out',
        ':hover': { transform: 'scale(1.1)' },
      }}
      onClick={onClose}
    />
  </Grid>

  {/* Scrollable Image List */}
  <Box
    sx={{
      flex: '1 1 auto',
      minHeight: 0,
      width: '100%',
      overflow: 'auto',
      padding: '4px',
      border: '1px solid var(--silo-ink)',
      borderRadius: '5px 7px 6px 4px',
      backgroundColor: 'var(--silo-paper-muted)',
    }}
  >
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={() => setIsDragging(true)}>
      <SortableContext items={imgList} strategy={rectSortingStrategy}>
        <ImageList sx={{ width: '100%', margin: 0 }} variant="masonry" cols={3} gap={6}>
          {imgList?.map((item) =>
            item ? (
              <SortableImageItem
                key={item.id}
                removeImageFromList={removeImageFromList}
                item={item}
                dragging={isDragging}
                setSelectedItem={setSelectedItem}
              />
            ) : null
          )}
        </ImageList>
      </SortableContext>
    </DndContext>
  </Box>

  {/* Fixed Add Button */}
  <Box
    sx={{
      padding: '8px',
      textAlign: 'center',
      borderTop: '1px solid var(--silo-ink)',
      backgroundColor: 'var(--silo-paper)',
    }}
  >
    <Button
      onClick={addImageToList}
      sx={corkboardTextOptions}
    >
      Add Image
    </Button>
  </Box>

  {/* Dialog for selected image */}
  <Dialog  onClose={handleClose} open={!!selectedItem}>
    {selectedItem && <img src={selectedItem} alt={selectedItem} loading="lazy" />}
  </Dialog>
</Paper>

    );

}

export default MoodBoardGui;

