import "./index.css";

import { auth, db, storage } from "../../lib/firebase";
import { playErrorSound, playSuccessSound } from "../../js/sounds";
import { useRef, useState } from "react";

import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import { ClickAwayListener } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import blankImg from "../../assets/blank-profile.webp";
import deleteImg from "../../js/deleteImg";
import { setUserSessionData } from "../../js/userData";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const EditProfile = ({ userData, username, setIsEditing, setUserData }) => {
  const [editedData, setEditedData] = useState({
    name: userData.name,
    newUsername: username,
    bio: userData.bio,
    country: userData.country,
    avatar: userData.avatar,
    uid: userData.uid,
  });

  const user = auth?.currentUser;

  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [error, setError] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const usernameRef = useRef("");
  const { name, newUsername, bio, country, uid, avatar } = editedData;
  const navigate = useNavigate();

  function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const checkUsername = () => {
    const name = usernameRef.current;
    const regex = /^[a-z][a-z0-9_]{4,20}$/;
    if (!regex.test(name)) {
      setUsernameAvailable(false);
    } else {
      const debouncedFunction = debounce(findUsernameInDB);
      debouncedFunction();
    }
  };

  const findUsernameInDB = async () => {
    const newName = usernameRef.current; // Assuming `usernameRef.current` contains the document ID
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("username", "==", newName).get();
    if (querySnapshot.empty) {
      setUsernameAvailable(true);
    } else {
      setUsernameAvailable(false);
    }
  };

  function handleChange(e) {
    setEditedData((prevFormData) => {
      return {
        ...prevFormData,
        [e.target.name]: e.target.value,
      };
    });
  }
  const handleImgChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setEditedData((prevData) => ({
        ...prevData,
        avatar: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  function handleImgDelete() {
    setImage("");
    setEditedData((prevData) => ({
      ...prevData,
      avatar: "",
    }));
  }

  async function updateUser(url) {
    try {
      const batch = db.batch();

      // Update profile data in authentication (auth)
      await auth.currentUser.updateProfile({
        displayName: name,
        photoURL: url,
      });

      // Update profile data in users collection
      const userRef = db.collection("users").doc(uid);
      const userData = {
        photoURL: url,
        name: name,
        username: newUsername,
        bio: bio,
        country: country,
      };
      setUserSessionData(userData);
      batch.update(userRef, userData);

      // Update profile data in all posts
      const postsRef = db.collection("posts").where("uid", "==", uid);
      const postsSnapshot = await postsRef.get();
      postsSnapshot.forEach((post) => {
        const postRef = post.ref;
        batch.update(postRef, {
          avatar: url,
          displayName: name,
          username: newUsername,
        });
      });

      // Commit the batch
      await batch.commit();
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsUploading(false);
      throw error;
    }
  }
  function validInputs() {
    if (editedData.name === "") {
      setError("**Name is Required!");
    } else if (editedData.newUsername === "") {
      setError("**User name is Required!");
    } else {
      setError("");
      return true;
    }
  }
  const handleProfileUpdate = () => {
    if (!validInputs()) {
      return;
    }
    const oldImg = user.photoURL;
    if (image && typeof image === "object") {
      const uploadTask = storage.ref(`images/${image?.name}`).put(image);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          playErrorSound();
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        },
        () => {
          storage
            .ref("images")
            .child(image?.name)
            .getDownloadURL()
            .then(async (url) => {
              oldImg && (await deleteImg(oldImg));
              await updateUser(url);
            })
            .then(() => {
              setUserData(editedData);
              playSuccessSound();
              enqueueSnackbar("Upload Successfull", {
                variant: "success",
              });
            })
            .finally(() => {
              setIsEditing(false);
              setIsUploading(false);
            });
        },
      );
    } else if (image?.length === 0) {
      async function removeImg() {
        oldImg && (await deleteImg(oldImg));
        await updateUser(image)
          .then(() => {
            setUserData(editedData);
            playSuccessSound();
            enqueueSnackbar("Upload Successfull", {
              variant: "success",
            });
          })
          .finally(() => {
            setIsEditing(false);
            setIsUploading(false);
          });
      }
      removeImg();
    } else {
      async function upload() {
        await updateUser(oldImg)
          .then(() => {
            setUserData(editedData);
            navigate(`/dummygram/user/${newUsername}`);
            playSuccessSound();
            enqueueSnackbar("Upload Successfull", {
              variant: "success",
            });
          })
          .finally(() => {
            setIsEditing(false);
            setIsUploading(false);
          });
      }
      upload();
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setIsEditing(false)}>
      <div className="edit-profile-container">
        <div className="edit-profile-sub-container">
          <div className="edit-profile-header">
            <BackIcon
              onClick={() => setIsEditing(false)}
              style={{ display: "flex", marginTop: "6px", cursor: "pointer" }}
            />
            <h2>Edit Profile</h2>
            <div>
              <button
                className="edit-profile-save-btn"
                onClick={() => {
                  handleProfileUpdate();
                  setIsUploading(true);
                }}
                disabled={isUploading}
              >
                Save
              </button>
            </div>
          </div>
          <div className="edit-profile-image">
            <input
              type="file"
              id="file"
              className="file"
              onChange={handleImgChange}
              accept="image/*"
            />
            <label htmlFor="file">
              <EditIcon className="edit-profile-image-icon" />
            </label>
            <img
              src={avatar?.length > 0 ? avatar : blankImg}
              alt={name}
              className="edit-profile-img"
            />
            {user?.photoURL?.length > 0 && (
              <button className="delete_dp_btn" onClick={handleImgDelete}>
                <DeleteIcon /> Remove DP
              </button>
            )}
          </div>
          <div className="edit-user-details">
            {/* name  */}
            <div className="user-field">
              <label defaultValue={"Name"}>
                <p className="edit-profile-label">Name</p>
                <input
                  type="text"
                  value={name}
                  name="name"
                  className="edit-profile-input name-input"
                  onChange={handleChange}
                />
                {error === "**Name is Required!" && (
                  <small className="errorMsg">*Name is required!</small>
                )}
              </label>
            </div>
            {/* username  */}
            <div className="user-field">
              <label htmlFor="">
                <p className="edit-profile-label">Username</p>
                <input
                  type="text"
                  value={newUsername}
                  name="newUsername"
                  className={`edit-profile-input username-input ${
                    usernameAvailable ? "" : "error-border"
                  }`}
                  ref={usernameRef}
                  onChange={(e) => {
                    usernameRef.current = e.target.value.trim();
                    handleChange(e);
                    checkUsername();
                  }}
                />
                {error === "**User name is Required!" && (
                  <small className="errorMsg">*User name is required!</small>
                )}
              </label>
            </div>
            {/* country  */}
            <div className="user-field">
              <label htmlFor="">
                <p className="edit-profile-label">Country</p>
                <input
                  type="text"
                  name="country"
                  value={country}
                  className="edit-profile-input country-input"
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
          {/* bio */}
          <label htmlFor="">
            <p style={{ paddingTop: "0" }} className="edit-profile-label">
              Bio
            </p>
            <textarea
              name="bio"
              id=""
              // cols="30"
              // rows="10"
              maxLength={170}
              value={bio}
              className="edit-profile-input edit-profile-bio"
              onChange={handleChange}
            ></textarea>
          </label>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default EditProfile;
