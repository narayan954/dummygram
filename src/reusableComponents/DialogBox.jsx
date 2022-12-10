// To use this dialog box create a useState and pass them as open and onClose
// open is a boolean value to show the dialog box

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  DialogContentText,
} from "@mui/material";
import { memo } from 'react'; 

const DialogBox = (props) => {
  return (
    <Dialog
      fullWidth
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{props.title}</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>{props.children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
