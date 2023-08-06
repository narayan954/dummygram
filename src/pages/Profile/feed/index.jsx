import "./index.css";

import { Box } from "@mui/material";
import ErrorBoundary from "../../../reusableComponents/ErrorBoundary";
import postBg from "../../../assets/postbg.webp";
import { useNavigate } from "react-router-dom";

const ProfieFeed = ({ feed }) => {
  const navigate = useNavigate();

  return (
    <Box className="profile-feed-main-container">
      <div className="app__posts__feed" id="feed-sub-container">
        <ErrorBoundary>
          {feed.map(({ post, id }) => (
            <div
              className="post_container"
              key={id}
              onClick={() => navigate(`/dummygram/posts/${id}`)}
            >
              {post.imageUrl == "" ? (
                <div className="post_sub_container">
                  <img
                    src={postBg}
                    alt={post.displayName}
                    className="post_image"
                  />
                  <p className="caption_without_image">{post.caption}</p>
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
            </div>
          ))}
        </ErrorBoundary>
      </div>
    </Box>
  );
};

export default ProfieFeed;
