// To use this dialog box create a useState and pass them as open and onClose
// open is a boolean value to show the dialog box

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";

const DialogBox = (props) => {
  return (
    <Dialog
      fullWidth
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        id="responsive-dialog-title"
        sx={{
          fontWeight: "bold",
          backgroundColor: "var(--bg-color)",
          color: "var(--color)",
        }}
      >
        {props.title}
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{ color: "var(--color)", backgroundColor: "var(--bg-color)" }}
      >
        <DialogContentText>{props.children}</DialogContentText>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ backgroundColor: "var(--bg-color)" }}>
        <Button
          onClick={props.onClose}
          sx={{ fontWeight: "bold", color: "var(--color)" }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
