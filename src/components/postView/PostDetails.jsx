import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

import Flexbetween from "../../reusableComponents/Flexbetween.jsx";
import React from "react";

const PostDetails = ({
  user,
  postId,
  likecount,
  likesHandler,
  setFetchAgain,
  fetchAgain,
  shareModal,
  setPostText,
  setLink,
  caption,
  fullScreen,
}) => {
  const tempLikeCount = likecount ? [...likecount] : [];
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

        {/*<Flexbetween*/}
        {/*    sx={{cursor: "pointer"}}*/}
        {/*    // onClick={}*/}
        {/*>*/}
        {/*    <IconButton>*/}
        {/*        <ChatBubbleOutlineRounded/>*/}
        {/*    </IconButton>*/}
        {/*    <Typography fontSize={14}>Comment</Typography>*/}
        {/*</Flexbetween>*/}

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
          <Typography fontSize={14}>Share</Typography>
        </Flexbetween>
      </Flexbetween>
    </>
  );
};

export default PostDetails;
