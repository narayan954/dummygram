import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider, useSnackbar } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={1}
        autoHideDuration={4500}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
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
