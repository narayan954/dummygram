import "./index.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import {
  ChatBubbleOutlineRounded,
  FavoriteOutlined,
  FavoriteBorderOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { auth, db } from "../../../lib/firebase";

import ErrorBoundary from "../../../reusableComponents/ErrorBoundary";
import { ShareModal } from "../../../reusableComponents";

const userUid = auth?.currentUser?.uid;

const ProfieFeed = ({ feed }) => {
  return (
    <Box className="profile-feed-main-container">
      <div className="app__posts__feed" id="feed-sub-container">
        <ErrorBoundary>
          {feed.map(({ post, id }) => (
            <FeedPostDisplay post={post} id={id} />
          ))}
        </ErrorBoundary>
      </div>
    </Box>
  );
};

export default ProfieFeed;

function FeedPostDisplay({ post, id }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [tempLikeCount, setTempLikeCount] = useState(post.likecount || []);

  const isMobileScreen = useMediaQuery("(max-width: 600px)");
  const isTabScreen = useMediaQuery("(max-width: 950px)");
  const defaultBg = `linear-gradient(130deg, #dee2ed, #dee2ed, #9aa9d1, #b6c8e3, #b6afd0, #d3c0d8)`;

  async function likesHandler() {
    if (userUid && post.likecount !== undefined) {
      let ind = post.likecount.indexOf(userUid);
      const tempArr = tempLikeCount;

      if (ind !== -1) {
        tempArr.splice(ind, 1);
        setTempLikeCount(tempArr);
      } else {
        tempArr.push(userUid);
        setTempLikeCount(tempArr);
      }

      const data = {
        likecount: tempArr,
      };
      const docRef = doc(db, "posts", id);
      await updateDoc(docRef, data).catch((error) => {
        console.error("Error", error);
      });
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
      {post.imageUrl == "" ? (
        <div
          className="profile_post_sub_container"
          style={{ background: post.background ? post.background : defaultBg }}
        >
          {isMobileScreen ? (
            <p className="caption_without_image">
              {post.caption.length > 50
                ? post.caption.slice(0, 50) + "..."
                : post.caption}
            </p>
          ) : isTabScreen ? (
            <p className="caption_without_image">
              {post.caption.length > 110
                ? post.caption.slice(0, 110) + "..."
                : post.caption}
            </p>
          ) : (
            <p className="caption_without_image">{post.caption}</p>
          )}
        </div>
      ) : (
        <div className="post_sub_container" key={id}>
          <img
            src={JSON.parse(post.imageUrl)[0].imageUrl}
            alt={post.username}
            className="post_image"
          />
        </div>
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
            {tempLikeCount.indexOf(userUid) != -1 ? (
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
