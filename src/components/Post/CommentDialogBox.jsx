import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import { ImageSlider, Scroll } from "../../reusableComponents";

import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import React from "react";

const CommentDialogBox = ({
  Item,
  postHasImages,
  postImages,
  caption,
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
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={6}>
          <Item>
            {postHasImages ? (
              <ImageSlider slides={postImages} isCommentBox />
            ) : (
              <div className="post__background">
                <p className="post_caption">{caption}</p>
              </div>
            )}
          </Item>
        </Grid>
        <Grid item xs={6} md={6}>
          <Scroll>
            <Item>
              <div className="post__comments">
                {comments.length ? (
                  <>
                    {comments.map((userComment) => (
                      <p key={userComment.id}>
                        <strong>{userComment.content.username}</strong>{" "}
                        {userComment.content.text}
                        <span
                          onClick={() => {
                            setOpenToDeleteComment(!openToDeleteComment);
                            setDeleteCommentID(userComment);
                          }}
                        >
                          {user &&
                          userComment.content.username === user.displayName ? (
                            <DeleteTwoToneIcon
                              fontSize="small"
                              style={{ color: "red" }}
                            />
                          ) : (
                            <></>
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
                        </span>
                        <hr />
                      </p>
                    ))}
                  </>
                ) : (
                  <span>No Comments</span>
                )}
              </div>
            </Item>
          </Scroll>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommentDialogBox;
