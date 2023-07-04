import "./index.css";

import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";

import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import TextField from "@mui/material/TextField";
import { db } from "../../lib/firebase";
import { saveAs } from "file-saver";
import useCreatedAt from "../../hooks/useCreatedAt";
import { useState } from "react";

const PostHeader = ({ postId, user, postData, postHasImages, timestamp }) => {
  const time = useCreatedAt(timestamp);
  const { fullScreen } = user; // needs fixing
  const { username, caption, imageUrl, uid, email, avatar } = postData;

  const [Open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const [openEditCaption, setOpenEditCaption] = useState(false);
  const [editCaption, setEditCaption] = useState(caption);
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const handleClickOpenCaption = async () => {
    setOpenEditCaption(true);
  };

  const handleClickClosedCaption = () => {
    setEditCaption(caption);
    setOpenEditCaption(false);
  };

  const handleDownload = () => {
    const urlimg = JSON.parse(imageUrl)[0].imageUrl;
    saveAs(urlimg, "image");
  };

  const handleSubmitCaption = async () => {
    const taskDocRef = doc(db, "posts", postId);

    try {
      await updateDoc(taskDocRef, {
        caption: editCaption,
      });
    } catch (err) {
      alert(err);
    }
    setOpenEditCaption(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function deletePost() {
    await db.collection("posts").doc(postId).delete();
  }

  return (
    <div className="post__header">
      {user && username === user.displayName && (
          <Avatar
          className="post__avatar avatar flex"
          alt={username}
          src={avatar}
          onClick={() => {
            navigate(`/dummygram/myprofile`, {
              state: {
                name: username,
                avatar: avatar,
              },
            });
          }}
        />
      )}
      {user && username !== user.displayName && (
          <Avatar
          className="post__avatar avatar flex"
          alt={username}
          src={avatar}
          onClick={() => {
            navigate(`/dummygram/profile/${postData.uid}`, {
              state: {
                name: username,
                avatar: avatar,
              },
            });
          }}
        />
      )}
      
      <Link
        to={`/dummygram/posts/${postId}`}
        style={{ textDecoration: "none" }}
      >
        <h3 className="post__username">{username}</h3>
        <p className="post__time">{time}</p>
      </Link>
      <div className="social__icon__last">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            color: "var(--color)",
          }}
        >
          <MoreHorizOutlinedIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          {user && username === user.displayName && (
            <MenuItem onClick={handleClickOpen}> Delete </MenuItem>
          )}
          {user && username === user.displayName && (
            <MenuItem onClick={handleClickOpenCaption}> Edit </MenuItem>
          )}
          {postHasImages && (
            <MenuItem onClick={handleDownload}> Download </MenuItem>
          )}
          {user && username === user.displayName && (
            <MenuItem
            onClick={() => {
              navigate("/dummygram/myprofile", {
                state: {
                  name: username,
                  avatar: avatar,
                  uid: uid,
                  email: email,
                },
              });
            }}
          >
            Visit Profile
          </MenuItem>
          )}
          {user && username !== user.displayName && (
            <MenuItem
            onClick={() => {
              navigate(`/dummygram/profile/${user.uid}`, {
                state: {
                  name: username,
                  avatar: avatar,
                  uid: uid,
                  email: email,
                },
              });
            }}
          >
            Visit Profile
          </MenuItem>
          )}
        </Menu>
        <>
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
        </>

        <Dialog
          fullScreen={fullScreen}
          open={Open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Delete Post?"}
          </DialogTitle>
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
      </div>
    </div>
  );
};

export default PostHeader;
