import { Properties } from 'csstype';
import { styled } from '@mui/material';
import { Button, DialogTitle, Dialog} from '@mui/material';


// Define a custom type for the props
interface RetroBtnProps extends React.ComponentProps<typeof  Button>{
    bgcolor?: string;
    bordercolor?: string;
  }

  interface EditorContentProps {
    bgcolor: string;
    bordercolor: string;
  }

export const GuiStyle: Properties<string | number, string & {}> = {
    
    width: '100%',
  height: '100vh',
  maxWidth: '100vw',
  maxHeight: '100vh',
    display: 'flex',          // Enables flexbox
    flexDirection: 'column',  // Stacks child elements vertically
  justifyContent: 'flex-start',
    alignItems: 'flex-start', // Aligns child elements to the left
    margin: 'auto',           // Centers the flex container in its parent
  boxSizing: 'border-box',
  overflow: 'hidden',

}

export const MainTextBox: {width: string, height: string} = {
    width: '80%',
    height: '80%',

}

export const mainToolBarStyle: Properties<string | number, string & {}> = {
    width: '100%',
    height: '100%',
    textAlign: 'left'
}

export const linkDrawerStyle = {
  backgroundColor:'#f6f1e8'
};

export const toastStyle = {
  justifyContent: 'center', 
  alignItems: 'center', 
  position: 'fixed', 
  width: '50%',
  height: '10%',
  top: '45%', // half of width
  left: '25%', // half of height
  zIndex: 1500,
  backgroundColor: '#FFFFFF',
  boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.7)',
  fontSize: '100%',
  textAlign: 'center',
  overflow: 'hidden'
}


export const RetroBtn = styled(Button)<RetroBtnProps>(({bgcolor, bordercolor}) =>({
  background: `${bgcolor != null?bgcolor:"#f6f1e8"}`,
  minWidth: '6vw',
  minHeight: '5vh',
  border: `1px solid ${bordercolor != null?bordercolor:"#353535"}`,
  borderRadius: '6px 8px 7px 5px',
  boxShadow: '1px 0 0 #353535',
  color:"#353535",
  padding:"4px 5px",
  textTransform: 'none',
  fontFamily: 'Tengoku, "Courier New", monospace',
    fontSize: '0.65rem',
  lineHeight: 1,
    '& .MuiSvgIcon-root': {
      width: '14px',
      height: '14px',
    },
    "&:active":{
    backgroundColor: '#ded8cd',
    transform: "translateY(1px)"
    },
    "&:hover":{
  backgroundColor:'#ded8cd',
  transition: 'background-color 0.15s ease-in-out'
    },
}));

export const iconStyles = {
    background: '#f5ff2eb',
    color: "#8a4c4c",
    filter: 'grayscale(50%) contrast(80%)',
  };

  export const RetroDialog = styled(Dialog)({
    "& .MuiPaper-root": {
    backgroundColor: "#f6f1e8", 
    border: "1.5px solid #353535",
    borderRadius: "9px",
    boxShadow: "4px 4px 0px #b9b2a7",
    },
  });
  
  export const RetroDialogTitle = styled(DialogTitle)({
    backgroundColor: "#ded8cd", 
    color: "#353535",
    padding: "8px 12px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });
  
