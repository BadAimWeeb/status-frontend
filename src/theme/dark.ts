import { createTheme } from "@mui/material";

export default createTheme({
    palette: {
        primary: {
            main: "#23c24d",
        },  
        secondary: {
            main: "#ff9800",
        },
        mode: "dark"
    },
    typography: {
        fontFamily: "Roboto",
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
    },
});