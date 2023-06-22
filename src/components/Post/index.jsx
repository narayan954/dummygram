import "react-lazy-load-image-component/src/effects/blur.css";
import "./index.css";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  // Menu,
  // MenuItem,
  Paper,
  styled,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import { FaSave } from "react-icons/fa";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import firebase from "firebase/compat/app";
import PostHeader from "./PostHeader";
import EmojiBox from "./EmojiBox";
import ImgBox from "./ImgBox";
import CommentBox from "./CommentBox";

import CommentIcon from "@mui/icons-material/Comment";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import { red } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";

import { DialogBox, ImageSlider, Scroll } from "../../reusableComponents"
import { Caption, ReadMore } from "../index"
import useCreatedAt from "../../hooks/useCreatedAt";
import { useSnackbar } from "notistack";

function Post(prop) {
  const { postId, user, post, shareModal, setLink, setPostText, rowMode } =
    prop;
  const { caption, imageUrl, likecount, timestamp } = post;

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [postData, setPostData] = useState(post)
  const [likesNo, setLikesNo] = useState(likecount ? likecount.length : 0);
  const [showEmojis, setShowEmojis] = useState(false);
  const [Open, setOpen] = useState(false);
  const [isCommentOpen, setisCommentOpen] = useState(false);
  const [deleteCommentID, setDeleteCommentID] = useState("");
  const [openToDeleteComment, setOpenToDeleteComment] = useState(false);

  const time = useCreatedAt(timestamp);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();

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

  const save = async () => {
    const localStoragePosts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIdExists = localStoragePosts.includes(postId);

    if (!postIdExists) {
      localStoragePosts.push(postId);
      localStorage.setItem("posts", JSON.stringify(localStoragePosts));
      enqueueSnackbar("Post added to favourites!", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Post is already in favourites!", {
        variant: "error",
      });
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
        postData={postData}
      />
      <div className="post__container">
        <ImgBox 
          postHasImages={postHasImages} 
          postImages={postImages} 
          likesHandler={likesHandler} 
          caption={caption}
        />
        
        {user && (
          <form className="post__commentBox">
            <EmojiBox 
              onEmojiClick={onEmojiClick} 
              showEmojis={showEmojis}
              setShowEmojis={setShowEmojis}
            />
            <input
              className="post__input"
              type="text"
              placeholder={
                comments.length !== 0
                  ? "Add a comment..."
                  : "Be the first one to comment..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--color)",
                borderRadius: "22px",
                margin: "4px 0px",
              }}
            />
            <button
              className="post__button"
              disabled={!comment}
              type="submit"
              onClick={postComment}
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Post
            </button>
            <div className="social__icons__wrapper">
              <FaSave
                onClick={save}
                style={{ cursor: "pointer", fontSize: "22px" }}
                className="post_button"
              />

              <div
                className="social__icon"
                onClick={likesHandler}
                style={{ cursor: "pointer" }}
              >
                {user ? (
                  tempLikeCount.indexOf(user.uid) != -1 ? (
                    <FavoriteOutlinedIcon
                      sx={{ color: red[500], fontSize: "30px" }}
                    />
                  ) : (
                    <FavoriteBorderIcon sx={buttonStyle} />
                  )
                ) : (
                  <FavoriteBorderIcon sx={buttonStyle} />
                )}
              </div>
              <span style={{ marginLeft: "", fontWeight: "bold" }}>
                {likecount !== 0 ? `${likesNo} Likes` : " "}{" "}
                {/* <span style={{ fontWeight: "bold" }}>Likes</span> */}
              </span>
              <IconButton
                aria-label="share"
                id="share-button"
                aria-haspopup="true"
                onClick={() => {
                  setLink(`https://narayan954.github.io/dummygram/${postId}`);
                  setPostText(caption);
                  shareModal(true);
                }}
                sx={{
                  color: "var(--color)",
                  marginX: "4px",
                }}
              >
                <ReplyRoundedIcon htmlColor="var(--color)" />
              </IconButton>
              {/* comment button */}
              {/* <div className="social__icon">
                      <ModeCommentOutlinedIcon />
                    </div> */}
              {/* share button */}
              {/* <div className="social__icon">
                      <SendOutlinedIcon />
                    </div> */}
              {/* save button */}
              {/* <div className="social__icon__last">
                      <BookmarkBorderOutlinedIcon />
                    </div> */}
            </div>
            <Button
              onClick={() => {
                setisCommentOpen(!Open);
              }}
              startIcon={<CommentIcon />}
              sx={{
                backgroundColor: "rgba(	135, 206, 235, 0.2)",
                margin: "12px 8px",
                fontSize: "12px",
                fontWeight: "bold",
                "&.Mui-disabled": {
                  color: "#616161",
                },
              }}
              disabled={comments.length !== 0 ? false : true}
            >
              {comments.length > 1
                ? `View all ${comments.length} comments`
                : comments.length === 1
                ? `View 1 comment`
                : "No comments yet"}
            </Button>
            <DialogBox
              open={isCommentOpen}
              onClose={handleCommentClose}
              title="All Comments"
            >
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <Item>
                      {postHasImages ? (
                        <ImageSlider slides={postImages} isCommentBox />
                      ) : (
                        <div className="post__background">
                          <p className="post_caption">{caption}</p>
                        </div>
                      )}
                    </Item>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Scroll>
                      <Item>
                        <div className="post__comments">
                          {comments.length ? (
                            <>
                              {comments.map((userComment) => (
                                <p key={userComment.id}>
                                  <strong>
                                    {userComment.content.username}
                                  </strong>{" "}
                                  {userComment.content.text}
                                  <span
                                    onClick={() => {
                                      setOpenToDeleteComment(
                                        !openToDeleteComment
                                      );
                                      setDeleteCommentID(userComment);
                                    }}
                                  >
                                    {user &&
                                    userComment.content.username ===
                                      user.displayName ? (
                                      <DeleteTwoToneIcon
                                        fontSize="small"
                                        style={{ color: "red" }}
                                      />
                                    ) : (
                                      <></>
                                    )}
                                    {
                                      <Dialog
                                        fullScreen={fullScreen}
                                        open={openToDeleteComment}
                                        onClose={handleCloseForDeleteComment}
                                        aria-labelledby="responsive-dialog-title"
                                      >
                                        <DialogTitle id="responsive-dialog-title">
                                          {"Delete Comment?"}
                                        </DialogTitle>
                                        <DialogContent>
                                          <DialogContentText>
                                            Are you sure you want to delete this
                                            Comment?
                                          </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            onClick={
                                              handleCloseForDeleteComment
                                            }
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={(event) =>
                                              deleteComment(
                                                event,
                                                deleteCommentID
                                              )
                                            }
                                          >
                                            Delete
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    }
                                  </span>
                                  <hr />
                                </p>
                              ))}
                            </>
                          ) : (
                            <span>No Comments</span>
                          )}
                        </div>
                      </Item>
                    </Scroll>
                  </Grid>
                </Grid>
              </Box>
              <CommentBox setShowEmojis={setShowEmojis} showEmojis={showEmojis}/>

              {user && (
                <form className="post__commentBox">
                  <div
                    className="social__icon"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <SentimentSatisfiedAltOutlinedIcon
                      onClick={() => {
                        setShowEmojis((val) => !val);
                      }}
                    />
                    {showEmojis && (
                      <div id="picker">
                        <EmojiPicker
                          emojiStyle="native"
                          height={330}
                          searchDisabled
                          onEmojiClick={onEmojiClick}
                          previewConfig={{
                            showPreview: false,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                      backgroundColor: "var(--bg-color)",
                      color: "var(--color)",
                      borderRadius: "22px",
                      marginTop: "4px",
                    }}
                  />
                  <button
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                    style={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Comment
                  </button>
                </form>
              )}
            </DialogBox>
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;
