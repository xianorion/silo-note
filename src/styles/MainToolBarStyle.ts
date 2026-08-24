import { styled } from '@mui/material';


export const RetroToolbar = styled('div')({
  display: 'flex',
  alignItems: 'center',
  margin: '1.5%',
  width: '97%',
  minHeight: '34px',
  background: '#f6f1e8',
  border: '1px solid #353535',
  borderRadius: '7px 9px 6px 8px',
  boxShadow: '1px 1px 0 #353535, -1px 0 0 #aaa096',
  overflow: 'hidden',
  boxSizing: 'border-box',

});


export const retroDropDownBtnStyle = {
    minWidth: "62px",
    padding: "4px 8px",
    color: "#353535",
    borderRight: '1px solid #353535',
    borderRadius: 0,
    textTransform: 'none',
    fontFamily: 'Tengoku, "Courier New", monospace',
    fontSize: '0.72rem',
    '&:hover': {
      backgroundColor: '#ded8cd',
    },

};

export const retroMenuStyle = {
    '.MuiPaper-root': {
      backgroundColor: '#ded8cd', 
      boxShadow: '6px 3px 8px rgba(73, 54, 33, 0.1)',  
    },
  }

  export const menuItemStyle = {
    color: '#353535',
    fontFamily: 'Tengoku, "Courier New", monospace',
    fontSize: '0.72rem',
    '&:hover': {
      backgroundColor: '#ded8cd',
    },
  };
