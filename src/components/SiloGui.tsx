import React, {FC, useState} from 'react';
import SiloTextEditor from './SiloTextEditor';
import { GuiStyle } from './../styles/SiloTextBoxStyle';
import { menuItemStyle } from './../styles/MainToolBarStyle';
import { createTheme, ThemeProvider, Typography } from '@mui/material';

// Create a theme with custom typography
const theme = createTheme({
  typography: {
    fontFamily: '"Tengoku"', // Your custom font family
    fontSize:26
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: menuItemStyle,
      },
    },
  },
});

const SiloGui : FC = () => {
   

    return <ThemeProvider theme={theme}>
        <div style={GuiStyle} >
                {/* <MainToolbar/> */}
                {/* <SiloTextEditor/> */}
                <SiloTextEditor/>
            
            </div>
    </ThemeProvider>
  
}

export default SiloGui;