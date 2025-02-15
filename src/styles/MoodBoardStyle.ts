import { Properties } from 'csstype';
import { styled } from '@mui/material';
import { Button, DialogTitle, Dialog} from '@mui/material';
import { Opacity } from '@mui/icons-material';


export const corkboardStyle = {
    padding: "30px",
    backgroundColor: '#d6ad7f', /* Corkboard color */
    border: "20px solid rgb(244, 208, 172)",  /* Darker border for depth */
    borderRadius: "10px",
    margin: "20px auto",
    boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.7), 0 4px 10px rgba(0, 0, 0, 0.2)", /* Depth shadows */
    background: "rgb(201, 159, 94)",
    backgroundSize: "cover",
  };
  

export const corkboardImage: React.CSSProperties = {
    width:'30vw',
    height:'auto',
    textAlign: 'center',
    boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.2)",
 
};

  
  export const corkboardTitle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#4e3b31", /* Dark brown text */
    textAlign: "center",
    marginBottom: "20px"
  };
  

  export const corkboardTextOptions = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#4e3b31", /* Dark brown text */
    textAlign: "center",
    marginBottom: "20px"
  };
  