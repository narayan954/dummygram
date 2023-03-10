import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import { red } from "@mui/material/colors";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import Scroll from "../reusableComponents/Scroll";
import {
  Avatar,
  Grid,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  useMediaQuery,
  Box,
  Paper,
  styled,
  SvgIcon,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { db } from "../lib/firebase";
import firebase from "firebase/compat/app";
import "react-lazy-load-image-component/src/effects/blur.css";
import EmojiPicker from "emoji-picker-react";
import { doc, updateDoc } from "firebase/firestore";
import DialogBox from "../reusableComponents/DialogBox";
import ImageSlider from "../reusableComponents/ImageSlider";
import ReadMore from "./ReadMore";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";

const ITEM_HEIGHT = 48;

function Post(prop) {
  const { postId, user, post, shareModal, setLink, setPostText } = prop;
  const { username, caption, imageUrl, avatar, likecount } = post;
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likesNo, setLikesNo] = useState(likecount ? likecount.length : 0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [Open, setOpen] = useState(false);
  const [isCommentOpen, setisCommentOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const open = Boolean(anchorEl);
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
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
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

  // const computeGridSize = (imagesLength, imageIndex) => {
  //   if (imageIndex === imagesLength - 1 && (imageIndex + 1) % 2 !== 0) {
  //     return 12;
  //   }
  //   return 6;
  // };

  const postHasImages = postImages.some((image) => Boolean(image.imageUrl));
  const tempLikeCount = likecount ? [...likecount] : [];
  const buttonStyle = {
    ":hover": {
      color: "#ff4d4d",
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

  async function deletePost() {
    await db.collection("posts").doc(postId).delete();
  }

  const handleClickOpen = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  // const handleCommentOpen = () => {
  //   setisCommentOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCommentClose = () => {
    setisCommentOpen(false);
  };

  return (
    <div
      className="post"
      style={{ boxShadow: "0px 0px 5px 1px rgba(0, 0, 0, 0.4)" }}
    >
      <div className="post__header">
        <Avatar
          className="post__avatar"
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
        />
        <h3 className="post__username">{username}</h3>
        <div className="social__icon__last">
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{
              color: "var(--color)",
            }}
          >
            <MoreHorizOutlinedIcon />
          </IconButton>
          {user && username == user.displayName && (
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              }}
            >
              <MenuItem onClick={handleClickOpen}> Delete </MenuItem>
            </Menu>
          )}
          <Dialog
            fullScreen={fullScreen}
            open={Open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"Delete Post?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this post?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={deletePost}>Delete</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      <div className="post__container">
        {postHasImages ? (
          <ImageSlider slides={postImages} isCommentBox={false} />
        ) : (
          <div className="post__background">{caption}</div>
        )}
        <div className="social__icons__wrapper">
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
              setLink(`https://dummy-gram.web.app/${postId}`);
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

        <div className="post__text">
          {caption && postHasImages && (
            <>
              <strong style={{ color: "royalblue" }}>{username} </strong>
              <ReadMore caption={caption} />
            </>
          )}
        </div>

        {comments.length ? (
          <>
            <Button
              onClick={setisCommentOpen}
              startIcon={<CommentIcon />}
              sx={{
                backgroundColor: "rgba(	135, 206, 235, 0.2)",
                margin: "12px 8px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              View All comments
            </Button>

            <DialogBox
              open={isCommentOpen}
              onClose={handleCommentClose}
              title="All Comments"
            >
              <Box sx={{ flexGrow: 1 }}>
                <Grid container>
                  <Grid item xs={6} md={6}>
                    <Item>
                      {postHasImages ? (
                        <ImageSlider slides={postImages} isCommentBox />
                      ) : (
                        <div className="post__background">{caption}</div>
                      )}
                    </Item>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Scroll>
                      <Item>
                        <div className="post__comments">
                          {comments.map((userComment) => (
                            <p key={userComment.id}>
                              <strong>{userComment.content.username}</strong>{" "}
                              {userComment.content.text}
                              <span
                                onClick={(event) =>
                                  deleteComment(event, userComment)
                                }
                              >
                                {user &&
                                userComment.content.username ===
                                  user.displayName ? (
                                  <DeleteTwoToneIcon fontSize="small" />
                                ) : (
                                  <></>
                                )}
                              </span>
                              <hr />
                            </p>
                          ))}
                        </div>
                      </Item>
                    </Scroll>
                  </Grid>
                </Grid>
              </Box>

              {user && (
                <form className="post__commentBox">
                  <div className="social__icon">
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
          </>
        ) : (
          <></>
        )}

        {user && (
          <form className="post__commentBox">
            <div className="social__icon">
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
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;
