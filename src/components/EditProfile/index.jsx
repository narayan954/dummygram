import "./index.css";

import { auth, db, storage } from "../../lib/firebase";
import { useRef, useState } from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const EditProfile = ({ userData, username, setIsEditing, setUserData }) => {
  const [editedData, setEditedData] = useState({
    name: userData.name,
    newUsername: username,
    bio: userData.bio,
    country: userData.country,
    avatar: userData.avatar,
    uid: userData.uid
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
    const regex = /^[A-Za-z][A-Za-z0-9_]{4,17}$/gi;
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
        [e.target.name]: e.target.value
      };
    });
  }
  const handleImgChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setEditedData((prevData) => ({
        ...prevData,
        avatar: URL.createObjectURL(e.target.files[0])
      }));
    }
  };

  const handleImgSave = () => {
    if (!usernameAvailable) {
      return;
    }
    if (image) {
      const uploadTask = storage.ref(`images/${image?.name}`).put(image);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          // playErrorSound();
          enqueueSnackbar(error.message, {
            variant: "error"
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
                photoURL: url
              });

              //Updating profile data in users collection
              const docRef = db.collection("users").doc(uid);
              await docRef.update({
                photoURL: url,
                name: name,
                username: newUsername,
                bio: bio,
                country: country
              });

              //Updating profile data in all posts
              const postsRef = db.collection("posts").where("uid", "==", uid);
              await postsRef.get().then((postsSnapshot) => {
                postsSnapshot.forEach((post) => {
                  const postRef = post.ref;
                  postRef.update({
                    avatar: url,
                    displayName: name,
                    username: newUsername
                  });
                });
              });
            })
            .then(
              enqueueSnackbar("Upload Successfull", {
                variant: "success"
              })
            )
            .then(() => setUserData(editedData))
            .catch((error) => {
              enqueueSnackbar(error, {
                variant: "error"
              });
            })
            .finally(() => {
              setIsEditing(false);
            });
        }
      );
    } else {
      async function upload() {
        //Updating profile data in auth
        await auth.currentUser.updateProfile({
          displayName: name
        });

        //Updating profile data in users collection
        const docRef = db.collection("users").doc(uid);
        await docRef.update({
          name: name,
          username: newUsername,
          bio: bio,
          country: country
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
                username: newUsername
              });
            });
          })
          .then(
            enqueueSnackbar("Upload Successfull", {
              variant: "success"
            })
          )
          .then(() => setUserData(editedData))
          .then(() => navigate(`/dummygram/user/${newUsername}`))
          .catch((error) => {
            enqueueSnackbar(error, {
              variant: "error"
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
    <div className="edit-profile-container">
      <div className="edit-profile-sub-container">
        <CancelIcon
          className="cancel-editing-icon"
          onClick={() => setIsEditing(false)}
        />
        <div>
          <input
            type="file"
            id="file"
            className="file"
            onChange={handleImgChange}
            accept="image/*"
          />
          <label htmlFor="file">
            <img src={avatar} alt={name} className="edit-profile-img" />
          </label>
        </div>

        {/* name  */}
        <label defaultValue={"Name"}>
          <p className="edit-profile-label">Name</p>
          <input
            type="text"
            value={name}
            name="name"
            className="edit-profile-input"
            onChange={handleChange}
          />
        </label>
        {/* username  */}
        <label htmlFor="">
          <p className="edit-profile-label">Username</p>
          <input
            type="text"
            value={newUsername}
            name="newUsername"
            className={`edit-profile-input ${
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
        {/* bio */}
        <label htmlFor="">
          <p className="edit-profile-label">Bio</p>
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
        {/* country  */}
        <label htmlFor="">
          <p className="edit-profile-label">Country</p>
          <input
            type="text"
            name="country"
            value={country}
            className="edit-profile-input"
            onChange={handleChange}
          />
        </label>
        <div>
          <button className="edit-profile-save-btn" onClick={handleImgSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
