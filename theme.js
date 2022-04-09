import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
    h1: {
      fontSize: "72pt",
      fontWeight: 800,
    },
    h2: {
      fontWeight: 800,
      fontSize: "72pt",
    },
    h3: {
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: "25pt",
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#e74c3c",
    },
    secondary: {
      main: "#27ae60",
    },
    error: {
      main: red.A400,
    },
  },
  shape: {
    borderRadius: 10,
  },
});

export default responsiveFontSizes(theme, {
  variants: ["h2", "h3", "h4", "subtitle1", "body1"],
});
