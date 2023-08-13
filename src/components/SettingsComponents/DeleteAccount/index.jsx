import "./index.css";

import { Link, useNavigate } from "react-router-dom";

import { ClickAwayListener } from "@mui/material";
import { db } from "../../../lib/firebase";
import deleteImg from "../../../js/deleteImg";
import firebase from "firebase/compat/app";
import getUserSessionData from "../../../js/userData";
import { useSnackbar } from "notistack";
import { useState } from "react";

const DeleteAccount = ({ user }) => {
  const [deleteAcc, setDeleteAcc] = useState(false);
  const [pass, setPass] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Function to handle delete account in firebase auth
  async function handleConfirmDelete() {
    const providerName = user?.providerData[0]?.providerId;
    if (providerName) {
      //Signed in using OAuth Provider
      let provider;
      setIsDeleting(true);

      if (providerName === "google.com") {
        provider = new firebase.auth.GoogleAuthProvider();
      } else {
        provider = new firebase.auth.FacebookAuthProvider();
      }
      try {
        await user.reauthenticateWithPopup(provider);
        await handleDeleteAcc();
      } catch (err) {
        enqueueSnackbar(`Error: ${err}`, {
          variant: "error",
        });
        setIsDeleting(false);
      }
    } else if (user?.email && pass !== "") {
      //Signed In using Email and Password
      setIsDeleting(true);
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        pass,
      );
      try {
        await user.reauthenticateWithCredential(credential);
        await handleDeleteAcc();
      } catch (err) {
        enqueueSnackbar(`Error: ${err}`, {
          variant: "error",
        });
        setIsDeleting(false);
      }
    } else {
      enqueueSnackbar(`Error: Invalid credentials`, {
        variant: "error",
      });
    }
  }

  async function handleDeleteAcc() {
    let imagesArr = [];
    try {
      const batch = db.batch();

      const userData = await getUserSessionData();

      if (userData) {
        if (userData.photoURL) imagesArr.push(userData.photoURL);
        if (userData.bgImageUrl) imagesArr.push(userData.bgImageUrl);
      }
      batch.delete(userDocRef);

      // Step 2: Delete all posts where uid === user.uid from the posts collection
      const postsSnapshot = await db
        .collection("posts")
        .where("uid", "==", user?.uid)
        .get();

      if (!postsSnapshot.empty) {
        postsSnapshot.forEach((postDoc) => {
          const postImages = postDoc.data().imageUrl;
          if (postImages && postImages !== "") {
            const arr = JSON.parse(postImages);
            if (arr) {
              arr.forEach((img) => {
                imagesArr.push(img.imageUrl);
              });
            }
          }
          batch.delete(postDoc.ref);
        });
      }

      // Commit the batch
      await batch.commit();

      // Step 3: Delete user from authentication
      await user.delete();

      // Step 4: Delete images from cloud
      const deleteImagePromises = imagesArr.map(async (img) => {
        if (img === "") return;
        try {
          await deleteImg(img);
        } catch (err) {
          console.error(`Error deleting image: ${err}`);
        }
      });

      await Promise.all(deleteImagePromises);

      localStorage.removeItem("user");
      navigate("/dummygram/login");
      enqueueSnackbar("User deleted successfully", {
        variant: "success",
      });
    } catch (err) {
      console.error(`Error handling delete: ${err}`);
      enqueueSnackbar(`Error: ${err}`, {
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="delete_account_main_container">
        <div className="delete_account_sub_container">
          <div className="delete_account_heading">
            <h1>Delete Your Account</h1>
            <p>We're sorry to see you leaving</p>
          </div>

          <div className="delete_account_body">
            <h3 className="delete_account_body_heading">Before you go...</h3>
            <ul className="delete_account_body_list">
              <li>
                If you're sick of getting email notification{" "}
                <Link>disable them here.</Link>
              </li>
              <li>
                If you want to change username you can{" "}
                <Link>do that here.</Link>
              </li>
              <li>
                Account deletion is final. There will be no way to restore your
                account.
              </li>
            </ul>
          </div>
          <div className="delete_account_action_btn_container">
            <button
              className="delete_account_action_btn delete_account_action_delete_btn"
              onClick={() => {
                if (user?.providerData[0]?.providerId) {
                  handleConfirmDelete();
                } else {
                  setDeleteAcc(true);
                }
              }}
            >
              Delete my account
            </button>
          </div>
        </div>
      </div>

      {deleteAcc && (
        <ClickAwayListener onClickAway={() => setDeleteAcc(false)}>
          <div className="delete_acc_pass">
            <label htmlFor="user-password">Enter Your Password:</label>
            <input
              type="password"
              name="user-password"
              id="user-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <button
              className={`confirm_delete_acc_btn ${
                isDeleting ? "disable_confirm_btn" : ""
              }`}
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              Confirm
            </button>
          </div>
        </ClickAwayListener>
      )}
    </>
  );
};

export default DeleteAccount;
