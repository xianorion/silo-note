import {ImageListItem, ImageListItemBar,IconButton, Tooltip } from '@mui/material';
import React, {FC, useState} from 'react';
import {Delete, ZoomIn} from '@mui/icons-material';
import { ImgListType } from 'types/GlobalTypes';
import Slide from '@mui/material/Slide';

import { useSortable } from '@dnd-kit/sortable';
import { corkboardImage} from './../styles/MoodBoardStyle';
import { CSS } from '@dnd-kit/utilities';
import { corkboardImageToolBar } from './../styles/MoodBoardStyle';

interface SortableImageItemProps {  
    removeImageFromList:(event: React.MouseEvent, imgPath: string) => Promise<void>;
    item: ImgListType;
    dragging: boolean;
    setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>
}

const SortableImageItem: FC<SortableImageItemProps> = ({removeImageFromList, setSelectedItem, item, dragging}) => {

    const {listeners, transform,transition,attributes,setNodeRef} =useSortable({id:item.id});
    const [showTrashIcon,setShowTrashIcon] = useState<boolean>(false);
    const style = {
      transition,
      transform:CSS.Transform.toString(transform),
    }

    const handleRemove = (event: React.MouseEvent) =>{
      event.stopPropagation();
      console.log("Handle remove");

      removeImageFromList(event, item.id);
    }


    return <Slide 
          style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100%'}}

    in timeout={1000} key={item.id}>
      <ImageListItem
              className="mood-image-item"
             onMouseEnter={() => setShowTrashIcon(true)}
             onMouseLeave={() => setShowTrashIcon(false)}
      >
      <ImageListItemBar 
        className={`mood-image-toolbar${dragging ? ' mood-image-toolbar-hidden' : ''}`}
        position="top"
        style={corkboardImageToolBar}
        actionIcon={showTrashIcon && !dragging && 
        <div>
             <IconButton
           sx={{ padding: '2px' }}
       onClick={()=> setSelectedItem(item.data)}
     >
     <Tooltip id="button-zoom" title="zoom">
         <ZoomIn sx={{ color: 'var(--silo-paper)', width: 14, height: 14, background:'rgba(75, 42, 27, 0.82)' }} />
       </Tooltip>
     </IconButton>
<IconButton
  sx={{ padding: '2px', color: 'var(--silo-paper)', "&:hover": { color: "var(--silo-orange)" }, zIndex: 800 }}

       onClick={handleRemove}
     >
       <Tooltip id="button-remove" title="remove">
        <Delete sx={{ color: 'var(--silo-paper)', width: 14, height: 14, background:'rgba(75, 42, 27, 0.82)' }} />
       </Tooltip>
     </IconButton>
  

        </div>}
        actionPosition="right" />
      {item.data? <img
        // srcSet={`${item?.data}`}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        src={item.data}
        alt={item?.name}
        style={{
          ...style,
          ...corkboardImage
        }} />:<>IMAGE NOT FOUND</>}
    </ImageListItem></Slide>;
  }
  

  export default SortableImageItem;