import {
  ChatBubbleOutlineRounded,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { IconButton, Typography, Tooltip } from "@mui/material";
import React, { useState, lazy } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { DialogTitle } from "@mui/material";

import { DialogBox, ErrorBoundary, Flexbetween } from "../../reusableComponents";
import { ShareModal } from "../../reusableComponents";
import { savePost } from "../../js/postFn";
import { useNavigate } from "react-router-dom";


const CommentDialogBox = lazy(() => import("./CommentDialogBox"));
const LikesDialogBox = lazy(() => import("./LikesDialogBox"));

const PostNav = ({
  caption,
  postId,
  fullScreen,
  likesHandler,
  user,
  tempLikeCount,
  likeCount,
  likecount,
  commentCount,
  comments,
}) => {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [isCommentOpen, setisCommentOpen] = useState(false);
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [favoritePosts, setFavoritePosts] = useState(
    JSON.parse(localStorage.getItem("posts")) || [],
  );

  const navigate = useNavigate();
  const { isAnonymous } = user;

  const handleOnClick = async () => {
    if (isAnonymous) {
      navigate("/signup");
    } else {
      try {
        const data = await savePost(postId);
        setFavoritePosts(data);
      } catch (error) {
        console.error("Error saving post:", error);
      }
    }
  };

  const handleCommentClose = () => {
    setisCommentOpen(false);
  };

  return (
    <>
      <Flexbetween gap={!fullScreen && "4rem"} sx={{ marginInline: "auto" }}>

        {/* Like Icon */}

        <Flexbetween
          sx={{ cursor: "pointer" }}
        >
          <Tooltip title = {tempLikeCount.indexOf(user.uid) != -1 ? "Remove" : "Like"} arrow>
            <IconButton size="small" onClick={() => (isAnonymous ? navigate("/signup") : likesHandler())}>
              {tempLikeCount.indexOf(user?.uid) != -1 ? (
                <FavoriteOutlined
                  sx={{
                    color: "red"
                  }}
                />
              ) : (
                <FavoriteBorderOutlined
                  style={{ color: "var(--post-nav-icons)" }}
                />
              )}
            </IconButton>
          </Tooltip>
          <div onClick={() => setIsLikesOpen((prev) => !prev)}>
          <Tooltip title = "Stats" arrow>
            <Typography fontSize={14} className="post-nav-item">
              {likeCount}
            </Typography>
          </Tooltip>
          </div>
        </Flexbetween>

        {/* Comment Icon */}

        <Flexbetween
          sx={{ cursor: "pointer" }}
        >
        <Tooltip title = "Comment" arrow>

          <IconButton size="small" onClick={() => {
            isAnonymous ? navigate("/signup") : setisCommentOpen(true);
          }}>
            <ChatBubbleOutlineRounded
              style={{ color: "var(--post-nav-icons)" }}
            />
          </IconButton>
        </Tooltip>
        
          <div onClick={() => setisCommentOpen((prev) => !prev)}>
            <Tooltip title = "Stats" arrow>
            <Typography fontSize={14} className="post-nav-item">
              {commentCount}
            </Typography>
            </Tooltip>
          </div>
        </Flexbetween>

        {/* Share Icon */}

        <Flexbetween
          sx={{ cursor: "pointer" }}
          onClick={() => {
            if (isAnonymous) {
              navigate("/signup");
            } else {
              setOpenShareModal((prev) => !prev);
            }
          }}
        >
        <Tooltip title = "Share" arrow>
          <IconButton size="small">
            <ShareOutlined style={{ color: "var(--post-nav-icons)" }} />
          </IconButton>
        </Tooltip>
        </Flexbetween>

        {/* Save Icon */}

        <Flexbetween sx={{ cursor: "pointer" }} onClick={handleOnClick}>
        <Tooltip title=  {favoritePosts.indexOf(postId) !== -1? "Remove" : "Bookmark"} arrow>
          <IconButton size="small">
            {favoritePosts.indexOf(postId) !== -1 ? (
              <BookmarksIcon sx={{ color: "green" }} />
            ) : (
              <BookmarkBorderIcon style={{ color: "var(--post-nav-icons)" }} />
            )}
          </IconButton>
        </Tooltip>
        </Flexbetween>
      </Flexbetween>

      {openShareModal && (
        <ShareModal
          openShareModal={openShareModal}
          setOpenShareModal={setOpenShareModal}
          currentPostLink={`https://narayan954.github.io/dummygram/posts/${postId}`}
          postText={caption}
        />
      )}

      {user &&
        /* Comments dialog box */
        <div>

          <DialogBox
            open={isCommentOpen}
            onClose={handleCommentClose}
            showTitle={false}
          >
            <DialogTitle style={{ padding: 0, color: "var(--color)" }}>
              Comments
              <span
                className="comment-box-title-style"
                style={{ "--clr": "red" }}
              ></span>
              <span
                className="comment-box-title-style"
                style={{ "--clr": "green" }}
              ></span>
              <span
                className="comment-box-title-style"
                style={{ "--clr": "blue" }}
              ></span>
            </DialogTitle>
            <hr />
            <ErrorBoundary>
              <CommentDialogBox
                postId={postId}
                comments={comments}
                user={user}
                fullScreen={fullScreen}
              />
            </ErrorBoundary>
          </DialogBox>

          {/*Likes Dialog Box */}

          <DialogBox
            open={isLikesOpen}
            onClose={() => setIsLikesOpen(false)}
            title="Likes ❤"
          >
            {likeCount === 0 ? (
              <p style={{ textAlign: "center" }}>No likes!!</p>
            ) : (
              <LikesDialogBox likecountArr={likecount} />
            )}
          </DialogBox>
        </div>
      }
    </>
  );
};

export default PostNav;
