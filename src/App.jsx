import "./index.css";

import {
  AnimatedButton,
  Darkmode,
  Loader,
  ShareModal,
} from "./reusableComponents";
import {
  Favorite,
  Navbar,
  NotFound,
  Notifications,
  Post,
  SideBar,
} from "./components";
import { LoginScreen, PostView, Profile, SignupScreen } from "./pages";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { auth, db } from "./lib/firebase";

import { FaArrowCircleUp } from "react-icons/fa";
import Modal from "@mui/material/Modal";
import { RowModeContext } from "./hooks/useRowMode";
import SearchBar from "./components/SearchBar";
import logo from "./assets/logo.webp";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";

export function getModalStyle() {
  const top = 56;
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
    boxShadow: "var(--profile-box-shadow)",
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
    navigate("/dummygram/");
  };

  return (
    <RowModeContext.Provider value={rowMode}>
      <div className="app">
        <Navbar
          onClick={() => setRowMode((prev) => !prev)}
          user={user}
          setUser={setUser}
          open={open}
          setOpen={setOpen}
          setLogout={setLogout}
        />

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

        <Darkmode />
        <Routes>
          <Route
            exact
            path="/dummygram/"
            element={
              user ? (
                <div className="flex">
                  <SideBar />
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
                          rowMode ? "app__posts" : "app_posts_column flex"
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

          <Route path="/dummygram/notifications" element={<Notifications />} />

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

          <Route path="*" element={<NotFound />} />
          <Route path="/dummygram/favourites" element={<Favorite />} />
          <Route path="/dummygram/search" element={<SearchBar />} />
        </Routes>

        {location.pathname === "/dummygram/" ||
        location.pathname === "/dummygram/favourites" ? (
          <div>
            <FaArrowCircleUp
              fill="#777"
              className="scrollTop"
              onClick={scrollTop}
              style={{
                height: 50,
                display: showScroll ? "flex" : "none",
                position: "fixed",
              }}
            />
          </div>
        ) : (
          <div>
            <FaArrowCircleUp
              fill="#777"
              className="scrollTop sideToTop"
              onClick={scrollTop}
              style={{
                height: 50,
                display: showScroll ? "flex" : "none",
                position: "fixed",
              }}
            />
          </div>
        )}
      </div>
    </RowModeContext.Provider>
  );
}

export default App;
