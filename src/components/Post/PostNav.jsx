import {
  ChatBubbleOutlineRounded,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { errorSound, successSound } from "../../assets/sounds";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import Flexbetween from "../../reusableComponents/Flexbetween";
import { useSnackbar } from "notistack";

const PostNav = ({
  caption,
  postId,
  fullScreen,
  likesHandler,
  user,
  tempLikeCount,
  setisCommentOpen,
  setLink,
  setPostText,
  shareModal,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [Open, setOpen] = useState(false);
  const [favoritePosts, setFavoritePosts] = useState(
    JSON.parse(localStorage.getItem("posts")) || []
  );
  const [isSaved, setisSaved] = useState(false);

  function playSuccessSound() {
    new Audio(successSound).play();
  }

  function playErrorSound() {
    new Audio(errorSound).play();
  }

  const save = async () => {
    let localStoragePosts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIdExists = localStoragePosts.includes(postId);

    if (!postIdExists) {
      localStoragePosts.push(postId);
      localStorage.setItem("posts", JSON.stringify(localStoragePosts));
      playSuccessSound();
      enqueueSnackbar("Post added to favourites!", {
        variant: "success",
      });
    } else {
      localStoragePosts = localStoragePosts.filter((post) => post !== postId);
      localStorage.setItem("posts", JSON.stringify(localStoragePosts));
      playSuccessSound();
      enqueueSnackbar("Post is removed from favourites!", {
        variant: "info",
      });
    }
    setFavoritePosts(JSON.parse(localStorage.getItem("posts")));
  };

  const handleToggleFavorite = () => {
    setisSaved(!isSaved);
  };

  const renderFavoriteIcon = () => {
    if (isSaved) {
      return <BookmarksIcon onClick={handleToggleFavorite} />;
    } else {
      return <BookmarkBorderIcon onClick={handleToggleFavorite} />;
    }
  };

  return (
    <Flexbetween gap={!fullScreen && "1.6rem"} sx={{marginInline: 'auto'}}>
      <Flexbetween sx={{ cursor: "pointer" }} onClick={likesHandler}>
        <IconButton>
          {tempLikeCount.indexOf(user.uid) != -1 ? (
            <FavoriteOutlined
              sx={{
                color: "red",
              }}
            />
          ) : (
            <FavoriteBorderOutlined
              style={{ color: "var(--post-nav-icons)" }}
            />
          )}
        </IconButton>
        <Typography fontSize={14} className="post-nav-item">
          Like
        </Typography>
      </Flexbetween>

      <Flexbetween
        sx={{ cursor: "pointer" }}
        onClick={() => {
          setisCommentOpen(!Open);
        }}
      >
        <IconButton sx={{padding:"2px"}}>
          <ChatBubbleOutlineRounded
            style={{ color: "var(--post-nav-icons)" }}
          />
        </IconButton>
        <Typography fontSize={14} className="post-nav-item">
          Comment
        </Typography>
      </Flexbetween>

      <Flexbetween
        sx={{ cursor: "pointer" }}
        onClick={() => {
          setLink(`https://narayan954.github.io/dummygram/posts/${postId}`);
          setPostText(caption);
          shareModal(true);
        }}
      >
        <IconButton>
          <ShareOutlined style={{ color: "var(--post-nav-icons)" }} />
        </IconButton>
        <Typography fontSize={14} className="post-nav-item">
          Share
        </Typography>
      </Flexbetween>

      <Flexbetween sx={{ cursor: "pointer" }} onClick={save}>
        <IconButton>
          {favoritePosts.indexOf(postId) !== -1 ? (
            <BookmarksIcon sx={{ color: "green" }} />
          ) : (
            <BookmarkBorderIcon style={{ color: "var(--post-nav-icons)" }} />
          )}
        </IconButton>
        <Typography fontSize={14} className="post-nav-item">
          Save
        </Typography>
      </Flexbetween>
    </Flexbetween>
  );
};

export default PostNav;
