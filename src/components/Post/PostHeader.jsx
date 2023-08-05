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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ProfileDialogBox from "../ProfileDialogBox";
import TextField from "@mui/material/TextField";
import { db } from "../../lib/firebase";
import deletePost from "../../js/deletePost";
import { saveAs } from "file-saver";
import useCreatedAt from "../../hooks/useCreatedAt";
import { useSnackbar } from "notistack";

const PostHeader = ({ postId, user, postData, postHasImages, timestamp }) => {
  const time = useCreatedAt(timestamp);
  const { fullScreen, isAnonymous } = user; // TODO: needs fixing
  const { username, caption, imageUrl, displayName, avatar } = postData;
  const [Open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const [openEditCaption, setOpenEditCaption] = useState(false);
  const [editCaption, setEditCaption] = useState(caption);
  const [mouseOnProfileImg, setMouseOnProfileImg] = useState(false);
  const [userData, setUserData] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function getUserData() {
      const docRef = db
        .collection("users")
        .where("uid", "==", postData.uid)
        .limit(1);
      docRef
        .get()
        .then((snapshot) => {
          if (snapshot.docs) {
            const doc = snapshot.docs[0];

            const data = doc.data();
            setUserData({
              name: data.name,
              username: data.username,
              avatar: data.photoURL,
              uid: data.uid,
              posts: data.posts.length,
              bio: data.bio
                ? data.bio
                : "Lorem ipsum dolor sit amet consectetur",
              followers: "",
              following: "",
              country: data.country ? data.country : "",
              storyTimestamp: data.storyTimestamp,
            });
          } else {
            setUserExists(false);
          }
        })
        .catch((error) => {
          enqueueSnackbar(`Error Occured: ${error}`, {
            variant: "error",
          });
        });
    }
    getUserData();
  }, []);

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

  function showProfileDialogBox() {
    setMouseOnProfileImg(true);
  }

  function hideProfileDialogBox() {
    setTimeout(() => {
      setMouseOnProfileImg(false);
    }, 1200);
  }

  return (
    <div className="post__header">
      <Avatar
        className="post__avatar  flex avatar"
        alt={displayName}
        src={avatar}
        onClick={() =>
          navigate(`/dummygram/${isAnonymous ? "signup" : `user/${username}`}`)
        }
        onMouseEnter={showProfileDialogBox}
        onMouseLeave={hideProfileDialogBox}
      />
      <ProfileDialogBox
        mouseOnProfileImg={mouseOnProfileImg}
        userData={userData}
      />
      <Link
        to={`/dummygram/${isAnonymous ? "signup" : `posts/${postId}`}`}
        style={{ textDecoration: "none" }}
      >
        <h3 className="post__username">{displayName}</h3>
        <p className="post__time">{time}</p>
      </Link>
      <div className="social__icon__last">
        {!location.pathname.includes("/dummygram/user") && (
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) =>
              isAnonymous
                ? navigate("/dummygram/signup")
                : setAnchorEl(event.currentTarget)
            }
            sx={{
              color: "var(--color)",
            }}
          >
            <MoreHorizOutlinedIcon />
          </IconButton>
        )}

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
              maxHeight: ITEM_HEIGHT * 4,
              width: "18ch",
            },
          }}
        >
          {user && displayName === user.displayName && (
            <MenuItem onClick={handleClickOpen}> Delete </MenuItem>
          )}
          {user && displayName === user.displayName && (
            <MenuItem onClick={handleClickOpenCaption}> Edit </MenuItem>
          )}
          {postHasImages && (
            <MenuItem onClick={handleDownload}> Download </MenuItem>
          )}
          <MenuItem onClick={() => navigate(`/dummygram/user/${username}`)}>
            Visit Profile
          </MenuItem>
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
            <Button
              onClick={() =>
                deletePost(
                  user?.uid,
                  postId,
                  imageUrl,
                  enqueueSnackbar,
                  setOpen,
                )
              }
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PostHeader;
