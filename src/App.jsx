import "./index.css";

import { Darkmode, Loader, ShareModal } from "./reusableComponents";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./lib/firebase";

import ErrorBoundary from "./reusableComponents/ErrorBoundary";
import { FaArrowCircleUp } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { RowModeContext } from "./hooks/useRowMode";
import { makeStyles } from "@mui/styles";

// ------------------------------------ Pages ----------------------------------------------------
const About = React.lazy(() => import("./pages/FooterPages/About"));
const Guidelines = React.lazy(() => import("./pages/FooterPages/Guidelines"));
const SearchBar = React.lazy(() => import("./components/SearchBar"));
const Feedback = React.lazy(() => import("./pages/FooterPages/Feedback"));
const LoginScreen = React.lazy(() => import("./pages/Login"));
const PostView = React.lazy(() => import("./pages/PostView"));
const Profile = React.lazy(() => import("./pages/Profile"));
const SignupScreen = React.lazy(() => import("./pages/Signup"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Contributors = React.lazy(() =>
  import("./pages/FooterPages/ContributorPage/index")
);
// ------------------------------------- Components ------------------------------------------------
const Favorite = React.lazy(() => import("./components/Favorite.jsx"));
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
  const [searchText, setSearchText] = useState("");
  const [searchedPosts, setSearchedPosts] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
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

  useEffect(() => {
    const fetchSearchResults = async () => {
      setSearchedPosts(
        posts.filter(
          (post) =>
            post.post?.displayName
              ?.toLowerCase()
              .includes(searchText?.toLowerCase()) ||
            post.post?.username
              ?.toLowerCase()
              .includes(searchText?.toLowerCase())
        )
      );
    };

    fetchSearchResults();
  }, [searchText, posts.length]);

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
          <ShareModal
            openShareModal={openShareModal}
            setOpenShareModal={setOpenShareModal}
            currentPostLink={currentPostLink}
            postText={postText}
          />
          {location.pathname &&
            (location.pathname == "/dummygram/login" ||
              location.pathname == "/dummygram/signup") && (
              <Darkmode themeClass="themeButton themeButton-login" />
            )}

          <Routes>
            <Route
              exact
              path="/dummygram/"
              element={
                user ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <ErrorBoundary inApp={true}>
                      <SideBar />
                    </ErrorBoundary>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: rowMode ? "row" : "column",
                      }}
                    >
                      <div
                        className="home-posts-container"
                        style={
                          !loadingPosts
                            ? {}
                            : {
                                width: "100%",
                                minHeight: "100vh",
                                display: "flex",
                                flexDirection: rowMode ? "row" : "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                        }
                      >
                        {loadingPosts ? (
                          <Loader />
                        ) : (
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                            className={`${
                              rowMode ? "app__posts " : "app_posts_column flex"
                            }`}
                          >
                            <div
                              className="search-bar"
                              style={{ minWidth: "300px" }}
                            >
                              <input
                                type="search"
                                className="search-input"
                                value={searchText}
                                placeholder="Search Here..."
                                onChange={handleSearch}
                              />
                              <label className="search-icon">
                                <FaSearch />
                              </label>
                            </div>
                            <ErrorBoundary inApp={true}>
                              <div className={rowMode ? "app__posts" : ""}>
                                {searchText
                                  ? searchedPosts.map(({ id, post }) => (
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
                                    ))
                                  : posts.map(({ id, post }) => (
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
                            </ErrorBoundary>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              }
            />

            <Route
              path="/dummygram/:username"
              element={
                <ErrorBoundary inApp={true}>
                  <Profile />
                </ErrorBoundary>
              }
            />

            <Route
              path="/dummygram/settings"
              element={
                <ErrorBoundary inApp={true}>
                  <Settings />
                </ErrorBoundary>
              }
            />
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
            <Route
              path="/dummygram/favourites"
              element={
                <ErrorBoundary inApp={true}>
                  <Favorite />
                </ErrorBoundary>
              }
            />
            <Route
              path="/dummygram/search"
              element={
                <ErrorBoundary inApp={true}>
                  <SearchBar />
                </ErrorBoundary>
              }
            />
          </Routes>
          {/* below scroll button must be checked for implementation */}
          {location.pathname === "/dummygram/" ||
          location.pathname === "/dummygram/favourites" ||
          location.pathname === "/dummygram/about" ||
          location.pathname === "/dummygram/guidelines" ||
          location.pathname === "/dummygram/contributors" ? (
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
          ) : (
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
          )}
        </div>
      </ErrorBoundary>
    </RowModeContext.Provider>
  );
}

export default App;
