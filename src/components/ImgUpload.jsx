import React, { useState } from "react";
import { db, storage } from "../lib/firebase";
import firebase from "firebase/compat/app";
import AnimatedButton from "./AnimatedButton";

function ImgUpload(props) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadingPost, setUploadingPost] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
 const handleUpload = () => {
    setUploadingPost(true);
    if(image){
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function ...
          setProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        },
        (error) => {
          // error function ...
          console.log(error);
          alert(error.message);
        },
        () => {
          // complete function ...
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: url,
                username: props.user.displayName,
                avatar: props.user.photoURL,
              });
              setProgress(0);
              setCaption("");
              setImage(null);
              setUploadingPost(false);
            });
        }
      );
    }
    else {
      db.collection("posts").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        caption: caption,
        imageUrl: "",
        username: props.user.displayName,
        avatar: props.user.photoURL,
      })
      setProgress(0);
      setCaption("");
      setImage(null);
      setUploadingPost(false);
    }
  };

  return (
    <div className="imageUpload">
      <h1>Create a Post!</h1>
      <progress className="imageUpload-progress" value={progress} max="100" />
      <input
        type="text"
        name="caption"
        id="caption"
        placeholder="Enter a Caption.. "
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      />
      <input type="file" name="file" id="file" onChange={handleChange} />
      <AnimatedButton onClick={handleUpload} loading={uploadingPost}>
        Upload
      </AnimatedButton>
    </div>
  );
}

export default ImgUpload;
