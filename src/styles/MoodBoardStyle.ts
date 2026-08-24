//Mood board parent dialog styles
import type { CSSProperties } from 'react';

//dialog sits under the the paper
export const corkboardParentDialogStyle: CSSProperties = { 
  // justifyContent: 'center', 
  // alignItems: 'center', 
  width: 'min(760px, 88vw)',
  maxWidth: '88vw',
  height: 'min(760px, 88vh)',
  maxHeight: '88vh',
  padding: 0, // Remove padding to allow full space for content
  display: 'flex',
  boxSizing: 'border-box',
}




//mood board popup dialog content
export const corkboardParentDialogContentStyle = {
  id: 'corkboardParentDialogContentStyle',
  width: '100%',  // Take up 100% of the parent container width
  height: '100%',
  maxHeight: '100%',
  padding: '0%',
  display: 'flex', // Flexbox to center content
  justifyContent: 'center', // Center horizontally
  alignItems: 'center', // Center vertically
  background: "#e9e4dc",

};


//Actual mood board content's styles
export const corkboardStyle = {
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  maxHeight: '100%',
    padding: "12px",
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f6f1e8',
    border: "1px solid #353535",
    borderRadius: "8px 6px 9px 7px",
    margin: '0px',
    boxShadow: "3px 3px 0 #b9b2a7, -1px 0 #aaa096",
    background: "#f6f1e8",
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  };
  

export const corkboardImage: React.CSSProperties = {
  width:'100%',
  minWidth:0,
    height:'auto',
    display: 'flex',
    flexDirection: 'column',
    background: '#f6f1e8',
    border: '1px solid #353535',
    borderRadius: '5px 7px 6px 4px',
    boxShadow: '2px 2px 0px #b9b2a7',
    padding: '4px',
    overflow: 'hidden',
};


export const corkboardImageToolBar: React.CSSProperties = {

  width: 'auto',
  background: 'rgba(53, 53, 53, 0.82)',
  height: 'auto',
  display: 'flex',
  padding: '2px',
  flexDirection: 'row',
  textAlign: 'center'
};

  
  export const corkboardTitle = {

    fontSize: "18px",
    fontWeight: "bold",
    color: "#353535",
    textAlign: "center",

    marginBottom: "8px",
  };
  

  export const corkboardTextOptions = {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#353535",
    textAlign: "center",
    marginBottom: "20px"
  };
  