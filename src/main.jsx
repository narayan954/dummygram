import "./index.css";

import { SnackbarProvider, useSnackbar } from "notistack";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import LandingAnimation from "./components/LandingAnimation";
import React from "react";
import ReactDOM from "react-dom/client";

const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LandingAnimation />
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={1}
        autoHideDuration={4500}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        dense
        action={(snackbarId) => {
          const { closeSnackbar } = useSnackbar();
          return (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => closeSnackbar(snackbarId)}
            >
              <Close fontSize="small" />
            </IconButton>
          );
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
