import React, { useEffect } from "react";
import { Avatar, Grid } from "@mui/material";
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
            snapshot.docs.map((doc) => ({ id: doc.id, content: doc.data() }))
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

  const postImages = imageUrl.split(",");
  const computeGridSize = (imagesLength, imageIndex) => {
    if (imageIndex === imagesLength - 1 && (imageIndex + 1) % 2 !== 0) {
      return 12;
    }

    return 6;
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt={username} src={avatar} />
        <h3 className="post__username">{username}</h3>
      </div>

      <div className="post__container">
        <Grid container>
          {postImages.map((img, index) => (
            <Grid item key={img} xs={computeGridSize(postImages.length, index)}>
              <img className="post__img" src={img} alt="random sq" />
            </Grid>
          ))}
        </Grid>
        <h4 className="post__text">
          <strong>{username} </strong>
          {caption}
        </h4>

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
