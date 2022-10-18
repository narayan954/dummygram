import React, { useRef, useState } from "react";
import { db, handleMultiUpload, storage } from "../lib/firebase";
import firebase from "firebase/compat/app";
import AnimatedButton from "./AnimatedButton";
import { LinearProgress, TextField } from "@mui/material";
import { useSnackbar } from "notistack";

function ImgUpload(props) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadingPost, setUploadingPost] = useState(false);
  const imgInput = useRef(null);

  const handleChange = (e) => {
    if (e.target.files?.length) {
      setImage(Array.from(e.target.files));
    }
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

  const handleUpload = () => {
    if (!image && !caption) {
      return;
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
      onUploadProgress(percentage) {
        setProgress(percentage);

        if (props.onUploadProgress) {
          props.onUploadProgress(percentage);
        }
      },
    })
      .then((urls) => {
        savePost(urls.join(","));
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
  };

  return (
    <div className="imageUpload">
      {uploadingPost && image && (
        <LinearProgress variant="determinate" value={progress} />
      )}
      {(!uploadingPost || (uploadingPost && image)) && (
        <input
          type="file"
          name="file"
          id="file"
          onChange={handleChange}
          multiple
          accept="image/*,video/*"
          ref={imgInput}
          disabled={uploadingPost}
        />
      )} 
      <TextField
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
        placeholder="Enter a Caption.."
        label="Caption"
        multiline
        rows={4}
        disabled={uploadingPost}
      />
      <AnimatedButton onClick={handleUpload} loading={uploadingPost}> 
        Upload
      </AnimatedButton>
    </div>
  );
}

export default ImgUpload;
