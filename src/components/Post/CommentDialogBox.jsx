import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Link } from "react-router-dom";
import React from "react";
import ReadMore from "../ReadMore";

const CommentDialogBox = ({
  comments,
  setOpenToDeleteComment,
  openToDeleteComment,
  setDeleteCommentID,
  user,
  fullScreen,
  handleCloseForDeleteComment,
  deleteComment,
  deleteCommentID,
}) => {
  return (
    <Box
      sx={{
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          width: 0,
        },
      }}
      borderRadius="10px"
      maxHeight="40vh"
      marginTop="10px"
    >
      {comments.length ? (
        <>
          {comments.map((userComment) => (
            <div key={userComment.id}>
              <div className="commentCard">
                <div>
                  <Link
                    className="comment-doer"
                    to={`/dummygram/${userComment.content.username}`}
                  >
                    <AccountCircleIcon />
                    <span className="comment-doer-name">
                      {userComment.content.username}
                    </span>
                  </Link>
                  <p className="comment">
                    <ReadMore>{userComment.content.text}</ReadMore>
                  </p>
                </div>
                <div
                  onClick={() => {
                    setOpenToDeleteComment(!openToDeleteComment);
                    setDeleteCommentID(userComment);
                  }}
                >
                  {user &&
                    userComment.content.username === user.displayName && (
                      <DeleteTwoToneIcon
                        fontSize="small"
                        className="comment-delete-icon"
                      />
                    )}
                  {
                    <Dialog
                      fullScreen={fullScreen}
                      open={openToDeleteComment}
                      onClose={handleCloseForDeleteComment}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <DialogTitle id="responsive-dialog-title">
                        {"Delete Comment?"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to delete this Comment?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseForDeleteComment}>
                          Cancel
                        </Button>
                        <Button
                          onClick={(event) =>
                            deleteComment(event, deleteCommentID)
                          }
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  }
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </>
      ) : (
        <span style={{ color: "var(--color)" }}>No Comments</span>
      )}
    </Box>
  );
};

export default CommentDialogBox;
