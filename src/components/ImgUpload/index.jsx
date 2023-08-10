import "./index.css";

import { LinearProgress, TextField } from "@mui/material";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { auth, db, handleMultiUpload } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { playErrorSound, playSuccessSound } from "../../js/sounds";
import blankImg from "../../assets/blank-profile.webp"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import { HuePicker } from "react-color";
import { LazyLoadImage } from "react-lazy-load-image-component";
import firebase from "firebase/compat/app";
import { useSnackbar } from "notistack";

export default function ImgUpload(props) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadingPost, setUploadingPost] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isValidimage, setisValidimage] = useState(true);
  const [isStoryUploaded, setIsStoryUploaded] = useState(false);
  const [username, setUsername] = useState("");
  const [background, setBackground] = useState("#fff");

  const current = 0;

  const displayName = auth?.currentUser?.displayName;
  const avatar = auth?.currentUser?.photoURL;

  const imgInput = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function getUsername() {
      const docRef = doc(db, "users", auth?.currentUser?.uid);
      const docSnap = await getDoc(docRef);
      setUsername(docSnap.data().username);
      if (docSnap.data().hasOwnProperty("storyTimestamp")) {
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
    try {
      if (type === "Post") {
        const postRef = await db.collection("posts").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          caption: caption,
          imageUrl,
          username: username,
          background: background,
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
      } else {
        await db.collection("story").add({
          caption: caption,
          imageUrl,
          background: background,
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

  const handleBackgroundChange = (color) => {
    setBackground(color.hex);
  };

  function trimName() {
    const arr = displayName?.split(" ");
    return arr[0]? arr[0] : "";
  }

  return (
      <div className="create_box_main_container">
        <div className="create_box_header_container">
          <img
            src={avatar?.length > 0 ? avatar : blankImg}
            alt={displayName}
            className="create_box_user_avatar"
          />
          <h3>
            {displayName}
          </h3>
        </div>
        <div>
          <TextField
            className="create-post-input"
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
            variant="filled"
            placeholder={`What's on your mind, ${trimName()}?`}
            multiline
            rows={3}
            disabled={uploadingPost}
            sx={{
              width: "100%",
              "& .MuiFormLabel-root.Mui-focused": {
                fontWeight: "bold",
              },
              "& .MuiFilledInput-root": {
                background: background,
                paddingTop: "10px",
                color: "var(--color)",
              },
            }}
            style={{ color: "var(--color) !important" }}
          />
        </div>
        <div className="create_box_img_container" style={{display: image? "block" : "none"}}>
          {image && (
            <div className="slider__View slider_view">
              {imagePreviews.map((imageUrl, index) => (
                <div
                  style={{ display: index === current ? "contents" : "none", width: "100% !important", height: "100%" }}
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
                      // objectFit: "cover",
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
        </div>
        <div className="create_box_edit_container">
          <div>
            <input
              type="file"
              className="file"
              name="file"
              id="file"
              onChange={handleChange}
              multiple
              style={{ cursor: "pointer" }}
              accept="image/*"
              ref={imgInput}
              disabled={uploadingPost}
            />
            <label htmlFor="file"><AddPhotoAlternateIcon className="create_box_edit_icon" /></label>
          </div>
          <div style={{ width: "100%" }}>
            <HuePicker
              color={background}
              onChange={(e) => {
                if (!image) {
                  handleBackgroundChange(e)
                }
              }}
              height="15px"
              width="100%"
            />
          </div>
        </div>
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
  );
}
