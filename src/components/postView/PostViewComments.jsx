import React, { useState } from "react";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { db } from "../../lib/firebase.js";
import useCreatedAt from "../../hooks/useCreatedAt.jsx";


const PostViewComments = ({ fullScreen, postId, user, userComment }) => {
  const { timestamp } = userComment.content;
  const time = useCreatedAt(timestamp);
  const [open, setOpen] = React.useState(false);
  const [commentId, setCommentId] = useState("");
  const deleteComment = async (event, commentRef) => {
    event.preventDefault();
    await db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentRef.id)
      .delete();
  };
  const handleClose = () => setOpen(!open);
  return (
    <>
      <Typography variant={"body1"}>{time}</Typography>
      {user && userComment.content.username === user.displayName ? (
        <IconButton onClick={() => {
          setOpen(!open);
          setCommentId(userComment);
        }}>
          <DeleteTwoToneIcon
            fontSize="small"
            style={{ color: "red" }}
          />
        </IconButton>
      ) : null}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title">
          {"Delete Comment?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete
            this
            Comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={(event) =>
              deleteComment(
                event,
                commentId
              )
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostViewComments;