import React, {FC} from 'react';
import MainToolbar from './MainToolbar';
import SiloTextEditor from './SiloTextEditor';
import { GuiStyle } from 'styles/SiloTextBoxStyle';

const SiloGui : FC = () => {

    return <div style={GuiStyle} >
        <MainToolbar/>
        <SiloTextEditor/>
    
    </div>
}

export default SiloGui;