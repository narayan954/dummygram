import {
  ChatBubbleOutlineRounded,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import React, { useState } from "react";

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

  const save = async () => {
    let localStoragePosts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIdExists = localStoragePosts.includes(postId);

    if (!postIdExists) {
      localStoragePosts.push(postId);
      localStorage.setItem("posts", JSON.stringify(localStoragePosts));
      enqueueSnackbar("Post added to favourites!", {
        variant: "success",
      });
    } else {
      localStoragePosts = localStoragePosts.filter((post) => post !== postId);
      localStorage.setItem("posts", JSON.stringify(localStoragePosts));
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
    <Flexbetween gap={!fullScreen && "1.6rem"}>
      <Flexbetween sx={{ cursor: "pointer" }} onClick={likesHandler}>
        <IconButton>
          {tempLikeCount.indexOf(user.uid) != -1 ? (
            <FavoriteOutlined sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderOutlined />
          )}
        </IconButton>
        <Typography fontSize={14}>Like</Typography>
      </Flexbetween>

      <Flexbetween
        sx={{ cursor: "pointer" }}
        onClick={() => {
          setisCommentOpen(!Open);
        }}
      >
        <IconButton>
          <ChatBubbleOutlineRounded />
        </IconButton>
        <Typography fontSize={14}>Comment</Typography>
      </Flexbetween>

      <Flexbetween
        sx={{ cursor: "pointer" }}
        onClick={() => {
          setLink(`https://narayan954.github.io/dummygram/${postId}`);
          setPostText(caption);
          shareModal(true);
        }}
      >
        <IconButton>
          <ShareOutlined />
        </IconButton>
        <Typography fontSize={14}>Share</Typography>
      </Flexbetween>

      <Flexbetween sx={{ cursor: "pointer" }} onClick={save}>
        <IconButton>
          {favoritePosts.indexOf(postId) !== -1 ? (
            <BookmarksIcon sx={{ color: "green" }} />
          ) : (
            <BookmarkBorderIcon />
          )}
        </IconButton>
        <Typography fontSize={14}>Save</Typography>
      </Flexbetween>
    </Flexbetween>
  );
};

export default PostNav;
