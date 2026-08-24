import { Properties } from 'csstype';
import { styled } from '@mui/material';
import { Button, DialogTitle, Dialog, Tooltip} from '@mui/material';


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
  backgroundColor:'var(--silo-paper)'
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
  backgroundColor: 'var(--silo-paper)',
  boxShadow:'5px 5px 10px rgba(75, 42, 27, 0.35)',
  fontSize: '100%',
  textAlign: 'center',
  overflow: 'hidden'
}

export const RetroTooltip = styled(Tooltip)(() => ({
    color: 'var(--silo-orange)',
    fontFamily: 'Tengoku, "Courier New", monospace',
    fontSize: '0.1rem',
    border: '1px solid var(--silo-ink)',
    boxShadow: '2px 2px 0 var(--silo-shadow)',
}));


export const RetroBtn = styled(Button)<RetroBtnProps>(({bgcolor, bordercolor}) =>({
  background: `${bgcolor != null?bgcolor:"var(--silo-paper)"}`,
  minWidth: '6vw',
  minHeight: '5vh',
  border: `1px solid ${bordercolor != null?bordercolor:"var(--silo-ink)"}`,
  borderRadius: '6px 8px 7px 5px',
  boxShadow: '1px 0 0 var(--silo-ink)',
  color:"var(--silo-ink)",
  padding:"4px 5px",
  textTransform: 'none',
  fontFamily: 'Tengoku, "Courier New", monospace',
    fontSize: '0.65rem',
  lineHeight: 1,
    '--retro-btn-icon-size':'1.5rem',
    '& .MuiSvgIcon-root': {
      width: 'var(--retro-btn-icon-size)',
      height: 'var(--retro-btn-icon-size)',
    },
    width: 'fit-content',

    "&:active":{
    backgroundColor: 'var(--silo-paper-muted)',
    transform: "translateY(1px)"
    },
    "&:hover":{
  backgroundColor:'var(--silo-paper-muted)',
  transition: 'background-color 0.15s ease-in-out'
    },
}));

export const iconStyles = {
    filter: 'grayscale(50%) contrast(80%)',
  };

  export const RetroDialog = styled(Dialog)({
    "& .MuiPaper-root": {
    backgroundColor: "var(--silo-paper)", 
    border: "1.5px solid var(--silo-ink)",
    borderRadius: "9px",
    boxShadow: "4px 4px 0px var(--silo-shadow)",
    },
  });
  
  export const RetroDialogTitle = styled(DialogTitle)({
    backgroundColor: "var(--silo-paper-muted)", 
    color: "var(--silo-ink)",
    padding: "8px 12px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });
  
