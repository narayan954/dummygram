import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextField from "@mui/material/TextField";
import { db } from "../../lib/firebase.js";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const ITEM_HEIGHT = 48;
const PostViewMenu = ({
  fullScreen,
  postId,
  postHasImages,
  user,
  avatar,
  username,
  caption,
  setFetchAgain,
  fetchAgain,
  imageUrl
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const [anchorEl, setAnchorEl] = useState(null);
  const [editCaption, setEditCaption] = useState(caption);
  const [Open, setOpen] = useState(false);
  const [openEditCaption, setOpenEditCaption] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDownload = () => {
    const urlimg = JSON.parse(imageUrl)[0].imageUrl;
    saveAs(urlimg, "image");
  };
  const handleClickOpenCaption = async () => {
    setOpenEditCaption(true);
  };

  const handleClickClosedCaption = () => {
    setEditCaption(caption);
    setOpenEditCaption(false);
  };

  const handleSubmitCaption = async () => {
    const taskDocRef = doc(db, "posts", postId);
    try {
      await updateDoc(taskDocRef, {
        caption: editCaption
      });
    } catch (err) {
      enqueueSnackbar("Error while updating caption", {
        variant: "error"
      });
    }
    setFetchAgain(!fetchAgain);
    setOpenEditCaption(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteDialog = () => {
    setDeleteDialog(!deleteDialog);
  };

  async function deletePost() {
    await db.collection("posts").doc(postId).delete();
    navigate("/dummygram");
  }

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          color: "var(--color)"
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button"
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch"
          }
        }}
      >
        {user && username === user.displayName && (
          <MenuItem onClick={handleDeleteDialog}> Delete </MenuItem>
        )}
        {user && username === user.displayName && (
          <MenuItem onClick={handleClickOpenCaption}> Edit </MenuItem>
        )}
        {postHasImages && (
          <MenuItem onClick={handleDownload}> Download </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            navigate("/dummygram/profile", {
              state: {
                name: username,
                avatar: avatar
              }
            });
          }}
        >
          Visit Profile
        </MenuItem>
      </Menu>
      <Dialog
        fullWidth
        open={openEditCaption}
        onClose={handleClickClosedCaption}
      >
        <DialogTitle>Change Caption</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter Your Caption"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setEditCaption(e.target.value)}
            value={editCaption}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClosedCaption}>Cancel</Button>
          <Button onClick={handleSubmitCaption}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={deleteDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Delete Post?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deletePost}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostViewMenu;
