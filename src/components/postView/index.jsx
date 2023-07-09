import {
  Avatar,
  ClickAwayListener,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  CommentForm,
  CommentItem,
  PostCaption,
  PostContentText,
  PostGridItem,
  PostGridItemContainer,
  PostHeader,
  PostViewGrid,
} from "../../pages/PostView/PostViewStyled.jsx";
import React, { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";

import Caption from "../Post/Caption.jsx";
import EmojiPicker from "emoji-picker-react";
import ErrorBoundary from "../../reusableComponents/ErrorBoundary";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import { db } from "../../lib/firebase.js";
import firebase from "firebase/compat/app";
import useCreatedAt from "../../hooks/useCreatedAt.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const PostDetails = React.lazy(() => import("./PostDetails.jsx"));
const PostViewComments = React.lazy(() => import("./PostViewComments.jsx"));
const PostViewMenu = React.lazy(() => import("./PostViewMenu.jsx"));
const ImageSlider = React.lazy(() =>
  import("../../reusableComponents/ImageSlider"),
);
const ReadMore = React.lazy(() => import("../ReadMore"));
const PostCommentView = ({
  setFetchAgain,
  shareModal,
  fetchAgain,
  postId,
  user,
  post,
  setLink,
  setPostText,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { username, caption, imageUrl, avatar, likecount, timestamp, email } =
    post;
  const time = useCreatedAt(timestamp);

  const [comments, setComments] = React.useState(null);
  const [likesNo, setLikesNo] = React.useState(
    likecount ? likecount.length : 0,
  );
  const tempLikeCount = likecount ? [...likecount] : [];
  const [showEmojis, setShowEmojis] = React.useState(false);
  const commentRef = React.useRef(null);
  const docRef = doc(db, "posts", postId);

  async function likesHandler() {
    if (user && likecount !== undefined) {
      let ind = tempLikeCount.indexOf(user.uid);

      if (ind !== -1) {
        tempLikeCount.splice(ind, 1);
        setLikesNo((currLikesNo) => currLikesNo - 1);
      } else {
        tempLikeCount.push(user.uid);
        setLikesNo((currLikesNo) => currLikesNo + 1);
      }

      const data = {
        likecount: tempLikeCount,
      };
      await updateDoc(docRef, data)
        .then(() => setFetchAgain(!fetchAgain))

        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  }

  const postComment = (event) => {
    event.preventDefault();
    const commentValue = commentRef?.current?.value;
    if (commentValue) {
      db.collection("posts").doc(postId).collection("comments").add({
        text: commentValue,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      commentRef.current.value = "";
    }
  };

  useEffect(() => {
    setFetchAgain(!fetchAgain);
  }, []);

  useEffect(() => {
    let unsubscribe;

    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              content: doc.data(),
            })),
          );
        });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [postId]);

  /**
   * @type {{
   *     imageUrl: null|string,
   *     imageWidth: number,
   *     imageHeight: number,
   *     thumbnail: null | string
   * }[]}
   *
   */
  let postImages;

  try {
    postImages = JSON.parse(imageUrl);
  } catch {
    postImages = imageUrl.split(",").map((url) => ({
      imageUrl: url,
      imageWidth: 0,
      imageHeight: 0,
      thumbnail: null,
    }));
  }

  const postHasImages = postImages.some((image) => Boolean(image.imageUrl));
  const onEmojiClick = (emojiObject, event) => {
    if (commentRef && commentRef.current) {
      const commentValue = commentRef.current.value || "";
      commentRef.current.value = commentValue + emojiObject.emoji;
    }
    setShowEmojis(false);
  };

  return (
    <PostViewGrid container>
      <PostGridItemContainer item xs={12} sm={6}>
        <PostGridItem
          postHasImages={postHasImages}
          textPost={!postHasImages && caption}
        >
          {postHasImages ? (
            <ErrorBoundary>
              <ImageSlider
                slides={postImages}
                isCommentBox={true}
                doubleClickHandler={likesHandler}
              />
            </ErrorBoundary>
          ) : (
            <PostContentText>
              {caption.length >= 300 ? (
                <Typography variant="body3" color="text.secondary">
                  <ErrorBoundary>
                    <ReadMore picCap readMore={false}>
                      {caption}
                    </ReadMore>
                  </ErrorBoundary>
                </Typography>
              ) : (
                <Typography variant="h5" color="text.secondary">
                  <Caption caption={caption} />
                </Typography>
              )}
            </PostContentText>
          )}
        </PostGridItem>
      </PostGridItemContainer>
      <PostGridItemContainer
        item
        xs={12}
        sm={6}
        style={{ display: "flex", flexDirection: "column" }}
        isDetails={true}
      >

        <PostGridItem isHeader={true}>
          <ErrorBoundary>
            <PostHeader
              avatar={
                <Avatar
                  // className="post__avatar"
                  alt={username}
                  src={avatar}
                  sx={{
                    bgcolor: "royalblue",
                    border: "2px solid transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 17px 0px",
                      border: "2px solid black",
                      scale: "1.1",
                    },
                  }}
                  onClick={() => {
                    navigate("/dummygram/profile", {
                      state: {
                        name: username,
                        avatar: avatar,
                        email: email,
                      },
                    });
                  }}
                />
              }
              action={
                <PostViewMenu
                  postHasImages={postHasImages}
                  user={user}
                  username={username}
                  avatar={avatar}
                  caption={caption}
                  postId={postId}
                  setFetchAgain={setFetchAgain}
                  fetchAgain={fetchAgain}
                  imageUrl={imageUrl}
                  fullScreen={fullScreen}
                />
              }
              title={username}
              subheader={time}
            />
          </ErrorBoundary>
          {/* caption box */}
          {postHasImages && caption ? (
            <ErrorBoundary>
              <PostCaption>
                <Typography variant="body2" color="text.secondary">
                  <ReadMore readMore={false}>{caption}</ReadMore>
                </Typography>
              </PostCaption>
            </ErrorBoundary>
          ) : null}
        </PostGridItem>

        {/* post/ like ...  box */}
        <PostGridItem postActions>
          <ErrorBoundary>
            <PostDetails
              user={user}
              postId={postId}
              likecount={likecount}
              likesHandler={likesHandler}
              fullScreen={fullScreen}
              caption={caption}
              shareModal={shareModal}
              setLink={setLink}
              setPostText={setPostText}
              setFetchAgain={setFetchAgain}
              fetchAgain={fetchAgain}
            />
          </ErrorBoundary>
        </PostGridItem>


        {/* Comment box  */}
        <PostGridItem isComments={comments?.length > 0}>
          <CommentForm>
            <ClickAwayListener onClickAway={() => setShowEmojis(false)}>
              <div className="social__icon">
                <div className="emoji__icon">
                  <SentimentSatisfiedAltOutlinedIcon
                    onClick={() => {
                      setShowEmojis((val) => !val);
                    }}
                  />
                </div>
                {showEmojis && (
                  <div id="picker">
                    <EmojiPicker
                      emojiStyle="native"
                      height={330}
                      searchDisabled
                      style={{ zIndex: 999 }}
                      onEmojiClick={onEmojiClick}
                      previewConfig={{
                        showPreview: false,
                      }}
                    />
                  </div>
                )}
              </div>
            </ClickAwayListener>
            <input
              className="post__input"
              type="text"
              placeholder={
                comments?.length !== 0
                  ? "Add a comment..."
                  : "Be the first one to comment ..."
              }
              ref={commentRef}
              style={{
                color: "var(--color)",
                borderRadius: "16px",
                margin: "4px 0px",
              }}
            />
            <button
              className="post__button"
              disabled={commentRef?.current?.value === null}
              type="submit"
              onClick={postComment}
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Post
            </button>
          </CommentForm>
          <ErrorBoundary>
            {comments?.length ? (
              <>
                {comments.map((userComment) => (
                  <CommentItem key={userComment.id}>
                    <div className={"post_comment_details"}>
                      <span>{userComment.content.username}</span>
                      <ReadMore readMore={false}>
                        {userComment.content.text}
                      </ReadMore>
                    </div>
                    <div className={"post_comment_actions"}>
                      <PostViewComments
                        fullScreen={fullScreen}
                        postId={postId}
                        user={user}
                        userComment={userComment}
                      />
                    </div>
                  </CommentItem>
                ))}
              </>
            ) : (
              <>
                <CommentItem empty={true}>
                  <Typography variant="body2" color="text.secondary">
                    No Comments to Show!!
                  </Typography>
                </CommentItem>
              </>
            )}
          </ErrorBoundary>
        </PostGridItem>
        {/*<div style={{flexGrow: 1}}/>*/}
      </PostGridItemContainer>
    </PostViewGrid>
  );
};
export default PostCommentView;
