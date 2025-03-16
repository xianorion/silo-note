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
    display: 'flex',          // Enables flexbox
    flexDirection: 'column',  // Stacks child elements vertically
    justifyContent: 'center', // Centers the stack vertically
    alignItems: 'flex-start', // Aligns child elements to the left
    margin: 'auto',           // Centers the flex container in its parent

}

export const MainTextBox: Properties<string | number, string & {}>= {
    width: '80%',
    height: '80%',

}

export const mainToolBarStyle: Properties<string | number, string & {}> = {
    width: '100%',
    height: '100%',
    textAlign: 'left',
    display: 'flex',

}

export const linkDrawerStyle = {
  backgroundColor:'rgb(237, 217, 186)',
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
    background: `${bgcolor != null?bgcolor:"#fdf0dc"}`,
    width: '5vw',
    border: `2px solid ${bordercolor != null?bordercolor:"#43281C"}`,
    boxShadow: "3px 3px 0px #888",
    color:"#43281C",
    padding:"10px 20px",
    "&:active":{
        boxShadow: "1px 1px 0px #D4C7B4",
        transform: "translate(2px, 2px)"
    },
    "&:hover":{
    backgroundColor:'rgb(237, 217, 186)',
    transition: 'background-color 0.3s ease-in-out' 
    },
}));

export const iconStyles = {
    background: '#f5ff2eb',
    color: "#8a4c4c",
    filter: 'grayscale(50%) contrast(80%)',
  };

  export const RetroDialog = styled(Dialog)({
    "& .MuiPaper-root": {
      backgroundColor: "#F8F4E8", 
      border: "3px solid #000",
      borderRadius: "0px",
      boxShadow: "6px 6px 0px #A8A29E",
    },
  });
  
  export const RetroDialogTitle = styled(DialogTitle)({
    backgroundColor: "rgb(177, 155, 122)", 
    color: "#000",
    padding: "5px 10px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });
  
