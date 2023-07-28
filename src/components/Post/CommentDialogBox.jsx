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
import { auth, db, handleMultiUpload } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import React,{useState,useEffect} from "react";
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
  const { isAnonymous } = user;
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function getUsername() {
      const docRef = doc(db, "users", auth?.currentUser?.uid);
      const docSnap = await getDoc(docRef);
      setUsername(docSnap.data().username);
    }
    getUsername();
  }, []);

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
                    to={`/dummygram/${
                      isAnonymous
                        ? "signup"
                        : `user/${userComment.content.username}`
                    }`}
                  >
                    {userComment.content.avatar ? (
                      <img
                        src={userComment.content.avatar}
                        alt="profile picture"
                        className="profile-picture"
                      />
                    ) : (
                      <AccountCircleIcon className="icon" />
                    )}{" "}
                    <span className="comment-doer-name">
                      {userComment.content.displayName}
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
                    userComment?.content?.username == username && (
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
