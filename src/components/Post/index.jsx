import "react-lazy-load-image-component/src/effects/blur.css";
import "./index.css";

import { DialogBox, Flexbetween } from "../../reusableComponents";
import {
  Divider,
  Paper,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import CommentBox from "./CommentBox";
import CommentDialogBox from "./CommentDialogBox";
import CommentHolder from "./CommentHolder";
import ImgBox from "./ImgBox";
import PostHeader from "./PostHeader";
import PostNav from "./PostNav";
import { db } from "../../lib/firebase";
import firebase from "firebase/compat/app";
import { useTheme } from "@mui/material/styles";

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
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
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

      // console.log(tempLikeCount);
      const data = {
        likecount: tempLikeCount,
      };
      await updateDoc(docRef, data)
        // .then((docRef) => {
        //   console.log("like added");
        // })
        .catch((error) => {
          // console.log(error);
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
      style={{ boxShadow: "0px 0px 5px 1px rgba(0, 0, 0, 0.4)" }}
    >
      <PostHeader
        user={user}
        postData={post}
        postHasImages={postHasImages}
        postId={postId}
      />
      <div className="post__container">
        <ImgBox
          postHasImages={postHasImages}
          postImages={postImages}
          likesHandler={likesHandler}
          caption={caption}
        />

        <Divider />
        <Flexbetween>
          <Typography marginLeft={1} fontSize={13} sx={{ color: "skyblue" }}>
            {likesNo} {likesNo > 1 ? "Likes" : "Like"}
          </Typography>
          <Typography sx={{ color: "skyblue" }} fontSize={13}>
            {comments.length} {comments.length > 1 ? "comments" : "comment"}
          </Typography>
        </Flexbetween>
        <Divider />

        {user && (
          <form className="post__commentBox">
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

            <CommentHolder
              showEmojis={showEmojis}
              setShowEmojis={setShowEmojis}
              onEmojiClick={onEmojiClick}
              comments={comments}
              comment={comment}
              setComment={setComment}
              postComment={postComment}
            />

            <DialogBox
              open={isCommentOpen}
              onClose={handleCommentClose}
              title="All Comments"
            >
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
              <CommentBox
                setShowEmojis={setShowEmojis}
                showEmojis={showEmojis}
                onEmojiClick={onEmojiClick}
                comment={comment}
                setComment={setComment}
                postComment={postComment}
                user={user}
              />
            </DialogBox>
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;
