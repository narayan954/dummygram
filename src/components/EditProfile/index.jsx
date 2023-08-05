import "./index.css";

import { auth, db, storage } from "../../lib/firebase";
import { useRef, useState } from "react";

import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import { ClickAwayListener } from "@mui/material";
import deleteImg from "../../js/deleteImg";
import EditIcon from "@mui/icons-material/Edit";
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

  const [image, setImage] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(true);

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

  const handleImgSave = () => {
    if (!usernameAvailable) {
      return;
    }
    const oldImg = userData.avatar;
    if (image) {
      const uploadTask = storage.ref(`images/${image?.name}`).put(image);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          // playErrorSound();
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
              //Updating profile data in auth
              await auth.currentUser.updateProfile({
                displayName: name,
                photoURL: url,
              });

              //Updating profile data in users collection
              const docRef = db.collection("users").doc(uid);
              await docRef.update({
                photoURL: url,
                name: name,
                username: newUsername,
                bio: bio,
                country: country,
              });

              //Updating profile data in all posts
              const postsRef = db.collection("posts").where("uid", "==", uid);
              await postsRef.get().then((postsSnapshot) => {
                postsSnapshot.forEach((post) => {
                  const postRef = post.ref;
                  postRef.update({
                    avatar: url,
                    displayName: name,
                    username: newUsername,
                  });
                });
              });

              await deleteImg(oldImg);
            })
            .then(
              enqueueSnackbar("Upload Successfull", {
                variant: "success",
              }),
            )
            .then(() => setUserData(editedData))
            .catch((error) => {
              enqueueSnackbar(error, {
                variant: "error",
              });
            })
            .finally(() => {
              setIsEditing(false);
            });
        },
      );
    } else {
      async function upload() {
        //Updating profile data in auth
        await auth.currentUser.updateProfile({
          displayName: name,
        });

        //Updating profile data in users collection
        const docRef = db.collection("users").doc(uid);
        await docRef.update({
          name: name,
          username: newUsername,
          bio: bio,
          country: country,
        });

        //Updating profile data in all posts
        const postsRef = db.collection("posts").where("uid", "==", uid);
        await postsRef
          .get()
          .then((postsSnapshot) => {
            postsSnapshot.forEach((post) => {
              const postRef = post.ref;
              postRef.update({
                displayName: name,
                username: newUsername,
              });
            });
          })
          .then(
            enqueueSnackbar("Upload Successfull", {
              variant: "success",
            }),
          )
          .then(() => setUserData(editedData))
          .then(() => navigate(`/dummygram/user/${newUsername}`))
          .catch((error) => {
            enqueueSnackbar(error, {
              variant: "error",
            });
          })
          .finally(() => {
            setIsEditing(false);
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
              <span className="edit-profile-save-btn" onClick={handleImgSave}>
                Save
              </span>
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
            <EditIcon className="edit-profile-image-icon" />
            <label htmlFor="file">
              <img src={avatar} alt={name} className="edit-profile-img" />
            </label>
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
