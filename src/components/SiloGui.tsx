import React, {FC, useState} from 'react';
import SiloTextEditor from './SiloTextEditor';
import SiloTextEditor2 from './SiloTextEditor2';
import { GuiStyle } from 'styles/SiloTextBoxStyle';
import { createTheme, ThemeProvider, Typography } from '@mui/material';

// Create a theme with custom typography
const theme = createTheme({
  typography: {
    fontFamily: '"Poiret-One-Latin"', // Your custom font family
    fontSize:20
  },
});

const SiloGui : FC = () => {
   

    return <ThemeProvider theme={theme}>
        <div style={GuiStyle} >
                {/* <MainToolbar/> */}
                {/* <SiloTextEditor/> */}
                <SiloTextEditor2/>
            
            </div>
    </ThemeProvider>
  
}

export default SiloGui;