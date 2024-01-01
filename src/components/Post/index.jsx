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
  Stack,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { auth, db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { lazy, useEffect, useState } from "react";

import firebase from "firebase/compat/app";
import getUserSessionData from "../../js/userData";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";

const PostHeader = lazy(() => import("./PostHeader"));
const CommentBox = lazy(() => import("./CommentBox"));

const ImgBox = lazy(() => import("./ImgBox"));
const PostNav = lazy(() => import("./PostNav"));

function Post(prop) {
  const { postId, user, post, rowMode } = prop;
  const { caption, imageUrl, likecount, timestamp, background } = post;

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likesNo, setLikesNo] = useState(likecount ? likecount.length : 0);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showCommentEmojis, setShowCommentEmojis] = useState(false);
  const [username, setUsername] = useState("");

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const docRef = doc(db, "posts", postId);

  useEffect(() => {
    async function getUsername() {
      const data = await getUserSessionData();
      setUsername(data.username);
    }
    if (auth?.currentUser?.isAnonymous) {
      setUsername("guest");
    } else {
      getUsername();
    }
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

  const postComment = (event) => {
    event.preventDefault();
    try {
      db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: username,
        displayName: auth?.currentUser?.displayName,
        avatar: auth?.currentUser?.photoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setComment("");
    }
  };

  const onEmojiClick = (emojiObject, event) => {
    setComment((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojis(false);
    setShowCommentEmojis(false);
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


  return (
    <div className={`${rowMode ? "post" : "postColumn"}`}>
      <ErrorBoundary>
        <PostHeader
          user={user}
          postData={post}
          postHasImages={postHasImages}
          postId={postId}
          timestamp={timestamp}
        />
      </ErrorBoundary>

      <div className="post__container">
        <ErrorBoundary>
          <ImgBox
            postHasImages={postHasImages}
            postImages={postImages}
            postId={postId}
            likesHandler={likesHandler}
            caption={caption}
            background={background}
          />
        </ErrorBoundary>
        {/* <Flexbetween>
          <Typography
            marginLeft={1.5}
            fontSize={13}
            padding={1}
            sx={{ color: "grey", cursor: "pointer", visibility: likesNo === 0 ? "hidden" : "visible" }}
            onClick={() => setIsLikesOpen((prev) => !prev)}
          >
            <Flexbetween gap={0.5} >
              <span>
                <ThumbUpIcon sx={{ fontSize: "18px" }} />
              </span>
              <span>
                {likesNo}
              </span>
            </Flexbetween>
          </Typography>
  
          <Typography
            sx={{ color: "grey", cursor: "pointer", visibility: comments.length === 0 ? "hidden" : "visible" }}
            fontSize={13}
            p = {1}
            onClick={() => setisCommentOpen((prev) => !prev)}
          >
            {comments.length} {comments.length > 1 ? "comments" : "comment"}
          </Typography>
        </Flexbetween> */}
        <Divider variant="middle" sx={{backgroundColor: "var(--divider-color)"}}/>

        {user && (
          <div className="post__commentBox">
            <ErrorBoundary>
              <PostNav
                fullScreen={fullScreen}
                likesHandler={likesHandler}
                user={user}
                tempLikeCount={tempLikeCount}
                comments = {comments}  
                postId={postId}
                caption={caption}
                likeCount={likesNo}
                commentCount={comments.length}
                likecount={likecount}
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

            {/* Comments dialog box
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
              <ErrorBoundary>
                <CommentBox
                  setShowEmojis={setShowCommentEmojis}
                  showEmojis={showCommentEmojis}
                  onEmojiClick={onEmojiClick}
                  comment={comment}
                  setComment={setComment}
                  postComment={postComment}
                  user={user}
                />
              </ErrorBoundary>
            </DialogBox> */}

            {/* Likes Dialog Box */}
            {/* <DialogBox
              open={isLikesOpen}
              onClose={() => setIsLikesOpen(false)}
              title="Likes ❤"
            >
              {likesNo === 0 ? (
                <p style={{ textAlign: "center" }}>No likes!!</p>
              ) : (
                <LikesDialogBox likecountArr={likecount} />
              )}
            </DialogBox> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
