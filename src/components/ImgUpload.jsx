import React, { useRef, useState } from "react";
import { db, handleMultiUpload, storage } from "../lib/firebase";
import firebase from "firebase/compat/app";
import AnimatedButton from "./AnimatedButton";

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
  const handleUpload = () => {
    if (!image) {
      return;
    }

    setUploadingPost(true);
    handleMultiUpload(image, {
      onUploadProgress(percentage) {
        setProgress(percentage);
      },
    })
      .then((urls) => {
        db.collection("posts")
          .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            caption: caption,
            imageUrl: urls.join(","),
            username: props.username,
            avatar: "avatar",
          })
          .then(() => {
            alert("Post was uploaded successfully!");
            setProgress(0);
            setCaption("");
            setImage(null);
            if (imgInput.current) {
              imgInput.current.value = null;
            }
          })
          .catch((err) => {
            alert(err.message);
          })
          .finally(() => {
            setUploadingPost(false);
          });
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
        setUploadingPost(false);
      });
  };

  return (
    <div className="imageUpload">
      <progress className="imageUpload-progress" value={progress} max="100" />
      <input
        type="text"
        name="caption"
        id="caption"
        placeholder="Enter a Caption.. "
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      />
      <input
        type="file"
        name="file"
        id="file"
        onChange={handleChange}
        multiple
        accept="image/*,video/*"
        ref={imgInput}
      />
      <AnimatedButton onClick={handleUpload} loading={uploadingPost}>
        Upload
      </AnimatedButton>
    </div>
  );
}

export default ImgUpload;
