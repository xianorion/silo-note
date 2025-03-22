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
  width: '100%',  // Take up 100% of the parent container width
  height: '100%', // Take up 100% of the parent container height
  boxSizing: 'border-box',  // Include the border in the element's total width/height
  border: "2vw solid rgb(244, 208, 172)",  // Border size
  borderRadius: "10px",
  margin: '0px',
  padding: '10px',
  backgroundColor: '#d6ad7f', // Corkboard color
  boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.7), 0 4px 10px rgba(0, 0, 0, 0.2)", // Depth shadows
  background: "rgb(201, 159, 94)",
  backgroundSize: "cover",
  overflow: 'hidden', // Prevents content from overflowing if the corkboard is resized
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
  