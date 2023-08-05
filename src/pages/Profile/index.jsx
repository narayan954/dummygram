import "./index.css";

import { Avatar, Box, Button, Typography } from "@mui/material";
import { auth, db, storage } from "../../lib/firebase";
import {
  collection,
  deleteField,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { lazy, useEffect, useRef, useState } from "react";
import { playErrorSound, playSuccessSound } from "../../js/sounds";
import { useNavigate, useParams } from "react-router-dom";

import BookmarksIcon from "@mui/icons-material/Bookmarks";
import Cam from "@mui/icons-material/CameraAltOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { EditProfile } from "../../components";
import ErrorBoundary from "../../reusableComponents/ErrorBoundary";
import { FaUserCircle } from "react-icons/fa";
import GridOnIcon from "@mui/icons-material/GridOn";
import { Loader } from "../../reusableComponents";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotFound from "../NotFound";
import ProfieFeed from "./feed";
import { StoryView } from "../../components";
import ViewsCounter from "../../reusableComponents/views";
import deleteImg from "../../js/deleteImg";
import firebase from "firebase/compat/app";
import profileBackgroundImg from "../../assets/profile-background.jpg";
import { useSnackbar } from "notistack";

const SideBar = lazy(() => import("../../components/SideBar"));

function Profile() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [feed, setFeed] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  // const [open, setOpen] = useState(false);
  const [isSavedPostsLoading, setIsSavedPostsLoading] = useState(true);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userExists, setUserExists] = useState(true);
  const [viewStory, setViewStory] = useState(false);
  const [editing, setEditing] = useState(false);
  const [bgimgurl, setBgimgurl] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  const bgRef = useRef(null);

  let name = "";
  let avatar = "";
  let bgImageUrl = "";
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

  // Inside the Profile component
  const handleBackgroundImgChange = (e) => {
    if (e.target.files[0]) {
      setBackgroundImage(e.target.files[0]);
      setEditing(true);
    }
  };

  const handleBgImageSave = () => {
    try {
      const oldImg = bgImageUrl;
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
                await deleteImg(oldImg);
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
    const bg = bgRef.current;
    function handleScroll() {
      bg.style.height = 100 + +window.scrollY / 16 + "%";
      bg.style.width = 100 + +window.scrollY / 16 + "%";
      bg.style.opacity = 1 - +window.scrollY / 500 + "";
    }
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  });

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

  async function getSavedPosts() {
    let savedPostsArr = JSON.parse(localStorage.getItem("posts")) || [];
    const posts = [];
    if (savedPostsArr.length > 0 && savedPosts.length === 0) {
      try {
        const fetchSavedPosts = savedPostsArr.map(async (id) => {
          try {
            const docRef = doc(db, "posts", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              posts.push({ id: docSnap.id, post: docSnap.data() });
            }
          } catch (error) {
            console.log(error, "err");
            enqueueSnackbar("Error while fetching all posts", {
              variant: "error",
            });
          } finally {
            setIsSavedPostsLoading(false);
          }
        });
        await Promise.all(fetchSavedPosts); // Wait for all fetch requests to complete
        setSavedPosts(posts);
      } catch (error) {
        enqueueSnackbar("Error while fetching all posts", {
          variant: "error",
        });
      } finally {
        setIsSavedPostsLoading(false);
      }
    } else {
      setIsSavedPostsLoading(false);
    }
  }

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
          <div style={{ zIndex: "9" }}>
            <div
              className="background-image-container"
              style={{ position: "relative" }}
            >
              <div className="background-image-sub-container">
                <img
                  ref={bgRef}
                  src={bgImageUrl || profileBackgroundImg}
                  alt=""
                  className="background-image"
                />
              </div>
              {uid === user?.uid && (
                <div className="bg-img-save" style={{ position: "absolute" }}>
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
                    <div
                      className="bg-save-btn"
                      style={{ position: "absolute" }}
                    >
                      <Button variant="outlined" onClick={handleBgImageSave}>
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="user-details-section">
            <div className="image-edit-container">
              <div className="user-image-container">
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
                    } user-image`}
                  />
                ) : (
                  <FaUserCircle className="profile-pic-container" />
                )}
              </div>
              {uid === user?.uid && (
                <Box className="edit-details">
                  <EditIcon
                    className="edit-details-icon edit-image-icon"
                    onClick={() => setIsEditing(true)}
                  />
                </Box>
              )}
            </div>
            <div className="user-details">
              <Box
                className="space-btw"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Typography className="user-name">{name}</Typography>
              </Box>
              <p className="bio space-btw text-dim">{bio}</p>
              <div className="username-and-location-container space-btw">
                <p className="username text-dim">@{username}</p>&nbsp;&nbsp;
                <Typography className="profile-user-username flexx">
                  <LocationOnIcon className="location-icon" />
                </Typography>
                <p className="username text-dim">{country}</p>
              </div>
            </div>
            <div
              className="space-btw text-dim"
              style={{ display: "flex", gap: "30px" }}
            >
              <Typography className="posts-views text-dim">
                All Posts&nbsp;&nbsp;
                <span>{feed.length}</span>
              </Typography>
              <Typography className="posts-views text-dim">
                Views&nbsp;&nbsp;
                <span>
                  <ViewsCounter uid={uid} />
                </span>
              </Typography>
            </div>
            <div>
              {uid !== user?.uid && (
                <Button
                  onClick={() =>
                    user.isAnonymous
                      ? navigate("/dummygram/signup")
                      : handleSendFriendRequest()
                  }
                  variant="contained"
                  color="primary"
                  sx={{
                    marginTop: "10px",
                    borderRadius: "22px",
                    padding: "10px 25px",
                  }}
                >
                  {friendRequestSent ? "Remove friend request" : "Add Friend"}
                </Button>
              )}
            </div>
          </div>

          <div className="feed_btn_container">
            <button
              className={`feed_change_btn ${
                showSaved ? "feed_btn_deactivated" : "feed_btn_activated"
              }`}
              onClick={() => setShowSaved(false)}
            >
              <GridOnIcon /> <span className="feed_btn_text">Feed</span>
            </button>
            {user?.uid === uid && (
              <button
                className={`feed_change_btn ${
                  showSaved ? "feed_btn_activated" : "feed_btn_deactivated"
                }`}
                onClick={() => {
                  getSavedPosts();
                  setShowSaved(true);
                }}
              >
                <BookmarksIcon /> <span className="feed_btn_text">Saved</span>
              </button>
            )}
          </div>
          {showSaved ? (
            isSavedPostsLoading ? (
              <Loader />
            ) : savedPosts.length === 0 ? (
              <p className="no_posts_msg">Nothing in saved</p>
            ) : (
              <ProfieFeed feed={savedPosts} />
            )
          ) : (
            <ProfieFeed feed={feed} />
          )}
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
