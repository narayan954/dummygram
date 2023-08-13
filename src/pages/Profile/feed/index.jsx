import "./index.css";

import { Box, useMediaQuery } from "@mui/material";
import {
  ChatBubbleOutlineRounded,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

import ErrorBoundary from "../../../reusableComponents/ErrorBoundary";
import { ShareModal } from "../../../reusableComponents";
import { useState } from "react";

const MAX_CAPTION_MOBILE = 50;
const MAX_CAPTION_TAB = 110;
const DEFAULTBG = `linear-gradient(130deg, #dee2ed, #dee2ed, #9aa9d1, #b6c8e3, #b6afd0, #d3c0d8)`;

function Caption({ text, maxLength }) {
  return (
    <p className="caption_without_image">
      {text.length > maxLength ? text.slice(0, maxLength) + "..." : text}
    </p>
  );
}

function PostWithoutImage({ post, maxLength }) {
  return (
    <div
      className="profile_post_sub_container"
      style={{ background: post.background || DEFAULTBG }}
    >
      <Caption text={post.caption} maxLength={maxLength} />
    </div>
  );
}

function PostWithImage({ imageUrl, username }) {
  return (
    <div className="post_sub_container">
      <img
        src={JSON.parse(imageUrl)[0].imageUrl}
        alt={username}
        className="post_image"
      />
    </div>
  );
}
function FeedPostDisplay({ post, id }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [tempLikeCount, setTempLikeCount] = useState(post.likecount || []);
  const userUid = auth?.currentUser?.uid;

  const isMobileScreen = useMediaQuery("(max-width: 600px)");
  const isTabScreen = useMediaQuery("(max-width: 950px)");

  async function likesHandler() {
    if (userUid && post.likecount !== undefined) {
      const ind = post.likecount.indexOf(userUid);
      const tempArr = [...tempLikeCount];

      if (ind !== -1) {
        tempArr.splice(ind, 1);
      } else {
        tempArr.push(userUid);
      }

      setTempLikeCount(tempArr);

      const data = {
        likecount: tempArr,
      };
      const docRef = doc(db, "posts", id);
      try {
        await updateDoc(docRef, data);
      } catch (error) {
        console.error("Error", error);
      }
    }
  }

  return (
    <div
      className="post_container"
      key={id}
      onClick={() => navigate(`/dummygram/posts/${id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {post.imageUrl === "" ? (
        <PostWithoutImage
          post={post}
          maxLength={
            isMobileScreen
              ? MAX_CAPTION_MOBILE
              : isTabScreen
              ? MAX_CAPTION_TAB
              : undefined
          }
        />
      ) : (
        <PostWithImage imageUrl={post.imageUrl} username={post.username} />
      )}

      {hover && (
        <div className="profile_post_hover_container">
          <button
            className="profile_post_hover_icon"
            onClick={(e) => {
              e.stopPropagation();
              likesHandler();
            }}
          >
            {tempLikeCount.includes(userUid) ? (
              <FavoriteOutlined sx={{ color: "red" }} />
            ) : (
              <FavoriteBorderOutlined
                style={{ color: "var(--post-nav-icons)" }}
              />
            )}
          </button>
          <Link
            to={`/dummygram/posts/${id}`}
            style={{ color: "white" }}
            className="profile_post_hover_icon"
          >
            <ChatBubbleOutlineRounded />
          </Link>
          <button
            className="profile_post_hover_icon"
            onClick={(e) => {
              e.stopPropagation();
              setOpenShareModal((prev) => !prev);
            }}
          >
            <ShareOutlined />
          </button>
        </div>
      )}

      {openShareModal && (
        <ShareModal
          openShareModal={openShareModal}
          setOpenShareModal={setOpenShareModal}
          currentPostLink={`https://narayan954.github.io/dummygram/posts/${id}`}
          postText={post.caption}
        />
      )}
    </div>
  );
}

const ProfileFeed = ({ feed }) => {
  return (
    <Box className="profile-feed-main-container">
      <div className="app__posts__feed" id="feed-sub-container">
        <ErrorBoundary>
          {feed.map(({ post, id }) => (
            <FeedPostDisplay post={post} id={id} key={id} />
          ))}
        </ErrorBoundary>
      </div>
    </Box>
  );
};

export default ProfileFeed;
