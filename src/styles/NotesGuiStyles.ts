export const noteContainerStyle: React.CSSProperties = {
  display: 'flex',          // Enables flexbox
  height: '100%',
  width: '100%',
  alignItems: 'flex-start', // Aligns child elements to the left
  flexDirection: 'column',
  background:'#f6f1e8',
  border: '1px solid #353535',
  borderRadius: "8px 6px 9px 7px",
  boxShadow: '2px 2px 0 #b9b2a7',
  overflowY: 'auto',

}

export const noteHeaderStyle: React.CSSProperties ={
  display: 'flex',
  width:'100%',
  justifyContent: 'space-between',  // Distribute space between items
  alignItems: 'center',  // Vertically align items to the center
  gap: '8px',
  padding: '8px 12px',
  borderBottom: '1px solid #353535',
}

export const noteTextTitleStyle = {
  fontFamily:'Tengoku',
  fontSize: '14px',
  margin: '0px 10px 0px 0px',
  color: '#353535',

}
export const noteTextContentStyle = {
  fontFamily:'Tengoku',
  fontSize: '13px',
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
  backgroundColor: '#f6f1e8',
  padding:  '8px 10px',
  border: '1px solid #353535',
  borderRadius: '6px 8px 5px 7px',
  gridTemplateRows:'auto auto 1fr auto',
  gap: '6px',
  boxShadow: "1px 1px 0px #b9b2a7",
  marginBottom: '6px'

}

export const iconCircleStyle = {
  width: '16px',
  height: '16px',
  marginLeft: 'auto',
}


export const noteBankStyle = {
    maxHeight: '100%', 
    width:'100%',
      padding: "4px",
      overflow: 'auto',
      margin: '0px',
      background: 'transparent',
      display: 'flex',  // Ensures Flexbox layout
      justifyContent: 'center',  // Aligns notes in list to center
      alignItems: 'center',  
    };
  

    export const noteIconStyle = {
        width: '18px',
        height: '18px',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
          margin: '0px',
          background: "transparent",
          color:"#353535",
        };

        export const noteBankTitleTypographyStyle ={
            fontSize: '18px',
            fontWeight: 'bold',  
            width: '100%',
            color: '#353535',
 
            }

            export const noteItemTypographyStyle ={
                fontSize: '16px',
                width: '100%',
                color: '#353535',

            }


            export const noteBankListStyle = {
              height:'100%',
              width: '100%',
              padding: 0,
            }

            export const addNoteBtnStyle = {
              color:"#353535",
              minWidth: '28px',
              padding:"4px 6px",
              border: '1px solid #353535',
              borderRadius: '6px 8px 5px 7px',
              background: '#ded8cd',
            }
            