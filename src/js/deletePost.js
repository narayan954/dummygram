import { db, storage } from "../lib/firebase";
import { playErrorSound, playSuccessSound } from "./sounds";

import firebase from "firebase/compat/app";

export default async function deletePost(
  uid,
  postId,
  imageUrl,
  enqueueSnackbar,
  setOpen,
) {
  try {
    await db
      .runTransaction(async (transaction) => {
        //Delete doc ref from user doc
        const docRef = db.collection("users").doc(uid);
        transaction.update(docRef, {
          posts: firebase.firestore.FieldValue.arrayRemove(postId),
        });

        // Delete the post document
        const postRef = db.collection("posts").doc(postId);
        transaction.delete(postRef);
      })
      .then(async () => {
        if (imageUrl !== "") {
          const url = JSON.parse(imageUrl);
          const deleteImagePromises = url.map(({ imageUrl }) => {
            const imageRef = storage.refFromURL(imageUrl);
            return imageRef.delete();
          });
          await Promise.all(deleteImagePromises);
        }
      })
      .then(() => {
        playSuccessSound();
        enqueueSnackbar("Post deleted successfully!", { variant: "success" });
        setOpen(false);
      });
  } catch (error) {
    playErrorSound();
    enqueueSnackbar(`Error deleting post: ${error}`, { variant: "error" });
  }
}
