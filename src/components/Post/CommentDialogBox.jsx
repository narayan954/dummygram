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
import React, { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Link } from "react-router-dom";
import ReadMore from "../ReadMore";
import { deleteComment } from "../../js/postFn";

const CommentDialogBox = ({ postId, comments, user, fullScreen }) => {
  const { isAnonymous } = user;
  const [username, setUsername] = useState("");
  const [openToDeleteComment, setOpenToDeleteComment] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  useEffect(() => {
    async function getUsername() {
      const docRef = doc(db, "users", auth?.currentUser?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data().username);
      } else {
        setUsername("guest"); // Handle the case when the user document doesn't exist
      }
    }
    if (isAnonymous) {
      setUsername("guest");
    } else {
      getUsername().catch((error) => {
        console.error("Error fetching username:", error); // Handle any error that might occur during username fetching
      });
    }
  }, []);

  const handleDelete=(event, postId, commentid)=>{
      console.log(event, postId, commentid);
                              
      deleteComment(event, postId, commentid);
      console.log("Comments details: ",commentid);
  }

  /****************************************** */
  const handleDeleteIconClick = (commentId) => {
    setSelectedCommentId(commentId);
    setOpenToDeleteComment(true);
  };

  // Function to clear the selected comment ID when the delete confirmation dialog is closed
  const handleCloseDeleteDialog = () => {
    setSelectedCommentId(null);
    setOpenToDeleteComment(false);
  };

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
          {console.log("my all comments: ",comments) || comments.map((userComment) => (
            <div key={userComment.id}>
              <div className="commentCard">
                <div>
                  <Link
                    className="comment-doer"
                    to={`/${
                      isAnonymous
                        ? "signup"
                        : `user/${userComment.content.username}`
                    }`}
                  >
                    {userComment.content.avatar ? (
                      <img
                        src={userComment.content.avatar}
                        alt="profile picture"
                        className="post-profile-picture"
                      />
                    ) : (
                      <AccountCircleIcon className="icon" />
                    )}{" "}
                    <span className="comment-doer-name">
                      {userComment.content.displayName}
                    </span>
                  </Link>
                  <p className="comment">
                    <ReadMore postId={postId}>
                      {userComment.content.text}
                    </ReadMore>
                  </p>
                </div>
                <div>
                  {user && userComment?.content?.username == username && (
                    <DeleteTwoToneIcon
                      fontSize="small"
                      className="comment-delete-icon"
                      onClick={() => handleDeleteIconClick(userComment.id)}
                    />
                  )}
                  {
                    <Dialog
                      fullScreen={fullScreen}
                      open={openToDeleteComment}
                      onClose={() => setOpenToDeleteComment(false)}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <DialogTitle id="responsive-dialog-title">
                        Delete Comment?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to delete this Comment?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions onClick={handleCloseDeleteDialog}>
                        <Button>
                          Cancel
                        </Button>
                        <Button
                          onClick={(event) =>{
                              handleDelete(event, postId, selectedCommentId);
                              handleCloseDeleteDialog();
                            }
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
