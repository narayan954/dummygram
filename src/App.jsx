import "./index.css";

import { Darkmode, ShareModal } from "./reusableComponents";
import {
  DeleteAccount,
  SettingsSidebar,
  SoundSetting,
} from "./components/SettingsComponents";
import { ErrorBoundary, PostSkeleton } from "./reusableComponents";
import React, { Fragment, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./lib/firebase";

import { ChatPage } from "./pages";
import { FaArrowCircleUp } from "react-icons/fa";
import { GuestSignUpBtn } from "./components";
import { RowModeContext } from "./hooks/useRowMode";
import { Suggestion } from "./components";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";

// ------------------------------------ Pages ----------------------------------------------------
const About = React.lazy(() => import("./pages/FooterPages/About"));
const Guidelines = React.lazy(() => import("./pages/FooterPages/Guidelines"));
const Feedback = React.lazy(() => import("./pages/FooterPages/Feedback"));
const LoginScreen = React.lazy(() => import("./pages/Login"));
const PostView = React.lazy(() => import("./pages/PostView"));
const Profile = React.lazy(() => import("./pages/Profile"));
const SignupScreen = React.lazy(() => import("./pages/Signup"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Contributors = React.lazy(() =>
  import("./pages/FooterPages/ContributorPage"),
);
// ------------------------------------- Components ------------------------------------------------
const Notifications = React.lazy(() => import("./components/Notification"));
const Post = React.lazy(() => import("./components/Post"));
const SideBar = React.lazy(() => import("./components/SideBar"));
const Navbar = React.lazy(() => import("./components/Navbar"));

export function getModalStyle() {
  const top = 0;
  // const left = 50;
  const padding = 2;
  const radius = 3;

  return {
    top: `${top}%`,
    // left: `${left}%`,
    transform: `translate(-${top}%, -50%)`,
    padding: `${padding}%`,
    borderRadius: `${radius}%`,
    textAlign: "center",
    backgroundColor: "var(--bg-color)",
  };
}

export const useStyles = makeStyles((theme) => ({
  paper: {
    width: 250,
    marginTop: 300,
    borderRadius: theme.shape.borderRadius,
    boxShadow: "var(--profile-box-shadow)",
    padding: theme.spacing(2, 4, 3),
    color: "var(--color)",
    margin: "auto",
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
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadMorePosts, setLoadMorePosts] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");
  const [rowMode, setRowMode] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [windowWidth, setWindowWidth] = useState("700");

  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isCenteredScroll =
    location.pathname === "/dummygram/favourites" ||
    location.pathname === "/dummygram/about" ||
    location.pathname === "/dummygram/guidelines" ||
    location.pathname === "/dummygram/contributors";

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);

  useEffect(() => {
    const showOfflineNotification = () => {
      enqueueSnackbar("You are offline", {
        variant: "error",
      });
    };

    const showOnlineNotification = () => {
      enqueueSnackbar("You are online", {
        variant: "success",
      });
    };

    window.addEventListener("offline", showOfflineNotification);

    window.addEventListener("online", showOnlineNotification);

    return () => {
      window.removeEventListener("offline", showOfflineNotification);
      window.removeEventListener("online", showOnlineNotification);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setAnonymous(authUser.isAnonymous);
      } else {
        setUser(null);
        navigate("/dummygram/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleMouseScroll = (event) => {
      if (
        window.innerHeight + event.target.documentElement.scrollTop + 1 >=
        event.target.documentElement.scrollHeight
      ) {
        setLoadMorePosts(true);
      }
    };
    const scrollEventListener = window.addEventListener(
      "scroll",
      handleMouseScroll,
    );
    const unsubscribe = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .limit(PAGESIZE)
      .onSnapshot((snapshot) => {
        setLoadingPosts(false);
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          })),
        );
      });

    return () => {
      window.removeEventListener("scroll", handleMouseScroll);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubscribe;

    if (loadMorePosts && posts.length) {
      unsubscribe = db
        .collection("posts")
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
      setLoadMorePosts(false);
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loadMorePosts]);

  useEffect(() => {
    function getWindowDimensions() {
      const { innerWidth: width } = window;
      return { width };
    }
    function handleResize() {
      setWindowWidth(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <RowModeContext.Provider value={rowMode}>
      <ErrorBoundary inApp={true}>
        <div className="app">
          <ErrorBoundary inApp={true}>
            <Navbar
              onClick={() => setRowMode((prev) => !prev)}
              user={user}
              setUser={setUser}
            />
          </ErrorBoundary>
          {anonymous &&
            location.pathname !== "/dummygram/signup" &&
            location.pathname !== "/dummygram/login" && <GuestSignUpBtn />}
          <ShareModal
            openShareModal={openShareModal}
            setOpenShareModal={setOpenShareModal}
            currentPostLink={currentPostLink}
            postText={postText}
          />
          {(location.pathname == "/dummygram/login" ||
            location.pathname == "/dummygram/signup") && (
            <Darkmode themeClass="themeButton themeButton-login" />
          )}
          <Routes>
            <Route
              exact
              path="/dummygram/"
              element={
                user ? (
                  <div className="flex">
                    <ErrorBoundary inApp={true}>
                      <SideBar anonymous={anonymous} />
                    </ErrorBoundary>
                    <div
                      className="home-posts-container"
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
                      <div
                        className={`${
                          rowMode ? "app__posts" : "app_posts_column flex"
                        }`}
                      >
                        {loadingPosts ? (
                          <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                          </>
                        ) : (
                          <>
                            <ErrorBoundary inApp>
                              {posts.map(({ id, post }, index) => (
                                <Fragment key={id}>
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
                                  {index === 1 && windowWidth.width < 1300 && (
                                    <Suggestion currentUserUid={user.uid} />
                                  )}
                                </Fragment>
                              ))}
                            </ErrorBoundary>
                          </>
                        )}
                      </div>
                    </div>
                    {windowWidth.width > 1300 && <Suggestion />}
                  </div>
                ) : (
                  <></>
                )
              }
            />

            <Route
              path="/dummygram/user/:username"
              element={
                <ErrorBoundary inApp={true}>
                  <Profile />
                </ErrorBoundary>
              }
            />

            <Route
              path="/dummygram/chat"
              element={
                <ErrorBoundary inApp={true}>
                  <ChatPage user={user} />
                </ErrorBoundary>
              }
            />

            <Route path="/dummygram/settings" element={<SettingsSidebar />}>
              <Route index element={<SoundSetting />} />
              <Route path="account" element={<DeleteAccount user={user} />} />
              <Route path="*" element={<h1>Empty...</h1>} />
            </Route>

            <Route
              path="/dummygram/about"
              element={
                <ErrorBoundary inApp={true}>
                  <About />
                </ErrorBoundary>
              }
            />

            <Route
              path="/dummygram/feedback"
              element={
                <ErrorBoundary inApp={true}>
                  <Feedback />
                </ErrorBoundary>
              }
            />

            <Route
              path="/dummygram/guidelines"
              element={
                <ErrorBoundary inApp={true}>
                  <Guidelines />
                </ErrorBoundary>
              }
            />

            <Route
              path="/dummygram/login"
              element={
                <ErrorBoundary inApp={true}>
                  <LoginScreen />
                </ErrorBoundary>
              }
            />

            <Route
              path="/dummygram/signup"
              element={
                <ErrorBoundary inApp={true}>
                  <SignupScreen />
                </ErrorBoundary>
              }
            />

            <Route
              path="/dummygram/forgot-password"
              element={
                <ErrorBoundary inApp={true}>
                  <ForgotPassword />
                </ErrorBoundary>
              }
            />

            <Route
              path="/dummygram/notifications"
              element={
                <ErrorBoundary inApp={true}>
                  <Notifications />
                </ErrorBoundary>
              }
            />

            <Route
              path="/dummygram/contributors"
              element={
                <ErrorBoundary inApp={true}>
                  <Contributors />
                </ErrorBoundary>
              }
            />

            <Route
              path="/dummygram/posts/:id"
              element={
                <ErrorBoundary inApp={true}>
                  <PostView
                    user={user}
                    shareModal={setOpenShareModal}
                    setLink={setCurrentPostLink}
                    setPostText={setPostText}
                  />
                </ErrorBoundary>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* below scroll button must be checked for implementation */}
          <FaArrowCircleUp
            fill="#5F85DB"
            className={`scrollTop ${isCenteredScroll ? "centeredScroll" : ""}`}
            onClick={scrollTop}
            style={{
              height: 50,
              display: showScroll ? "flex" : "none",
              position: "fixed",
            }}
          />
        </div>
      </ErrorBoundary>
    </RowModeContext.Provider>
  );
}

export default App;
