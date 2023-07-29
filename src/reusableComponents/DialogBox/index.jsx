import "./index.css"
// To use this dialog box create a useState and pass them as open and onClose
// open is a boolean value to show the dialog box

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";

const DialogBox = ({
  open,
  onClose,
  title = "Default title",
  children,
  showTitle = true,
}) => {
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      {showTitle && (
        <>
          <DialogTitle
            id="responsive-dialog-title"
            sx={{
              fontWeight: "bold",
              backgroundColor: "var(--dark-post-bg)",
              color: "var(--color)",
            }}
          >
            {title}
          </DialogTitle>
          <Divider />
        </>
      )}

      <DialogContent
        sx={{ color: "var(--color)", backgroundColor: "var(--dark-post-bg)" }}
        className="dialog_box_container"
      >
        <div>{children}</div>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ backgroundColor: "var(--dark-post-bg)" }}>
        <Button
          onClick={onClose}
          sx={{ fontWeight: "bold", color: "var(--color)" }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
