import "./index.css";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Modal,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { auth, db, storage } from "../../lib/firebase";
import { backBtnSound, successSound } from "../../assets/sounds";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { lazy, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ErrorBoundary } from "../../reusableComponents/errorBoundary";
import { FaUserCircle } from "react-icons/fa";
import firebase from "firebase/compat/app";
import { useSnackbar } from "notistack";

const Post = lazy(() => import("../../components/Post"));
const SideBar = lazy(() => import("../../components/SideBar"));

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 768px)");
  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState(null);
  const [image, setImage] = useState("");
  const [visible, setVisible] = useState(false);
  const [feed, setFeed] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  let uid = location?.state?.uid || user?.uid;

  function playSuccessSound() {
    new Audio(successSound).play();
  }

  function playErrorSound() {
    new Audio(errorSound).play();
  }

  const handleClose = () => setOpen(false);

  const handleSendFriendRequest = () => {
    const currentUser = auth.currentUser;
    const currentUserUid = currentUser.uid;
    const targetUserUid = uid;
    if (friendRequestSent) {
      db.collection("users")
        .doc(targetUserUid)
        .collection("friendRequests")
        .doc(currentUserUid)
        .delete()
        .then(() => {
          db.collection("users")
            .doc(targetUserUid)
            .collection("notifications")
            .doc(currentUserUid)
            .delete()
            .then(() => {
              enqueueSnackbar("Friend Request removed successfully!", {
                variant: "success",
              });
              setFriendRequestSent(false);
            });
        });
    } else {
      const friendRequestData = {
        sender: currentUserUid,
        recipient: targetUserUid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      db.collection("users")
        .doc(targetUserUid)
        .collection("friendRequests")
        .doc(currentUserUid)
        .set(friendRequestData)
        .then(() => {
          setFriendRequestSent(true);
          playSuccessSound();
          enqueueSnackbar("Friend request sent!", {
            variant: "success",
          });
          const notificationData = {
            recipient: targetUserUid,
            sender: currentUserUid,
            message: `You have received a friend request from ${auth?.currentUser?.displayName}.`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };
          db.collection("users")
            .doc(targetUserUid)
            .collection("notifications")
            .doc(currentUserUid)
            .set(notificationData);
        })
        .catch((error) => {
          playErrorSound();
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        });
    }
  };

  useEffect(() => {
    const checkFriendRequestSent = async () => {
      const currentUser = auth.currentUser;
      const currentUserUid = currentUser.uid;
      const targetUserUid = uid;
      const friendRequestsRef = db
        .collection("users")
        .doc(targetUserUid)
        .collection("friendRequests");
      const query = friendRequestsRef
        .where("sender", "==", currentUserUid)
        .where("recipient", "==", targetUserUid)
        .limit(1);

      const snapshot = await query.get();
      if (!snapshot.empty) {
        setFriendRequestSent(true);
      }
    };
    checkFriendRequestSent();
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
    } else {
      navigate("/dummygram/login");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setName(location?.state?.name || authUser.displayName);
        setAvatar(location?.state?.avatar || authUser.photoURL);
        setEmail(
          location?.state?.name === authUser?.displayName
            ? location?.state?.email || authUser.email
            : ""
        );
        uid = location?.state?.uid || authUser.uid;
      } else {
        navigate("/dummygram/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  //Get username from usernames collection
  useEffect(() => {
    const usernameQ = query(
      collection(db, "users"),
      where("uid", "==", auth.currentUser.uid)
    );
    const unsubscribe = onSnapshot(usernameQ, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUsername(doc.username);
      });
    });
  }, []);

  // Get user's posts from posts collection
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("username", "==", location?.state?.name || name)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userPosts = [];
      querySnapshot.forEach((doc) => {
        userPosts.push({
          id: doc.id,
          post: doc.data(),
        });
      });
      setFeed(userPosts);
    });
  }, [user, name]);

  const handleBack = () => {
    new Audio(backBtnSound).play();
    navigate("/dummygram");
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
      setVisible(true);
    }
  };

  const handleSave = () => {
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
          .then((url) => {
            auth.currentUser.updateProfile({
              displayName: name,
              photoURL: url,
            });
            playSuccessSound();
            enqueueSnackbar("Upload Successful!!!", {
              variant: "success",
            });
          });
      }
    );
    setVisible(false);
  };

  return (
    <>
      <ErrorBoundary>
        <SideBar />
      </ErrorBoundary>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${isNonMobile ? "40vw" : "80vw"}`,
            height: `${isNonMobile ? "40vw" : "80vw"}`,
            boxShadow: 24,
            backdropFilter: "blur(7px)",
            border: "1px solid #fff",
            zIndex: "1000",
            textAlign: "center",
            borderRadius: "5%",
          }}
        >
          <img
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              margin: 0,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            width={isNonMobile ? "50%" : "50%"}
            height={isNonMobile ? "50%" : "50%"}
            src={profilePic}
            alt="user"
          />
        </Box>
      </Modal>

      <Box
        width={isNonMobile ? "30%" : "70%"}
        backgroundColor="var(--profile-container)"
        paddingY={5}
        paddingX={6}
        sx={{
          border: "none",
          boxShadow: "var(--profile-box-shadow)",
          margin: "6rem auto 2.5rem",
        }}
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
        color="var(--color)"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box marginX="auto" fontSize="600%">
            {avatar ? (
              <Avatar
                onClick={() => setOpen((on) => !on)}
                alt={name}
                src={profilePic}
                sx={{
                  width: "22vh",
                  height: "22vh",
                  bgcolor: "black",
                  border: "none",
                  boxShadow: "0 0 4px black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              />
            ) : (
              <FaUserCircle style={{ width: "22vh", height: "22vh" }} />
            )}
          </Box>
          {name === auth.currentUser.displayName && (
            <Box>
              <input
                type="file"
                id="file"
                className="file"
                onChange={handleChange}
                accept="image/*"
              />
              <label htmlFor="file">
                <div
                  className="img-edit"
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  Edit Profile Pic
                </div>
              </label>
            </Box>
          )}
          {visible && (
            <Button
              onClick={handleSave}
              variant="outlined"
              sx={{ marginTop: "1rem" }}
            >
              Save
            </Button>
          )}
          {/* <Divider
            sx={{ marginTop: "1rem", background: "var(--profile-divider)" }}
          /> */}
          <Typography fontSize="1.3rem" fontWeight="600">
            {username}
          </Typography>
          <Divider style={{ background: "var(--profile-divider)" }} />
          <Typography fontSize="1.3rem" fontWeight="600">
            {name}
          </Typography>
          <Typography fontSize="1rem">Total Posts: {feed.length}</Typography>
          <Divider style={{ background: "var(--profile-divider)" }} />
          <Typography fontSize="1.5rem" fontWeight="600">
            {name === auth.currentUser.displayName && email}
          </Typography>
          {name !== auth.currentUser.displayName && (
            <Button
              onClick={handleSendFriendRequest}
              variant="contained"
              color="primary"
              sx={{ marginTop: "1rem" }}
            >
              {friendRequestSent ? "Remove friend request" : "Add Friend"}
            </Button>
          )}
          <Button
            onClick={handleBack}
            variant="contained"
            color="primary"
            sx={{ marginTop: "1rem" }}
            fontSize="1.2rem"
          >
            Back
          </Button>
        </Box>
      </Box>
      <Box className="flex feed-main-container">
        <div className="app__posts" id="feed-sub-container">
          <ErrorBoundary>
            {feed.map(({ post, id }) => (
              <Post
                rowMode={true}
                key={id}
                postId={id}
                user={user}
                post={post}
                shareModal={true}
                setLink="/"
                setPostText=""
              />
            ))}
          </ErrorBoundary>
        </div>
      </Box>
    </>
  );
}

export default Profile;
