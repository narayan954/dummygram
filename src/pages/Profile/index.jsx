import "./index.css";

import { Avatar, Box, Button, Typography, useMediaQuery } from "@mui/material";
import { auth, db, storage } from "../../lib/firebase";
import {
  collection,
  deleteField,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { lazy, useEffect, useState } from "react";
import { playErrorSound, playSuccessSound } from "../../js/sounds";
import { useNavigate, useParams } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import Cam from "@mui/icons-material/CameraAltOutlined";
import { EditProfile } from "../../components";
import ErrorBoundary from "../../reusableComponents/ErrorBoundary";
import { FaUserCircle } from "react-icons/fa";
import { Loader } from "../../reusableComponents";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Modal from "@mui/material/Modal";
import NotFound from "../NotFound";
import ProfieFeed from "./feed";
import { StoryView } from "../../components";
import ViewsCounter from "../../reusableComponents/views";
import firebase from "firebase/compat/app";
import profileBackgroundImg from "../../assets/profile-background.jpg";
import { useSnackbar } from "notistack";

const SideBar = lazy(() => import("../../components/SideBar"));

function Profile() {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 768px)");
  const { enqueueSnackbar } = useSnackbar();
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [feed, setFeed] = useState([]);
  const [open, setOpen] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userExists, setUserExists] = useState(true);
  const [viewStory, setViewStory] = useState(false);
  const [editing, setEditing] = useState(false);
  const [bgimgurl, setBgimgurl] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  let name = "";
  let avatar = "";
  let bgImageUrl = "" ;
  let uid = "";
  let bio = "";
  let country = "";
  let storyTimestamp = null;

  if (userData) {
    name = userData.name;
    avatar = userData.avatar;
    bgImageUrl = userData.bgImageUrl;
    uid = userData.uid;
    bio = userData.bio;
    country = userData.country;
    storyTimestamp = userData.storyTimestamp;
  }

  const handleClose = () => setOpen(false);

  // Inside the Profile component
  const handleBackgroundImgChange = (e) => {
    if (e.target.files[0]) {
      setBackgroundImage(e.target.files[0]);
      setEditing(true);
    }
  };

  const handleBgImageSave = () => {
    try {
      if (backgroundImage) {
        const uploadTask = storage
          .ref(`background-images/${backgroundImage.name}`)
          .put(backgroundImage);
        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          },
          () => {
            storage
              .ref("background-images")
              .child(backgroundImage.name)
              .getDownloadURL()
              .then(async (url) => {
                setBgimgurl(url);
                const docRef = db.collection("users").doc(uid);
                await docRef.update({
                  bgImageUrl: url,
                });
              })
              .then(
                enqueueSnackbar("Background image uploaded successfully !", {
                  variant: "success",
                }),
              )
              .catch((error) => {
                enqueueSnackbar(error.message, {
                  variant: "error",
                });
              });
          },
        );
      }
      setEditing(false);
    } catch (error) {
      console.error("Error saving background image URL to Firestore:", error);
    }
  };

  useEffect(() => {
    async function getUserData() {
      const docRef = db
        .collection("users")
        .where("username", "==", username)
        .limit(1);
      docRef
        .get()
        .then((snapshot) => {
          if (snapshot.docs) {
            const doc = snapshot.docs[0];
            const currTimestamp = firebase.firestore.Timestamp.now().seconds;
            const storyTimestamp = doc.data().storyTimestamp?.seconds;
            //Check if story is expired or not
            if (storyTimestamp && currTimestamp - storyTimestamp > 86400) {
              async function deleteStory() {
                const querySnapshot = await db
                  .collection("story")
                  .where("username", "==", username)
                  .get();

                // Delete the story that are expired
                querySnapshot?.forEach((doc) => {
                  doc.ref.delete().catch((error) => {
                    console.error("Error deleting document: ", error);
                  });
                });

                const docRef = doc.ref;
                docRef.update({
                  storyTimestamp: deleteField(),
                });
              }
              deleteStory();
            }
            const data = doc.data();
            setUserData({
              name: data.name,
              avatar: data.photoURL,
              bgImageUrl: data.bgImageUrl
                ? data.bgImageUrl
                : profileBackgroundImg,
              uid: data.uid,
              bio: data.bio
                ? data.bio
                : "Lorem ipsum dolor sit amet consectetur",
              country: data.country ? data.country : "Global",
              storyTimestamp: data.storyTimestamp,
            });
          } else {
            setUserExists(false);
          }
        })
        .catch((error) => {
          enqueueSnackbar(`Error Occured: ${error}`, {
            variant: "error",
          });
        });
    }
    getUserData();
  }, [username, bgimgurl]);

  const handleSendFriendRequest = () => {
    const currentUserUid = auth.currentUser.uid;
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
            .catch((error) => {
              enqueueSnackbar(`Error Occured: ${error}`, {
                variant: "error",
              });
            });
        })
        .catch((error) => {
          enqueueSnackbar(`Error Occured: ${error}`, {
            variant: "error",
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
            message: "You have received a friend request",
            senderName: name,
            username: username,
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
      } else {
        navigate("/dummygram/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Get user's posts from posts collection
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("uid", "==", uid),
      orderBy("timestamp", "desc"),
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

    return () => {
      unsubscribe();
    };
  }, [user, name]);

  return (
    <>
      <ErrorBoundary>
        <SideBar />
      </ErrorBoundary>
      {viewStory && (
        <StoryView
          username={username}
          setViewStory={setViewStory}
          setUserData={setUserData}
        />
      )}
      {isEditing && (
        <EditProfile
          userData={userData}
          username={username}
          setIsEditing={setIsEditing}
          setUserData={setUserData}
        />
      )}
      {userData && userExists ? (
        <>
        <div>
          <div className="background-image-container" style={{ position: "relative" }}>
            <img
              src={ bgImageUrl || profileBackgroundImg}
              alt=""
              className="background-image"
            />
            {uid === user?.uid && (
              <div
                className="bg-img-save"
                style={{ position: "absolute", }}
              >
                <div className="bg-icon">
                  <input
                    type="file"
                    id="backgroundImage"
                    className="file"
                    onChange={handleBackgroundImgChange}
                    accept="image/*"
                  />
                  <label htmlFor="backgroundImage">
                    <Cam sx={{ fontSize: 33 }} />
                  </label>
                </div>
                {editing && (
                  <div className="bg-save-btn" style={{position: "absolute", }}>
                    <Button variant="outlined" onClick={handleBgImageSave}>Save</Button>
                  </div>
                )}
              </div>
            )}
          </div>
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
              {uid === user?.uid ? (
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
                    {uid === user?.uid && (
                      <Box className="edit-btn">
                        <EditIcon className="edit-image-icon" />
                      </Box>
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

          <Box className="outer-profile-box">
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
                    onClick={() => {
                      if (storyTimestamp) {
                        setViewStory(true);
                      }
                    }}
                    alt={name}
                    src={avatar}
                    className={`profile-pic-container ${
                      storyTimestamp ? "story_available_border" : null
                    }`}
                  />
                ) : (
                  <FaUserCircle className="profile-pic-container" />
                )}
                {uid === user?.uid && (
                  <Box className="edit-btn">
                    <EditIcon
                      className="edit-image-icon"
                      onClick={() => setIsEditing(true)}
                    />
                  </Box>
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
                <p className="profile-bio">{bio}</p>
                <div className="username-and-location-container">
                  <Typography className="profile-user-username">
                    {username}
                  </Typography>
                  <span className="dot-seperator"></span>
                  <Typography className="profile-user-username">
                    <LocationOnIcon className="location-icon" /> {country}
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
                {uid !== user?.uid && (
                  <Button
                    onClick={() =>
                      user.isAnonymous
                        ? navigate("/dummygram/signup")
                        : handleSendFriendRequest()
                    }
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "1rem" }}
                  >
                    {friendRequestSent ? "Remove friend request" : "Add Friend"}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
          <ProfieFeed feed={feed} user={user} />
        </>
      ) : userExists ? (
        <Loader />
      ) : (
        <NotFound />
      )}
    </>
  );
}

export default Profile;
