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

import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
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
      borderRadius="16px"
      maxHeight="30vh"
    >
      {comments.length ? (
        <>
          {comments.map((userComment) => (
            <div key={userComment.id}>
              <div
                style={{
                  padding: "0.4rem 1rem",
                  marginTop: "0.3rem",
                  marginBottom: "0.3rem",
                  display: "flex",
                  justifyContent: "space-between",
                  background: "lightgray",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "black",
                  }}
                >
                  {userComment.content.username}
                  <span style={{ fontSize: "0.9rem" }}>
                    <ReadMore>{userComment.content.text}</ReadMore>
                  </span>
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
                        style={{ color: "red" }}
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
        <span>No Comments</span>
      )}
    </Box>
  );
};

export default CommentDialogBox;
