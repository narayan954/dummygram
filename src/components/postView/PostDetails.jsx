import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import DeleteIcon from "@mui/icons-material/Delete";
import Flexbetween from "../../reusableComponents/Flexbetween";
import { ShareModal } from "../../reusableComponents";
import deletePost from "../../js/postFn.js";
import { savePost } from "../../js/postFn.js";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useState } from "react";

const PostDetails = ({
  user,
  postId,
  postUserUid,
  likecount,
  likesHandler,
  imageUrl,
  caption,
  fullScreen,
}) => {
  const [open, setOpen] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [favoritePosts, setFavoritePosts] = useState(
    JSON.parse(localStorage.getItem("posts")) || [],
  );
  const tempLikeCount = likecount ? [...likecount] : [];
  const { enqueueSnackbar } = useSnackbar();
  const currentUserUid = user.uid;
  const navigate = useNavigate();

  return (
    <>
      {" "}
      <Flexbetween gap={!fullScreen && "1.6rem"}>
        <Flexbetween sx={{ cursor: "pointer" }} onClick={likesHandler}>
          <IconButton>
            {tempLikeCount.indexOf(user?.uid) !== -1 ? (
              <FavoriteOutlined sx={{ color: "red" }} />
            ) : (
              <FavoriteBorderOutlined
                style={{ color: "var(--post-nav-icons)" }}
              />
            )}
          </IconButton>
          <Typography fontSize={14}>
            {likecount?.length} {likecount.length > 1 ? "likes" : "like"}
          </Typography>
        </Flexbetween>

        <Flexbetween
          sx={{ cursor: "pointer" }}
          onClick={() => {
            setOpenShareModal((prev) => !prev);
          }}
        >
          <IconButton>
            <ShareOutlined style={{ color: "var(--post-nav-icons)" }} />
          </IconButton>
          <Typography fontSize={14}>Share</Typography>
        </Flexbetween>

        <Flexbetween
          sx={{ cursor: "pointer" }}
          onClick={async () => {
            const data = await savePost(postId);
            setFavoritePosts(data);
          }}
        >
          <IconButton>
            {favoritePosts.indexOf(postId) !== -1 ? (
              <BookmarksIcon sx={{ color: "green" }} />
            ) : (
              <BookmarkBorderIcon style={{ color: "var(--post-nav-icons)" }} />
            )}
          </IconButton>
          <Typography fontSize={14}>Save</Typography>
        </Flexbetween>

        {currentUserUid === postUserUid && (
          <Flexbetween
            sx={{ cursor: "pointer" }}
            onClick={() => setOpen((prev) => !prev)}
          >
            <IconButton>
              <DeleteIcon />
            </IconButton>
            <Typography fontSize={14}>Delete</Typography>
          </Flexbetween>
        )}
      </Flexbetween>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Delete Post?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              await deletePost(
                postUserUid,
                postId,
                imageUrl,
                enqueueSnackbar,
                setOpen,
              );
              navigate("/dummygram");
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {openShareModal && (
        <ShareModal
          openShareModal={openShareModal}
          setOpenShareModal={setOpenShareModal}
          currentPostLink={`https://narayan954.github.io/dummygram/posts/${postId}`}
          postText={caption}
        />
      )}
    </>
  );
};

export default PostDetails;
