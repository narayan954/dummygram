import "react-lazy-load-image-component/src/effects/blur.css";
import "./index.css";

import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import {
  ChatBubbleOutlineRounded,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import DialogBox from "../../reusableComponents/DialogBox";
import EmojiPicker from "emoji-picker-react";
import { FaSave } from "react-icons/fa";
import Flexbetween from "../../reusableComponents/Flexbetween";
import ImageSlider from "../../reusableComponents/ImageSlider";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ReadMore from "../ReadMore";
import Scroll from "../../reusableComponents/Scroll";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import TextField from "@mui/material/TextField";
import { db } from "../../lib/firebase";
import firebase from "firebase/compat/app";
import { saveAs } from "file-saver";
import useCreatedAt from "../../hooks/useCreatedAt";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";

const ITEM_HEIGHT = 48;

function Post(prop) {
  const { postId, user, post, shareModal, setLink, setPostText, rowMode } =
    prop;
  const { username, caption, imageUrl, avatar, likecount, timestamp } = post;

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likesNo, setLikesNo] = useState(likecount ? likecount.length : 0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editCaption, setEditCaption] = useState(caption);
  const [showEmojis, setShowEmojis] = useState(false);
  const [Open, setOpen] = useState(false);
  const [openEditCaption, setOpenEditCaption] = useState(false);
  const [isCommentOpen, setisCommentOpen] = useState(false);
  const [deleteCommentID, setDeleteCommentID] = useState("");
  const [openToDeleteComment, setOpenToDeleteComment] = useState(false);

  const time = useCreatedAt(timestamp);
  const theme = useTheme();
  const navigate = useNavigate();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();

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

  async function deletePost() {
    await db.collection("posts").doc(postId).delete();
  }

  const handleClickOpen = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const handleDownload = () => {
    const urlimg = JSON.parse(imageUrl)[0].imageUrl;
    saveAs(urlimg, "image");
  };

  const handleClickOpenCaption = async () => {
    setOpenEditCaption(true);
  };

  const handleClickClosedCaption = () => {
    setEditCaption(caption);
    setOpenEditCaption(false);
  };

  const handleSubmitCaption = async () => {
    const taskDocRef = doc(db, "posts", postId);
    try {
      await updateDoc(taskDocRef, {
        caption: editCaption,
      });
    } catch (err) {
      alert(err);
    }
    setOpenEditCaption(false);
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

  const handleCloseForDeleteComment = () => {
    setOpenToDeleteComment(false);
  };

  return (
    <div
      className={`${rowMode ? "post" : "postColumn"}`}
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
          onClick={() => {
            navigate("/dummygram/profile", {
              state: {
                name: username,
                avatar: avatar,
              },
            });
          }}
        />
        <Link
          to={`/dummygram/posts/${postId}`}
          style={{ textDecoration: "none" }}
        >
          <h3 className="post__username">{username}</h3>
          <p>{time}</p>
        </Link>
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
            {user && username === user.displayName && (
              <MenuItem onClick={handleClickOpen}> Delete </MenuItem>
            )}
            {user && username === user.displayName && (
              <MenuItem onClick={handleClickOpenCaption}> Edit </MenuItem>
            )}
            {postHasImages && (
              <MenuItem onClick={handleDownload}> Download </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                navigate("/dummygram/profile", {
                  state: {
                    name: username,
                    avatar: avatar,
                  },
                });
              }}
            >
              Visit Profile
            </MenuItem>
          </Menu>
          <>
            <Dialog
              fullWidth
              open={openEditCaption}
              onClose={handleClickClosedCaption}
            >
              <DialogTitle>Change Caption</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Enter Your Caption"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setEditCaption(e.target.value)}
                  value={editCaption}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClickClosedCaption}>Cancel</Button>
                <Button onClick={handleSubmitCaption}>Submit</Button>
              </DialogActions>
            </Dialog>
          </>

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
          <ImageSlider
            slides={postImages}
            isCommentBox={false}
            doubleClickHandler={likesHandler}
          />
        ) : (
          <div className="post__background" onDoubleClick={likesHandler}>
            {caption.length >= 300 ? (
              <>
                <p className="post_caption">
                  <ReadMore picCap>{caption}</ReadMore>
                </p>
              </>
            ) : (
              <p className="post_caption">{caption}</p>
            )}
          </div>
        )}
        <div className="post__text">
          {caption && postHasImages && caption.length >= 300 ? (
            <>
              <ReadMore>{caption}</ReadMore>
            </>
          ) : (
            caption && postHasImages && <p className="">{caption}</p>
          )}
        </div>

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
            <Flexbetween gap={!fullScreen && "1.6rem"}>
              <Flexbetween sx={{ cursor: "pointer" }} onClick={likesHandler}>
                <IconButton>
                  {tempLikeCount.indexOf(user.uid) != -1 ? (
                    <FavoriteOutlined sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography fontSize={14}>Like</Typography>
              </Flexbetween>

              <Flexbetween
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setisCommentOpen(!Open);
                }}
              >
                <IconButton>
                  <ChatBubbleOutlineRounded />
                </IconButton>
                <Typography fontSize={14}>Comment</Typography>
              </Flexbetween>

              <Flexbetween
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setLink(`https://narayan954.github.io/dummygram/${postId}`);
                  setPostText(caption);
                  shareModal(true);
                }}
              >
                <IconButton>
                  <ShareOutlined />
                </IconButton>
                <Typography fontSize={14}>Share</Typography>
              </Flexbetween>

              <Flexbetween sx={{ cursor: "pointer" }} onClick={save}>
                <IconButton>
                  <FaSave
                    onClick={save}
                    style={{ cursor: "pointer", fontSize: "22px" }}
                    className="post_button"
                  />
                </IconButton>
                <Typography fontSize={14}>Save</Typography>
              </Flexbetween>
            </Flexbetween>

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
