import "./index.css";

import { Avatar, LinearProgress, TextField } from "@mui/material";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { auth, db, handleMultiUpload } from "../../lib/firebase";
import { playErrorSound, playSuccessSound } from "../../js/sounds";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Camera from "./Camera";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import Popup from "../../reusableComponents/Popup";
import firebase from "firebase/compat/app";
import { useSnackbar } from "notistack";
import { doc, getDoc } from "firebase/firestore";

export default function ImgUpload(props) {
  const [current, setCurrent] = useState(0);
  const [nextPage, setNextPage] = useState(false);

  const ShiftToNextPage = () => {
    setNextPage(!nextPage);
  };
  const prevStep = () => {
    setCurrent(current === 0 ? imagePreviews.length - 1 : current - 1);
  };
  const nextStep = () => {
    setCurrent(current === imagePreviews.length - 1 ? 0 : current + 1);
  };
  const displayName = auth.currentUser.displayName;
  const avatar = auth.currentUser.photoURL;
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadingPost, setUploadingPost] = useState(false);
  const imgInput = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isValidimage, setisValidimage] = useState(true);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [username, setUsername] = useState("")

  useEffect(() => {
    async function getUsername(){
      const docRef = doc(db, "users", auth?.currentUser?.uid);
      const docSnap = await getDoc(docRef);
      setUsername(docSnap.data().username)
    }

    getUsername()
  }, [])

  const { enqueueSnackbar } = useSnackbar();

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
  };

  const savePost = async (imageUrl = "") => {
    try {
      const postRef = await db.collection("posts").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        caption: caption,
        imageUrl,
        username: username,
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

      playSuccessSound();
      enqueueSnackbar("Post was uploaded successfully!", {
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

  function handleUpload() {
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
      savePost();
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
        savePost(JSON.stringify(urls));
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
    <div className="imageUpload">
      {uploadingPost && image && (
        <LinearProgress variant="determinate" value={progress} />
      )}
      <div className="big_post_view">
        {!image && (
          <div className="file-input">
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
          <div className="slider__View">
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
        <div className="post__caption_section">
          <div className="post__header">
            {avatar && displayName && (
              <>
                {" "}
                <Avatar
                  className="post__avatar"
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
          <TextField
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
            variant="filled"
            // placeholder="Write a Caption..."
            label="Write a caption..."
            multiline
            rows={12}
            disabled={uploadingPost}
            inputProps={{ maxLength: 200 }}
            sx={{
              width: "100%",
              "& .MuiFormLabel-root.Mui-focused": {
                fontWeight: "bold",
              },
              "& .MuiFilledInput-root": {
                background: "transparent",
              },
            }}
          />
          <button
            onClick={handleUpload}
            disabled={uploadingPost}
            className="share__button"
          >
            Share
          </button>
        </div>
      </div>
      <div className="small_post_view">
        {!nextPage && !image && (
          <div className="file-input">
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
        {!nextPage && image && (
          <div className="slider__View">
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
        {!nextPage && (
          <button className="next_button" onClick={ShiftToNextPage}>
            Let's Write Some Text...
          </button>
        )}
        {nextPage && (
          <div className="back_button" onClick={ShiftToNextPage}>
            <ArrowBackIcon fontSize="1rem" />
            &nbsp; Image
          </div>
        )}
        {nextPage && (
          <div className="post__caption_section">
            <div className="post__header">
              {avatar && displayName && (
                <>
                  {" "}
                  <Avatar
                    className="post__avatar"
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
            <TextField
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
              variant="filled"
              // placeholder="Write a Caption..."
              label="Write a caption..."
              multiline
              rows={12}
              disabled={uploadingPost}
              sx={{
                width: "100%",
                "& .MuiFormLabel-root.Mui-focused": {
                  fontWeight: "bold",
                },
                "& .MuiFilledInput-root": {
                  background: "transparent",
                },
              }}
            />
            <button
              onClick={handleUpload}
              disabled={uploadingPost}
              className="share__button"
            >
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
