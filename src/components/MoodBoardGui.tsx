import { Button, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import React, {FC, useState} from 'react';

const MoodBoardGui: FC = () =>{

    const [imgList, setImgList] = useState<{url:string, name:string}[]>([]);



    return(
        <div
        
        >
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

        <Button>Add</Button>
        <Button>Edit</Button>
        <Button>Remove</Button>
        </div>

    );

}

export default MoodBoardGui;