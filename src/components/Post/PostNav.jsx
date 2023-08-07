import {
  ChatBubbleOutlineRounded,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import Flexbetween from "../../reusableComponents/Flexbetween";
import { savePost } from "../../js/postFn";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
  const [favoritePosts, setFavoritePosts] = useState(
    JSON.parse(localStorage.getItem("posts")) || [],
  );
  const navigate = useNavigate();
  const { isAnonymous } = user;

  const handleOnClick = async () => {
    if (isAnonymous) {
      navigate("/dummygram/signup");
    } else {
      try {
        const data = await savePost(postId);
        setFavoritePosts(data);
      } catch (error) {
        console.error("Error saving post:", error);
      }
    }
  };

  return (
    <Flexbetween gap={!fullScreen && "1.6rem"} sx={{ marginInline: "auto" }}>
      <Flexbetween
        sx={{ cursor: "pointer" }}
        onClick={() =>
          isAnonymous ? navigate("/dummygram/signup") : likesHandler()
        }
      >
        <IconButton>
          {tempLikeCount.indexOf(user?.uid) != -1 ? (
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
          isAnonymous ? navigate("/dummygram/signup") : setisCommentOpen(true);
        }}
      >
        <IconButton sx={{ padding: "2px" }}>
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
          if (isAnonymous) {
            navigate("/dummygram/signup");
          } else {
            setLink(`https://narayan954.github.io/dummygram/posts/${postId}`);
            setPostText(caption);
            shareModal(true);
          }
        }}
      >
        <IconButton>
          <ShareOutlined style={{ color: "var(--post-nav-icons)" }} />
        </IconButton>
        <Typography fontSize={14} className="post-nav-item">
          Share
        </Typography>
      </Flexbetween>

      <Flexbetween sx={{ cursor: "pointer" }} onClick={handleOnClick}>
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
