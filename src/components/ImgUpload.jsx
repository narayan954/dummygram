import "./imgPreview.css";

import { LinearProgress, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { db, handleMultiUpload, storage } from "../lib/firebase";

import AnimatedButton from "./AnimatedButton";
import Camera from "./Camera";
import Popup from "./Popup";
import firebase from "firebase/compat/app";
import { useSnackbar } from "notistack";

export default function ImgUpload(props) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadingPost, setUploadingPost] = useState(false);
  const imgInput = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isValidimage, setisValidimage] = useState(true);

  const handleChange = (e) => {
    if (!e.target.files[0]) {
      enqueueSnackbar("Select min 1 image!", {
        variant: "error",
      });
      setisValidimage(false);
      return false;
    }
    for (let i = 0; i < e.target.files.length; i++) {
      const img = e.target.files[i];
      if (!img.name.match(/\.(jpg|jpeg|png|gif)$/)) {
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

  const { enqueueSnackbar } = useSnackbar();

  const savePost = (imageUrl = "") => {
    db.collection("posts")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        caption: caption,
        imageUrl,
        username: props.user.displayName,
        avatar: props.user.photoURL,
        likecount: [],
      })
      .then(() => {
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
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });

        if (props.onUploadError) {
          props.onUploadError(err);
        }
      })
      .finally(() => {
        setUploadingPost(false);
      });
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

  const [buttonPopup, setButtonPopup] = useState(false);
  return (
    <div className="imageUpload">
      {uploadingPost && image && (
        <LinearProgress variant="determinate" value={progress} />
      )}
      {(!uploadingPost || (uploadingPost && image)) && (
        <>
          <center>
            <div className="file-input">
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
              <main className="popupMain">
                <button
                  className="openpopup"
                  onClick={() => setButtonPopup(true)}
                >
                  Take Picture
                </button>
                <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                  <Camera />
                </Popup>
              </main>
            </div>
          </center>
        </>
      )}
      {imagePreviews && (
        <div>
          {imagePreviews.map((img, i) => {
            return (
              <center>
                <img
                  id="imgPreview"
                  className="preview"
                  src={img}
                  alt={`image-${i}`}
                  key={i}
                />
              </center>
            );
          })}
        </div>
      )}
      <TextField
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
        variant="filled"
        placeholder="Enter a Caption.."
        label="Caption"
        multiline
        rows={4}
        disabled={uploadingPost}
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",

          "& .MuiFormLabel-root.Mui-focused": {
            fontWeight: "bold",
          },
        }}
      />
      <AnimatedButton
        onClick={handleUpload}
        loading={uploadingPost}
        style={{ fontWeight: "bold" }}
      >
        Upload
      </AnimatedButton>
    </div>
  );
}
