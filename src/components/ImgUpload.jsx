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
                username: props.username,
                avatar: "avatar",
              });
              setProgress(0);
              setCaption("");
              setImage(null);
            });
        }
      );
    }
    else {
      db.collection("posts").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        caption: caption,
        imageUrl: "",
        username: props.username,
        avatar: "avatar",
      })
      setProgress(0);
      setCaption("");
      setImage(null);
    }
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
      <input type="file" name="file" id="file" onChange={handleChange} />
      <AnimatedButton onClick={handleUpload} loading={uploadingPost}>
        Upload
      </AnimatedButton>
    </div>
  );
}

export default ImgUpload;
