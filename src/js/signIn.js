import { auth, db, facebookProvider, googleProvider } from "../lib/firebase";
import { playErrorSound, playSuccessSound } from "./sounds";

const signInWithOAuth = (e, enqueueSnackbar, navigate, google = true) => {
  e.preventDefault();
  const provider = google ? googleProvider : facebookProvider;
  auth
    .signInWithPopup(provider)
    .then(async (val) => {
      const userRef = db.collection("users").where("uid", "==", val?.user?.uid);

      const docSnap = await userRef.get();
      if (docSnap.docs.length < 1) {
        const usernameDoc = db.collection("users");
        await usernameDoc.doc(auth.currentUser.uid).set({
          uid: val.user.uid,
          username: val.user.uid,
          name: val.user.displayName,
          photoURL: val.user.photoURL,
          displayName: val.user.displayName,
          Friends: [],
          posts: [],
        });
      } else if (!docSnap.docs[0].data().username) {
        docSnap.docs[0].ref.update({
          username: doc.data().uid,
        });
      }
      playSuccessSound();
      enqueueSnackbar("Login successful!", {
        variant: "success",
      });
      navigate("/dummygram");
    })
    .catch((error) => {
      if (error.code === "auth/account-exists-with-different-credential") {
        playErrorSound();
        enqueueSnackbar("Account exists with a different credential", {
          variant: "error",
        });
      } else {
        playErrorSound();
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
    });
};

export default signInWithOAuth;
