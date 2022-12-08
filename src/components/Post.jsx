import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { red } from "@mui/material/colors";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { db } from "../lib/firebase";
import firebase from "firebase/compat/app";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import EmojiPicker from "emoji-picker-react";
import { doc, updateDoc } from "firebase/firestore";
import DialogBox from "../reusableComponents/DialogBox";

const ITEM_HEIGHT = 48;

function Post(prop) {
  const { postId, user, post } = prop;
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
  const [imageLoaded, setImageLoaded] = useState(false);

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
      if (unsubscribe) {
        unsubscribe();
      }
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

  const computeGridSize = (imagesLength, imageIndex) => {
    if (imageIndex === imagesLength - 1 && (imageIndex + 1) % 2 !== 0) {
      return 12;
    }
    return 6;
  };

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

  const handleCommentOpen = () => {
    setisCommentOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCommentClose = () => {
    setisCommentOpen(false);
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
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => setAnchorEl(event.currentTarget)}
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
              <Button autoFocus onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={deletePost} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      <div className="post__container">
        {postHasImages ? (
          <Grid container>
            {postImages.map(
              ({ imageUrl, imageWidth, imageHeight, thumbnail }, index) => (
                <Grid
                  item
                  key={imageUrl}
                  xs={computeGridSize(postImages.length, index)}
                  className="post__img_container"
                >
                  <LazyLoadImage
                    className="post__img"
                    src={imageUrl}
                    placeholderSrc={thumbnail}
                    effect="blur"
                    alt={`${username}'s upload`}
                    delayTime={1000}
                    style={{
                      width: imageLoaded ? "100%" : imageWidth,
                      height: imageLoaded ? undefined : imageHeight,
                      objectFit: imageLoaded ? "contain" : "cover",
                    }}
                    afterLoad={() => setImageLoaded(true)}
                    onDoubleClick={likesHandler}
                  />
                  {/* <img className="post__img" src={img} alt="random sq" /> */}
                </Grid>
              )
            )}
          </Grid>
        ) : (
          <div className="post__background">{caption}</div>
        )}
        <div className="social__icons__wrapper">
          <span style={{ marginLeft: "14px", fontWeight: "light" }}>
            {likecount ? likesNo : 0} likes
          </span>

          <div className="social__icon" onClick={likesHandler}>
            {user ? (
              tempLikeCount.indexOf(user.uid) != -1 ? (
                <FavoriteOutlinedIcon sx={{ color: red[500] }} />
              ) : (
                <FavoriteBorderIcon />
              )
            ) : (
              <FavoriteBorderIcon />
            )}
          </div>
          {/* <div className="social__icon">
            <ModeCommentOutlinedIcon />
          </div> */}
          {/* <div className="social__icon">
            <SendOutlinedIcon />
          </div> */}
          {/* <div className="social__icon__last">
            <BookmarkBorderOutlinedIcon />
          </div> */}
        </div>

        <div className="post__text">
          {caption && postHasImages && (
            <>
              <strong>{username} </strong>
              {caption}
            </>
          )}
        </div>

        {comments.length ? (
          <>
            <Button onClick={setisCommentOpen}>View All comments</Button>
            <DialogBox
              open={isCommentOpen}
              onClose={handleCommentClose}
              title="All Comments"
            >
              <div className="post__comments">
                {comments.map((userComment) => (
                  <p key={userComment.id}>
                    <strong>{userComment.content.username}</strong>{" "}
                    {userComment.content.text}
                    <span
                      onClick={(event) => deleteComment(event, userComment)}
                    >
                      {user &&
                        userComment.content.username === user.displayName ? (
                        <DeleteTwoToneIcon fontSize="small" />
                      ) : (
                        <></>
                      )}
                    </span>
                  </p>
                ))}
              </div>
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
                    searchDisabled={true}
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
