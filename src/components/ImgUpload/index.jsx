import "./index.css";

import { Avatar, LinearProgress, TextField } from "@mui/material";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { auth, db, handleMultiUpload } from "../../lib/firebase";
import { playErrorSound, playSuccessSound } from "../../js/sounds";
import getUserSessionData, { setUserSessionData } from "../../js/userData";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Camera from "./Camera";
import { HuePicker } from "react-color";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import Popup from "../../reusableComponents/Popup";
import firebase from "firebase/compat/app";
import { useSnackbar } from "notistack";

export default function ImgUpload(props) {
  const [current, setCurrent] = useState(0);
  const [nextPage, setNextPage] = useState(false);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadingPost, setUploadingPost] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isValidimage, setisValidimage] = useState(true);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [isStoryUploaded, setIsStoryUploaded] = useState(false);
  const [username, setUsername] = useState("");
  const [background, setBackground] = useState("#fff");

  const displayName = auth?.currentUser?.displayName;
  const avatar = auth?.currentUser?.photoURL;

  const imgInput = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const ShiftToNextPage = () => {
    setNextPage(!nextPage);
  };
  const prevStep = () => {
    setCurrent(current === 0 ? imagePreviews.length - 1 : current - 1);
  };
  const nextStep = () => {
    setCurrent(current === imagePreviews.length - 1 ? 0 : current + 1);
  };

  const handleBackgroundChange = (color) => {
    setBackground(color.hex);
  };

  useEffect(() => {
    async function getUsername() {
      const data = await getUserSessionData();
      setUsername(data.username);
      if (data.hasOwnProperty("storyTimestamp")) {
        setIsStoryUploaded(true);
      }
    }
    if (auth.currentUser.isAnonymous) {
      setUsername("guest");
    } else {
      getUsername();
    }
  }, []);

  const handleChange = (e) => {
    if (!e.target.files[0]) {
      enqueueSnackbar("Select min 1 image!", {
        variant: "error",
      });
      setisValidimage(false);
      e.stopPropagation();
      return;
    }
    for (let i = 0; i < e.target.files.length; i++) {
      const img = e.target.files[i];
      if (!img.name.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
        enqueueSnackbar("Select a valid image!", {
          variant: "error",
        });
        setisValidimage(false);
        return false;
      }
    }
    setisValidimage(true);

    const images = [];

    if (e.target.files?.length) {
      setImage(Array.from(e.target.files));
      setImagePreviews(image);
    }
    for (let i = 0; i < e.target.files.length; i++) {
      images.push(URL.createObjectURL(e.target.files[i]));
    }

    setImagePreviews(images);
    setBackground("#fff");
  };

  const savePost = async (imageUrl = "", type) => {
    const bg = background === "#fff" ? null : background
    try {
      if (type === "Post") {
        const postRef = await db.collection("posts").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          caption: caption,
          imageUrl,
          username: username,
          background: bg,
          displayName: props.user.displayName,
          avatar: props.user.photoURL,
          likecount: [],
          uid: auth?.currentUser?.uid,
        });

        const postId = postRef.id; // Store post ID in a separate variable

        await db
          .collection("users")
          .doc(props.user.uid)
          .update({
            posts: firebase.firestore.FieldValue.arrayUnion(postId), // Use postId instead of postRef.id
          });
        setUserSessionData({ posts: firebase.firestore.FieldValue.arrayUnion(postId) })
      } else {
        await db.collection("story").add({
          caption: caption,
          imageUrl,
          background: bg,
          username: username,
          uid: auth?.currentUser?.uid,
        });

        const querySnapshot = await db
          .collection("users")
          .where("username", "==", username)
          .get();
        if (!querySnapshot.empty) {
          const userRef = querySnapshot.docs[0].ref;
          // Update the 'storyTimestamp' field
          await userRef.update({
            storyTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          setUserSessionData({ storyTimestamp: firebase.firestore.FieldValue.serverTimestamp() })
        }
      }

      playSuccessSound();
      enqueueSnackbar(`${type} uploaded successfully!`, {
        variant: "success",
      });

      setProgress(0);
      setCaption("");
      setImage(null);
      if (imgInput.current) {
        imgInput.current.value = null;
      }

      if (props.onUploadComplete) {
        props.onUploadComplete();
      }
    } catch (err) {
      playErrorSound();
      enqueueSnackbar(err.message, {
        variant: "error",
      });

      if (props.onUploadError) {
        props.onUploadError(err);
      }
    } finally {
      setUploadingPost(false);
    }
  };

  function handleUpload(type) {
    if ((!image && !caption) || !isValidimage) {
      enqueueSnackbar("Upload valid image and caption!", {
        variant: "error",
      });
      return false;
    }

    setUploadingPost(true);
    if (props.onUploadStart) {
      props.onUploadStart();
    }

    if (!image) {
      savePost("", type);
      return;
    }

    handleMultiUpload(image, {
      generateThumbnails: true,
      onUploadProgress(percentage) {
        setProgress(percentage);

        if (props.onUploadProgress) {
          props.onUploadProgress(percentage);
        }
      },
    })
      .then((urls) => {
        savePost(JSON.stringify(urls), type);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
        setUploadingPost(false);

        if (props.onUploadError) {
          props.onUploadError(err);
        }
      })
      .finally(() => {
        if (props.onUploadEnd) {
          props.onUploadEnd();
        }
      });
  }

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", position: "sticky" }}
      >
        {uploadingPost && image && (
          <LinearProgress variant="determinate" value={progress} />
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="post-header">
            {avatar && displayName && (
              <>
                {" "}
                <Avatar
                  className="post__upload__avatar"
                  alt={displayName}
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
                <Link style={{ textDecoration: "none" }}>
                  <h3 className="post__username">{displayName}</h3>
                </Link>
              </>
            )}
          </div>
          {!image && (
            <div className="file-input" style={{ flexDirection: "row" }}>
              <div className="upload-picture">
                <input
                  type="file"
                  className="file"
                  name="file"
                  id="file"
                  onChange={handleChange}
                  multiple
                  accept="image/*"
                  ref={imgInput}
                  disabled={uploadingPost}
                />
                <label htmlFor="file">Upload Picture</label>
              </div>
              <div className="popupMain">
                <button
                  className="openpopup"
                  onClick={() => setButtonPopup(true)}
                >
                  Take Picture
                </button>
                <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                  <Camera />
                </Popup>
              </div>
            </div>
          )}
          {image && (
            <div className="slider__View" style={{ width: "90%" }}>
              {imagePreviews.map((imageUrl, index) => (
                <div
                  style={{ display: index === current ? "contents" : "none" }}
                  className={index === current ? "slide active" : "slide"}
                  key={index}
                >
                  <LazyLoadImage
                    className="image"
                    src={imageUrl}
                    effect="blur"
                    alt={" upload"}
                    delayTime={1000}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      maxHeight: "220px",
                    }}
                  />
                  {imagePreviews.length > 1 ? (
                    <div className="sliders_button">
                      <FaChevronCircleLeft
                        className="slider_circle"
                        onClick={prevStep}
                      />
                      <FaChevronCircleRight
                        className="slider_chevron"
                        onClick={nextStep}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
          )}
          <hr />
          <div className="caption-container">
            <TextField
              className="create-post-input"
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
              variant="filled"
              label="Write a caption..."
              multiline
              rows={8}
              disabled={uploadingPost}
              inputProps={{ maxLength: 200 }}
              sx={{
                width: "100%",
                "& .MuiFormLabel-root.Mui-focused": {
                  fontWeight: "bold",
                },
                "& .MuiFilledInput-root": {
                  background: background,
                  color: "var(--color)",
                },
              }}
              style={{ color: "var(--color) !important" }}
            />
            <div>
              {!image && (
                <HuePicker
                  color={background}
                  onChange={handleBackgroundChange}
                  height="12px"
                  width="100%"
                />
              )}
            </div>
          </div>
          <hr />
          <div className="shareBtnContainer">
            <button
              onClick={() => handleUpload("Post")}
              disabled={uploadingPost}
              className="share__button"
            >
              Add Post
            </button>
            <button
              onClick={() => handleUpload("Story")}
              disabled={uploadingPost || isStoryUploaded}
              className={`share__button ${isStoryUploaded ? "disable_post_btn" : null
                }`}
            >
              Create Story
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
