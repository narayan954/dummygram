import React, { useEffect } from "react";
import { Avatar, Grid } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { db } from "../lib/firebase";
import firebase from "firebase/compat/app";

import {  doc, updateDoc } from "firebase/firestore";

function Post(prop) { 
  const {  postId, user ,post} = prop;
  const { username, caption, imageUrl, avatar, likecount} = post;
  const [comments, setComments] = React.useState([]);
  const [comment, setComment] = React.useState("");
  const [likesno, setLikesno] = React.useState( likecount ? likecount.length : 0);
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

  /** @type {string[]} */
  const postImages = imageUrl.split(",");
  const computeGridSize = (imagesLength, imageIndex) => {
    if (imageIndex === imagesLength - 1 && (imageIndex + 1) % 2 !== 0) {
      return 12;
    }

    return 6;
  };
  const postHasImages = postImages.some((image) => image.length !== 0);
  
  const tmplikecount= likecount ? [...likecount] : [];
  async function likeshandler() {
    if (user && likecount !== undefined) {
      let ind = tmplikecount.indexOf(user.uid);
      if (ind !== -1) {
        tmplikecount.splice(ind, 1);
        setLikesno((currLikesno) => currLikesno - 1);
      }
      else {
        tmplikecount.push(user.uid);
        setLikesno((currLikesno) => currLikesno + 1);
      }
      console.log(tmplikecount);
      const data = {
        likecount: tmplikecount
      };
      await updateDoc(docRef, data)
      .then(docRef => {
          console.log("like added");
      })
      .catch(error => {
          console.log(error);
      })  
    }
    
  }
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
        {postHasImages ? (
          <Grid container>
            {postImages.map((img, index) => (
              <Grid
                item
                key={img}
                xs={computeGridSize(postImages.length, index)}
                className="post__img_container"
              >
                <img className="post__img" src={img} alt="random sq" />
              </Grid>
            ))}
          </Grid>
        ) : (
          <div className="post__background">{caption}</div>
        )}
        <div className="social__icons__wrapper">
        
         <span style={{marginLeft: "14px",fontWeight: 'bold'}}>{likecount ? likesno : 0} likes</span>

          <div className="social__icon" onClick={likeshandler}>
            
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
