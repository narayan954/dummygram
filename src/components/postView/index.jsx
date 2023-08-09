import "./index.css"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import BlankImg from "../../assets/blank-profile.webp";
import CommentBox from "../Post/CommentBox";
import { deleteComment } from "../../js/postFn";

import { db } from "../../lib/firebase.js";
import firebase from "firebase/compat/app";
import useCreatedAt from "../../hooks/useCreatedAt.jsx";
import { useNavigate } from "react-router-dom";

const ImageSlider = React.lazy(() =>
  import("../../reusableComponents/ImageSlider"),
);
const PostDetails = React.lazy(() => import("./PostDetails.jsx"));


const PostCommentView = ({ setFetchAgain, fetchAgain, postId, user, post }) => {
  const navigate = useNavigate();
  const [openToDeleteComment, setOpenToDeleteComment] = useState(false);
  const { username, caption, imageUrl, avatar, likecount, timestamp, uid, displayName, background } =
    post;
  const time = useCreatedAt(timestamp);
  const defaultBg = `linear-gradient(130deg, #dee2ed, #dee2ed, #9aa9d1, #b6c8e3, #b6afd0, #d3c0d8)`;

  const [comments, setComments] = React.useState(null);
  const [comment, setComment] = useState("");
  const [tempLikeCount, setTempLikeCount] = useState(post.likecount || [])
  const [userData, setUserData] = useState({})
  const [showEmojis, setShowEmojis] = React.useState(false);
  const docRef = doc(db, "posts", postId);


  async function likesHandler() {
    if (user && likecount !== undefined) {
      const tempArr = tempLikeCount
      let ind = tempLikeCount.indexOf(user.uid);

      if (ind !== -1) {
        tempArr.splice(ind, 1);
        setTempLikeCount(tempArr)
      } else {
        tempArr.push(user.uid);
        setTempLikeCount(tempArr)
      }

      const data = {
        likecount: tempArr,
      };
      await updateDoc(docRef, data)
        .then(() => setFetchAgain(!fetchAgain))
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  }

  useEffect(() => {
    async function getUsername() {
      try {
        const docRef = db.collection("users").doc(user?.uid);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const data = docSnap.data();
          setUserData({
            username: data?.username || auth.currentUser?.uid,
          });
        }
      }
      catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          username: user?.uid,
        });
      }
    }
    getUsername()
  }, [])

  const postComment = (event) => {
    event.preventDefault();
    try {
      db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: userData?.username,
        displayName: user?.displayName,
        avatar: user?.photoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setComment("");
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
  const onEmojiClick = (emojiObject) => {
    setComment((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojis(false);
  };

  return (
    <div className="post_view_container">
      <div className="post_view_sub_container">
        <div className="post_view_header_container">
          <img
            src={avatar?.length > 0 ? avatar : BlankImg} alt={displayName}
            className="post_view_avatar"
            onClick={() => navigate(`/dummygram/user/${username}`)}
          />
          <span>
            <h2
              className="post_view_user_name"
              onClick={() => navigate(`/dummygram/user/${username}`)}
            >
              {displayName}
            </h2>
            <p className="post_view_time">{time}</p>
          </span>
        </div>
        <div className="post_view_img_container">
          {postHasImages ? (
            <>
              <p>{caption}</p>
              <ImageSlider
                slides={postImages}
                height={500}
                isCommentBox={true}
                doubleClickHandler={likesHandler}
              />
            </>
          ) : (
            <div
              style={{ background: background ? background : defaultBg }}
              className="post_view_post_without_img"
            >
              {caption}
            </div>
          )}
        </div>
        <div className="post_view_post_nav_container">
          <PostDetails
            user={user}
            postId={postId}
            postUserUid={uid}
            likecount={tempLikeCount}
            likesHandler={likesHandler}
            imageUrl={imageUrl}
            caption={caption}
          />
        </div>
        <div>
          <CommentBox
            user={user}
            showEmojis={showEmojis}
            setShowEmojis={setShowEmojis}
            comment={comment}
            setComment={setComment}
            postComment={postComment}
            onEmojiClick={onEmojiClick}
          />
        </div>
        <div>
          {comments?.length ? (
            <ul className="post_view_comment_container">
              {comments.map(({ id, content }) => (
                <li key={id} className="post_view_comment_list_item">
                  <img
                    src={content.avatar ? content.avatar : BlankImg} alt={content.displayName}
                    className="post_view_comment_img"
                    onClick={() => navigate(`/dummygram/user/${content.username}`)}
                  />
                  <div>
                    <h4
                      className="post_view_comment_img_name"
                      onClick={() => navigate(`/dummygram/user/${content.username}`)}
                    >
                      {content.displayName}
                    </h4>
                    <p>{content.text}</p>
                  </div>
                  <div
                    onClick={() => {
                      setOpenToDeleteComment(!openToDeleteComment);
                    }}
                    style={{ marginLeft: "auto" }}
                  >
                    {userData?.username == content.username && (
                      <DeleteTwoToneIcon
                        fontSize="small"
                        className="comment-delete-icon"
                      />
                    )}
                    {
                      <Dialog
                        open={openToDeleteComment}
                        onClose={() => setOpenToDeleteComment(false)}
                        aria-labelledby="responsive-dialog-title"
                      >
                        <DialogTitle id="responsive-dialog-title">
                          {"Delete Comment?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete this Comment?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpenToDeleteComment(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={async (event) => {
                              await deleteComment(event, postId, id)
                              setOpenToDeleteComment(false)
                            }}
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    }
                  </div>
                </li>
              ))}
            </ul>
          ) : (
              <p variant="body2" className="no-comments" style={{textAlign: "center"}}>
                No Comments to Show!!
              </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default PostCommentView;