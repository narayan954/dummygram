import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { db } from "../lib/firebase";
import firebase from "firebase/compat/app";

function Post(prop) {
  const { username, caption, imageUrl, avatar, postId, user } = prop;
  const [comments, setComments] = React.useState([]);
  const [comment, setComment] = React.useState("");

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
            snapshot.docs.map((doc) => ({ id: doc.id, content: doc.data() })),
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src={avatar}
          sx={{ bgcolor: "Orange" }}
        />
        <h3 className="post__username">{username}</h3>
        <div className="social__icon__last">
          <MoreHorizOutlinedIcon />
        </div>
      </div>

      <div className="post__container">
        {imageUrl ? (
          <img className="post__img" src={imageUrl} alt="random sq" />
        ) : (
          <div className="post__background">{caption}</div>
        )}
        <div className="social__icons__wrapper">
          <div className="social__icon">
            <FavoriteBorderIcon />
          </div>
          <div className="social__icon">
            <ModeCommentOutlinedIcon />
          </div>
          <div className="social__icon">
            <SendOutlinedIcon />
          </div>
          <div className="social__icon__last">
            <BookmarkBorderOutlinedIcon />
          </div>
        </div>
        <div className="post__text">
          {caption && (
            <>
              <strong>{username} </strong>
              {caption}
            </>
          )}
        </div>

        <div className="post__comments">
          {comments.map((userComment) => (
            <p key={userComment.id}>
              <strong>{userComment.content.username}</strong>{" "}
              {userComment.content.text}
            </p>
          ))}
        </div>

        {user && (
          <form className="post__commentBox">
            <div className="social__icon">
              <SentimentSatisfiedAltOutlinedIcon />
            </div>
            <input
              className="post__input"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="post__button"
              disabled={!comment}
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;
