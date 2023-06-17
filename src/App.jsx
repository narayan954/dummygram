import {
  Box,
  Button,
  ClickAwayListener,
  Dialog,
  DialogContent,
  Divider,
  Modal,
  Typography,
} from "@mui/material";
import { FaArrowCircleUp, FaUserCircle } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { auth, db } from "./lib/firebase";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineInsertRowAbove } from "react-icons/ai";
import AnimatedButton from "./components/AnimatedButton";
import Favorite from "./components/Favorite";
import Loader from "./components/Loader/Loader";
import LoginScreen from "./pages/Login/Login";
import NotFoundPage from "./components/NotFound";
import Post from "./components/Post/Post";
import PostView from "./pages/PostView";
import Profile from "./pages/Profile/Profile";
import ShareModal from "./components/ShareModal";
import SideBar from "./components/SideBar/SideBar";
import SignupScreen from "./pages/Signup/Signup";
import logo from "./assets/logo.png";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";

export function getModalStyle() {
  const top = 50;
  const left = 50;
  const padding = 2;
  const radius = 3;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    padding: `${padding}%`,
    borderRadius: `${radius}%`,
    textAlign: "center",
    backgroundColor: "var(--bg-color)",
  };
}

export const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 250,
    borderRadius: theme.shape.borderRadius,
    boxShadow: "var(--color-shadow) 0px 5px 15px",
    padding: theme.spacing(2, 4, 3),
    color: "var(--color)",
  },
  logout: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const PAGESIZE = 10;

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState();
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadMorePosts, setLoadMorePosts] = useState(false);
  const [logout, setLogout] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");
  const [rowMode, setRowMode] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const buttonStyle = {
    background: "linear-gradient(40deg, #e107c1, #59afc7)",
    borderRadius: "20px",
    margin: "10px",
    ":hover": {
      background: "linear-gradient(-40deg, #59afc7, #e107c1)",
    },
  };

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", checkScrollTop);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        navigate("/dummygram/");
      } else {
        setUser(null);
        navigate("/dummygram/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (document.body.classList.contains("darkmode--activated")) {
      window.document.body.style.setProperty("--bg-color", "black");
      window.document.body.style.setProperty(
        "--color-shadow",
        "rgba(255, 255, 255, 0.35)"
      );
      window.document.body.style.setProperty("--color", "white");
      window.document.body.style.setProperty("--val", 1);
      document.getElementsByClassName("app__header__img").item(0).style.filter =
        "invert(100%)";
    } else {
      window.document.body.style.setProperty("--bg-color", "white");
      window.document.body.style.setProperty(
        "--color-shadow",
        "rgba(0, 0, 0, 0.35)"
      );
      window.document.body.style.setProperty("--color", "#2B1B17");
      window.document.body.style.setProperty("--val", 0);
      document.getElementsByClassName("app__header__img").item(0).style.filter =
        "invert(0%)";
    }

    window.addEventListener("scroll", handleMouseScroll);
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .limit(PAGESIZE)
      .onSnapshot((snapshot) => {
        setLoadingPosts(false);
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const handleMouseScroll = (event) => {
    if (
      window.innerHeight + event.target.documentElement.scrollTop + 1 >=
      event.target.documentElement.scrollHeight
    ) {
      setLoadMorePosts(true);
    }
  };

  useEffect(() => {
    if (loadMorePosts && posts.length) {
      db.collection("posts")
        .orderBy("timestamp", "desc")
        .startAfter(posts[posts.length - 1].post.timestamp)
        .limit(PAGESIZE)
        .onSnapshot((snapshot) => {
          setPosts((loadedPosts) => {
            return [
              ...loadedPosts,
              ...snapshot.docs.map((doc) => ({
                id: doc.id,
                post: doc.data(),
              })),
            ];
          });
        });
    }
    setLoadMorePosts(false);
  }, [loadMorePosts]);

  const signOut = () => {
    auth.signOut().finally();
    enqueueSnackbar("Logged out Successfully !", {
      variant: "info",
    });
  };

  return (
    <div className="app">
      <div className="app__header">
        <img
          src={logo}
          alt="dummygram"
          className="app__header__img"
          onClick={() => {
            if (
              location.pathname !== "/dummygram/login" &&
              location.pathname !== "/dummygram/signup"
            ) {
              navigate("/dummygram/");
            }
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
          style={{
            cursor: "pointer",
          }}
        />

        {user ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <div
                className="rowConvert"
                onClick={() => {
                  setRowMode(!rowMode);
                }}
              >
                <AiOutlineInsertRowAbove size={30} />
              </div>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Button
                  onClick={() => setOpen((cur) => !cur)}
                  color="secondary"
                  variant="contained"
                  sx={{ ...buttonStyle, marginRight: "10px" }}
                >
                  <FaUserCircle fontSize="large" />
                  {open && (
                    <Box
                      backgroundColor="#fff"
                      color="black"
                      padding="2px"
                      width="80px"
                      position="absolute"
                      borderRadius="4px"
                      marginTop={16}
                      marginRight={3}
                      sx={{
                        vertical: "top",
                        border: "1px solid black",
                      }}
                    >
                      <Box
                        display="flex"
                        padding="0.5rem"
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate("/dummygram/profile", {
                            state: {
                              name: user.toJSON().displayName,
                              email: user.toJSON().email,
                              avatar: user.toJSON().photoURL,
                            },
                          })
                        }
                      >
                        <Typography fontFamily="Poppins" fontSize="1rem">
                          Profile
                        </Typography>
                      </Box>
                      <Divider />
                      <Box
                        display="flex"
                        padding="0.5rem"
                        sx={{ cursor: "pointer" }}
                        onClick={() => setLogout(true)}
                      >
                        <Typography fontFamily="Poppins" fontSize="0.9rem">
                          Log Out
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Button>
              </ClickAwayListener>
            </div>
          </>
        ) : (
          <div className="login__container">
            <Button
              onClick={() => {
                navigate("/dummygram/login");
              }}
              color="primary"
              variant="contained"
              style={{ margin: 5 }}
              sx={buttonStyle}
            >
              Log In
            </Button>

            <Button
              onClick={() => {
                navigate("/dummygram/signup");
              }}
              color="primary"
              variant="contained"
              style={{ margin: 5 }}
              sx={buttonStyle}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <ShareModal
        openShareModal={openShareModal}
        setOpenShareModal={setOpenShareModal}
        currentPostLink={currentPostLink}
        postText={postText}
      />

      <Modal open={logout} onClose={() => setLogout(false)}>
        <div style={getModalStyle()} className={classes.paper}>
          <form className="modal__signup">
            <img
              src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
              alt="dummygram"
              className="modal__signup__img"
              style={{
                width: "80%",
                marginLeft: "10%",
                filter: "invert(var(--val))",
              }}
            />

            <p
              style={{
                fontSize: "15px",
                fontFamily: "monospace",
                padding: "10%",
                color: "var(--color)",
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
                sx={buttonStyle}
              >
                Logout
              </AnimatedButton>
              <AnimatedButton
                type="submit"
                onClick={() => setLogout(false)}
                variant="contained"
                color="primary"
                sx={buttonStyle}
              >
                Cancel
              </AnimatedButton>
            </div>
          </form>
        </div>
      </Modal>

      <Routes>
        <Route
          exact
          path="/dummygram/"
          element={
            user ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SideBar user={user} />
                <div
                  style={
                    !loadingPosts
                      ? {}
                      : {
                          width: "100%",
                          minHeight: "100vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }
                  }
                >
                  {loadingPosts ? (
                    <Loader />
                  ) : (
                    <div
                      className={`${
                        rowMode ? "app__posts" : "app_posts_column"
                      }`}
                    >
                      {posts.map(({ id, post }) => (
                        <Post
                          rowMode={rowMode}
                          key={id}
                          postId={id}
                          user={user}
                          post={post}
                          shareModal={setOpenShareModal}
                          setLink={setCurrentPostLink}
                          setPostText={setPostText}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )
          }
        />

        <Route path="/dummygram/profile" element={<Profile />} />

        <Route path="/dummygram/login" element={<LoginScreen />} />

        <Route path="/dummygram/signup" element={<SignupScreen />} />

        <Route
          path="/dummygram/posts/:id"
          element={
            <PostView
              user={user}
              shareModal={setOpenShareModal}
              setLink={setCurrentPostLink}
              setPostText={setPostText}
            />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
        <Route path="/dummygram/favourites" element={<Favorite />} />
      </Routes>

      <FaArrowCircleUp
        fill="#777"
        // stroke="30"
        className="scrollTop"
        onClick={scrollTop}
        style={{
          height: 50,
          display: showScroll ? "flex" : "none",
        }}
      />
    </div>
  );
}

export default App;
