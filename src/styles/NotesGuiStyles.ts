import { display, height, width } from "@mui/system"

export const noteContainerStyle: React.CSSProperties = {
  display: 'flex',          // Enables flexbox
  height: '100vh',
  width:'90vw%',
  alignItems: 'flex-start', // Aligns child elements to the left
  flexDirection: 'column',
  background:'rgb(255, 247, 225)',
  border: '4px solid #43281C',
  borderRadius: "10px",
  overflowY: 'auto',

}

export const noteHeaderStyle: React.CSSProperties ={
  display: 'flex',
  width:'100%',
  justifyContent: 'space-between',  // Distribute space between items
  alignItems: 'center',  // Vertically align items to the center
  gap: '1vw',  // Add space between the child elements (adjust the value as needed)
}

export const noteTextTitleStyle = {
  fontFamily:'Singkong',
  fontSize: '2.5vw',   
  margin: '0px 10px 0px 0px'

}
export const noteTextContentStyle = {
  fontFamily:'Singkong',
  fontSize: '1.5vw',   
  width:'100%'

}
export const noteTitleStyle: React.CSSProperties = {
  flexDirection:'row',
  display: 'flex',
  justifyContent: 'space-between',
   alignItems: 'center',
  width:'100%'
}
export const noteStyle: React.CSSProperties = {
  flexDirection:'column',
  display: 'flex',
  width: '100%',
  minWidth: '100%',
  backgroundColor: '#F5E6C7',
  padding:  '20px',
  borderRadius: '15px',
  gridTemplateRows:'auto auto 1fr auto',
  gap: '10px',
  boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.2)",
  marginBottom: '10px'

}

export const iconCircleStyle = {
  width: '3vw',
  height: 'auto',
  marginLeft: 'auto',
}


export const noteBankStyle = {
    maxHeight: '100%', 
    width:'95%',
      padding: "5px",
      overflow: 'auto',
      margin: '0px',
      background: 'rgba(181, 54, 54, 0)',
      display: 'flex',  // Ensures Flexbox layout
      justifyContent: 'center',  // Aligns notes in list to center
      alignItems: 'center',  
    };
  

    export const noteIconStyle = {
        width: '5vw',  // Customize the width as per your requirement
        height: 'auto', // Prevent the Paper from getting too large vertically
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
          margin: '0px',
          background: "rgba(0, 0, 0,0)",
          color:"rgb(0, 0, 0)",
        };

        export const noteBankTitleTypographyStyle ={
            fontSize: '3px',                        
            fontWeight: 'bold',  
            width: '100%',
 
            }

            export const noteItemTypographyStyle ={
                fontSize: '30px', 
                width: '100%',

            }


            export const noteBankListStyle = {
              height:'100%',
              width: '90%'
            }

            export const addNoteBtnStyle = {
              color:"#43281C",
              padding:"10px 20px",
            }
            