import React, {FC} from 'react';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ErrorPopUpProps {
styles?:React.CSSProperties;
open:boolean;
error:string | null;
errorSubtext:string | null;
handleClose:()=> void
}


const ErrorPopup: FC<ErrorPopUpProps> = ({open,handleClose, error, errorSubtext}) =>{

    return <Modal
    open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
    >
    <Box sx={{
                position:'absolute',
                bgcolor: 'background.paper',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: '30%',
                width: '30%',
                border: '1px solid #ccc',
                borderRadius: '4px',
                outline: 'none',
                boxShadow: '2px 2px 4px black',
                textAlign: 'center',
                
               
              }}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
      {error}
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      {errorSubtext || ""}
    </Typography>
    </Box>
    </Modal>
}

export default ErrorPopup;