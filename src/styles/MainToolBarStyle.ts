import { styled } from '@mui/material';


export const RetroToolbar = styled('div')({
  display: 'flex',
  alignItems: 'center',
  margin: '1.5%',
  width: '97%',
  minHeight: '34px',
  background: 'var(--silo-paper)',
  border: '1px solid var(--silo-ink)',
  borderRadius: '7px 9px 6px 8px',
  boxShadow: '1px 1px 0 var(--silo-ink), -1px 0 0 var(--silo-shadow)',
  overflow: 'hidden',
  boxSizing: 'border-box',

});


export const retroDropDownBtnStyle = {
    minWidth: "62px",
    padding: "4px 8px",
    color: "var(--silo-ink)",
    borderRight: '1px solid var(--silo-ink)',
    borderRadius: 0,
    textTransform: 'none',
    fontFamily: 'Tengoku, "Courier New", monospace',
    fontSize: '0.72rem',
    '&:hover': {
      backgroundColor: 'var(--silo-paper-muted)',
    },

};

export const retroMenuStyle = {
    '.MuiPaper-root': {
      backgroundColor: 'var(--silo-paper-muted)', 
      boxShadow: '6px 3px 8px rgba(73, 54, 33, 0.1)',  
    },
  }

  export const menuItemStyle = {
    color: 'var(--silo-ink)',
    fontFamily: 'Tengoku, "Courier New", monospace',
    fontSize: '0.72rem',
    '&:hover': {
      backgroundColor: 'var(--silo-paper-muted)',
    },
  };
