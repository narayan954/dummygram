import "react-lazy-load-image-component/src/effects/blur.css";
import "./index.css";

import {
  DialogBox,
  ErrorBoundary,
  Flexbetween,
} from "../../reusableComponents";
import {
  DialogTitle,
  Divider,
  Paper,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { lazy, useEffect, useState } from "react";

import { db } from "../../lib/firebase";
import firebase from "firebase/compat/app";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";

const PostHeader = lazy(() => import("./PostHeader"));
const CommentBox = lazy(() => import("./CommentBox"));
const CommentDialogBox = lazy(() => import("./CommentDialogBox"));
const ImgBox = lazy(() => import("./ImgBox"));
const PostNav = lazy(() => import("./PostNav"));

function Post(prop) {
  const { postId, user, post, shareModal, setLink, setPostText, rowMode } =
    prop;
  const { caption, imageUrl, likecount, timestamp } = post;

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likesNo, setLikesNo] = useState(likecount ? likecount.length : 0);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isCommentOpen, setisCommentOpen] = useState(false);
  const [deleteCommentID, setDeleteCommentID] = useState("");
  const [openToDeleteComment, setOpenToDeleteComment] = useState(false);

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const docRef = doc(db, "posts", postId);
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
            }))
          );
        });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [postId]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#FFF",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const postComment = (event) => {
    event.preventDefault();
    try {
      db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.uid, // TODO  must be username
        displayName: user.displayName,
        avatar: user.photoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setComment("");
    }
  };

  const deleteComment = async (event, commentRef) => {
    event.preventDefault();
    await db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentRef.id)
      .delete();
  };

  const onEmojiClick = (emojiObject, event) => {
    setComment((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojis(false);
  };

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

  const tempLikeCount = likecount ? [...likecount] : [];

  const buttonStyle = {
    ":hover": {
      color: "#FF4D4D",
      fontSize: "29px",
    },
  };

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
        // .then((docRef) => {
        //   console.log("like added");
        // })
        .catch((error) => {
          enqueueSnackbar(error, {
            variant: "error",
          });
        });
    }
  }

  const handleCommentClose = () => {
    setisCommentOpen(false);
  };

  const handleCloseForDeleteComment = () => {
    setOpenToDeleteComment(false);
  };

  return (
    <div
      className={`${rowMode ? "post" : "postColumn"}`}
      style={{
        boxShadow: "#fff 0px 3px 6px, #0cc 0px 3px 6px",
      }}
    >
      <ErrorBoundary>
        <PostHeader
          user={user}
          postData={post}
          postHasImages={postHasImages}
          postId={postId}
          timestamp={timestamp}
        />
      </ErrorBoundary>
      <Divider />
      <div className="post__container">
        <ErrorBoundary>
          <ImgBox
            postHasImages={postHasImages}
            postImages={postImages}
            postId={postId}
            likesHandler={likesHandler}
            caption={caption}
          />
        </ErrorBoundary>
        <Divider />
        <Flexbetween>
          <Typography
            marginLeft={1}
            fontSize={13}
            padding={1}
            sx={{ color: "grey" }}
          >
            {likesNo} {likesNo > 1 ? "Likes" : "Like"}
          </Typography>
          <Typography
            sx={{ color: "grey", cursor: "pointer" }}
            fontSize={13}
            paddingRight={1}
            onClick={() => setisCommentOpen((prev) => !prev)}
          >
            {comments.length} {comments.length > 1 ? "comments" : "comment"}
          </Typography>
        </Flexbetween>

        {user && (
          <div className="post__commentBox">
            <ErrorBoundary>
              <PostNav
                fullScreen={fullScreen}
                likesHandler={likesHandler}
                user={user}
                tempLikeCount={tempLikeCount}
                setisCommentOpen={setisCommentOpen}
                setLink={setLink}
                postId={postId}
                setPostText={setPostText}
                shareModal={shareModal}
                caption={caption}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <CommentBox
                setShowEmojis={setShowEmojis}
                showEmojis={showEmojis}
                onEmojiClick={onEmojiClick}
                comment={comment}
                setComment={setComment}
                postComment={postComment}
                user={user}
              />
            </ErrorBoundary>
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
                  Item={Item}
                  postHasImages={postHasImages}
                  postImages={postImages}
                  caption={caption}
                  comments={comments}
                  setOpenToDeleteComment={setOpenToDeleteComment}
                  openToDeleteComment={openToDeleteComment}
                  setDeleteCommentID={setDeleteCommentID}
                  user={user}
                  fullScreen={fullScreen}
                  handleCloseForDeleteComment={handleCloseForDeleteComment}
                  deleteComment={deleteComment}
                  deleteCommentID={deleteCommentID}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <CommentBox
                  setShowEmojis={setShowEmojis}
                  showEmojis={showEmojis}
                  onEmojiClick={onEmojiClick}
                  comment={comment}
                  setComment={setComment}
                  postComment={postComment}
                  user={user}
                />
              </ErrorBoundary>
            </DialogBox>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
