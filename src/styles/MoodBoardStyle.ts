//Mood board parent dialog styles

//dialog sits under the the paper
export const corkboardParentDialogStyle= { 
  // justifyContent: 'center', 
  // alignItems: 'center', 
  width: '100vw',  // Take up 100% of the parent container width
  height: '100%', // Take up 100% of the parent container height
  padding: 0, // Remove padding to allow full space for content
}




//mood board popup dialog content
export const corkboardParentDialogContentStyle = {
  id: 'corkboardParentDialogContentStyle',
  width: '100%',  // Take up 100% of the parent container width
  height: '100vh', // Take up 100% of the parent container height
  padding: '0%',
  display: 'flex', // Flexbox to center content
  justifyContent: 'center', // Center horizontally
  alignItems: 'center', // Center vertically
  background: "rgb(201, 159, 94)",

};


//Actual mood board content's styles
export const corkboardStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '85vh',
    width: '100%',
    background: 'linear-gradient(135deg, #fbeec1, #f6d6ad)',
    borderRadius: '24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    padding: '16px',
    overflow: 'hidden',
};

  

export const corkboardImage: React.CSSProperties = {
    width:'auto',
    minWidth:'10vw',
    height:'20vh',
    textAlign: 'center',
    boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.2)",
 
};

export const corkboardImageToolBar: React.CSSProperties = {
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
    'rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 0%)',
  height: 'auto',
  display: 'flex',
  padding: '5px',
  flexDirection: 'row',
  textAlign: 'center'
};

  
  export const corkboardTitle = {
    fontSize: "3vx",
    fontWeight: "bold",
    color: "#4e3b31", /* Dark brown text */
    textAlign: "center",
    marginBottom: "20px",
  };
  

  export const corkboardTextOptions = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#4e3b31", /* Dark brown text */
    textAlign: "center",
    marginBottom: "20px"
  };
  