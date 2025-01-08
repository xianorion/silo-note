import { Properties } from 'csstype';

export const GuiStyle: Properties<string | number, string & {}> = {
    width: '100%',
    height: '100%',
    display: 'flex',          // Enables flexbox
    flexDirection: 'column',  // Stacks child elements vertically
    justifyContent: 'center', // Centers the stack vertically
    alignItems: 'flex-start', // Aligns child elements to the left
    margin: 'auto',           // Centers the flex container in its parent

}

export const MainTextBox: {width: string, height: string} = {
    width: '80%',
    height: '80%',

}

export const mainToolBarStyle: Properties<string | number, string & {}> = {
    width: '100%',
    height: '100%',
    textAlign: 'left'

}