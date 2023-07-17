import "./index.css";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { auth, db, storage } from "../../lib/firebase";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import profileBackgroundImg from "../../assets/profile-background.jpg"
import { getModalStyle, useStyles } from "../../App";
import { lazy, useEffect, useState } from "react";
import {
  playErrorSound,
  playSuccessSound,
  playTapSound,
} from "../../js/sounds";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AnimatedButton } from "../../reusableComponents";
import ErrorBoundary from "../../reusableComponents/ErrorBoundary";
import { FaUserCircle } from "react-icons/fa";
import LogoutIcon from "@mui/icons-material/Logout";
import Modal from "@mui/material/Modal";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewsCounter from "./views";
import firebase from "firebase/compat/app";
import logo from "../../assets/logo.webp";
import { useSnackbar } from "notistack";

const Post = lazy(() => import("../../components/Post"));
const SideBar = lazy(() => import("../../components/SideBar"));

function Profile() {
  const classes = useStyles();
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
  const [logout, setLogout] = useState(false);
  const [username, setUsername] = useState("");
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uid, setUid] = useState(location?.state?.uid || null);

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
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
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
            message: `You have received a friend request`,
            senderName: auth?.currentUser?.displayName,
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
    if (auth.currentUser) {
      const checkFriendRequestSent = async () => {
        const currentUserUid = auth.currentUser.uid;
        const targetUserUid = uid;

        // Add a check to ensure targetUserUid is not empty
        if (targetUserUid) {
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
        }
      };
      checkFriendRequestSent();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setName(location?.state?.name || authUser.displayName);
        setAvatar(location?.state?.avatar || authUser.photoURL);
        setUid(location?.state?.uid || authUser.uid);
      } else {
        navigate("/dummygram/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //Get username from usernames collection
  useEffect(() => {
    async function getUsername(){
      const docRef = doc(db, "users", uid || auth?.currentUser?.uid);
      const docSnap = await getDoc(docRef);
      setUsername(docSnap.data().username)
    }
    getUsername()
  }, []);

  // Get user's posts from posts collection
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("username", "==", location?.state?.name || name),
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
    playTapSound();
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
    setOpen(false);
    const uploadTask = storage.ref(`images/${image?.name}`).put(image);
    uploadTask.on(
      "state_changed",
      () => { },
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
          })
          .catch((error) => console.error(error));
      },
    );
    setVisible(false);
  };

  const signOut = () => {
    auth.signOut().finally();
    playSuccessSound();
    enqueueSnackbar("Logged out Successfully !", {
      variant: "info",
    });
    navigate("/dummygram/");
  };

  return (
    <>
      <ErrorBoundary>
        <SideBar />
      </ErrorBoundary>
      <div className="background-image">
        <img src={profileBackgroundImg} alt="" className="background-image" />
      </div>
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
          {name === user?.displayName ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <img
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                  margin: 0,
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                width={isNonMobile ? "50%" : "50%"}
                height={isNonMobile ? "50%" : "50%"}
                src={avatar}
                alt={name}
              />
              <div
                style={{
                  position: "absolute",
                  top: "70%",
                  left: "50%",
                  transform: "translate(-50%, -30%)",
                  color: "var(--text-secondary)",
                }}
              >
                {name === user?.displayName && (
                  <Box>
                    <input
                      type="file"
                      id="file"
                      className="file"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    <label htmlFor="file">
                      <EditIcon className="edit-image-icon" />
                    </label>
                  </Box>
                )}
                {visible && (
                  <Button
                    className="img-save"
                    onClick={handleSave}
                    variant="outlined"
                    sx={{
                      marginTop: "1rem",
                      padding: "5px 25px",
                    }}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <img
                style={{
                  objectFit: "cover",
                  margin: 0,
                  position: "absolute",
                  height: "90%",
                  width: "90%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "6%",
                  top: "50%",
                  left: "50%",
                }}
                width={isNonMobile ? "50%" : "50%"}
                height={isNonMobile ? "50%" : "50%"}
                src={avatar}
                alt={name}
              />
            </>
          )}
        </Box>
      </Modal>

      <Box
        className="outer-profile-box"
      >
        <Box
          display="flex"
          width="90%"
          flexDirection="column"
          justifyContent="space-between"
          gap={1}
          className="inner-profile"
        >
          <Box
            display="flex"
            marginRight="10px"
            flexDirection="column"
            className="profile-left"
          >
            {avatar ? (
              <Avatar
                onClick={() => setOpen((on) => !on)}
                alt={name}
                src={avatar}
                className="profile-pic-container"
              />
            ) : (
              <FaUserCircle style={{ width: "22vh", height: "22vh" }} />
            )}
            {name === user?.displayName && (
              <Box className="edit-btn">
                <input
                  type="file"
                  id="file"
                  className="file"
                  onChange={handleChange}
                  accept="image/*"
                  style={{cursor: "pointer"}}
                />
                <label htmlFor="file">
                  <EditIcon className="edit-image-icon" />
                </label>
              </Box>
            )}
            {visible && (
              <Button
                className="img-save"
                onClick={handleSave}
                variant="outlined"
                sx={{
                  marginY: "1rem",
                  padding: "5px 25px",
                }}
              >
                Save
              </Button>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            marginTop="10px"
            className="profile-right"
          >
            <Typography className="profile-user-display-name">
              {name}
            </Typography>
            <p className="profile-bio">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus atque eaque mollitia iusto odit! Voluptatum iusto beatae esse exercitationem.
            </p>
            <div className="username-and-location-container">
              <Typography className="profile-user-username">
                {username}
              </Typography>
              <span className="dot-seperator"></span>
              <Typography className="profile-user-username">
                <LocationOnIcon className="location-icon" /> India
              </Typography>
            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <Typography className="posts-views">
                All Posts:&nbsp;
                <span>{feed.length}</span>
              </Typography>
              <Typography className="posts-views">
                Views:&nbsp;
                <span>
                  <ViewsCounter uid={uid} />
                </span>
              </Typography>
            </div>
            {name !== user?.displayName && (
              <Button
                onClick={handleSendFriendRequest}
                variant="contained"
                color="primary"
                sx={{ marginTop: "1rem" }}
              >
                {friendRequestSent ? "Remove friend request" : "Add Friend"}
              </Button>
            )}
            {name === user?.displayName && (
            <Box
              className="setting-logout"
            >
              <Button
                variant="contained"
                startIcon={<SettingsIcon style={{ color: "black" }} />}
                style={{ backgroundColor: "#8beeff" }}
                onClick={() => navigate("/dummygram/settings")}
              >
                <Typography
                  fontSize="1rem"
                  color="black"
                  textTransform="capitalize"
                >
                  Settings
                </Typography>
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<LogoutIcon style={{ color: "black" }} />}
                style={{ backgroundColor: "#8beeff" }}
                onClick={() => setLogout(true)}
              >
                <Typography
                  fontSize="1rem"
                  color="black"
                  textTransform="capitalize"
                >
                  Log Out
                </Typography>
              </Button>
            </Box>)}

            <Modal open={logout} onClose={() => setLogout(false)}>
              <div style={getModalStyle()} className={classes.paper}>
                <form className="modal__signup">
                  <img
                    src={logo}
                    alt="dummygram"
                    className="modal__signup__img"
                    style={{
                      width: "80%",
                      marginLeft: "10%",
                      filter: "var(--filter-img)",
                    }}
                  />

                  <p
                    style={{
                      fontSize: "15px",
                      fontFamily: "monospace",
                      padding: "10%",
                      color: "var(--color)",
                      // marginBottom:800
                    }}
                  >
                    Are you sure you want to Logout?
                  </p>

                  <div className={classes.logout}>
                    <AnimatedButton
                      type="submit"
                      onClick={signOut}
                      variant="contained"
                      color="primary"
                      className="button-style"
                    >
                      Logout
                    </AnimatedButton>
                    <AnimatedButton
                      type="submit"
                      onClick={() => setLogout(false)}
                      variant="contained"
                      color="primary"
                      className="button-style"
                    >
                      Cancel
                    </AnimatedButton>
                  </div>
                </form>
              </div>
            </Modal>
          </Box>
        </Box>
      </Box>
      <Divider style={{ background: "var(--profile-divider)" }} />
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
