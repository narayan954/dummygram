import { Darkmode, ErrorBoundary } from "./reusableComponents";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { ChatPage } from "./pages";
import { FaArrowCircleUp } from "react-icons/fa";
import { RowModeContext } from "./hooks/useRowMode";
import { auth } from "./lib/firebase";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";

// ------------------------------------ Pages ----------------------------------------------------
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/FooterPages/About"));
const Guidelines = React.lazy(() => import("./pages/FooterPages/Guidelines"));
const Feedback = React.lazy(() => import("./pages/FooterPages/Feedback"));
const LoginScreen = React.lazy(() => import("./pages/Login"));
const PostView = React.lazy(() => import("./pages/PostView"));
const Profile = React.lazy(() => import("./pages/Profile"));
const SignupScreen = React.lazy(() => import("./pages/Signup"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const Friends = React.lazy(() => import("./pages/Friends"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Contributors = React.lazy(
  () => import("./pages/FooterPages/ContributorPage"),
);
const HelpCenter = React.lazy(() => import("./pages/FooterPages/HelpCenter"));
// ------------------------------------- Components ------------------------------------------------
const Notifications = React.lazy(() => import("./components/Notification"));
const SideBar = React.lazy(() => import("./components/SideBar"));
const Navbar = React.lazy(() => import("./components/Navbar"));
const DeleteAccount = React.lazy(
  () => import("./components/SettingsComponents/DeleteAccount"),
);
const SettingsSidebar = React.lazy(
  () => import("./components/SettingsComponents/Sidebar"),
);
const SoundSetting = React.lazy(
  () => import("./components/SettingsComponents/Sounds"),
);

export function getModalStyle() {
  const top = 0;
  const padding = 2;
  const radius = 3;

  return {
    top: `${top}%`,
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

export default function App() {
  const [user, setUser] = useState(null);
  const [rowMode, setRowMode] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
      } else {
        setUser(null);
        navigate("/login");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <RowModeContext.Provider value={rowMode}>
      <ErrorBoundary inApp={true}>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary inApp={true}>
                <Wrapper
                  user={user}
                  setUser={setUser}
                  setRowMode={setRowMode}
                />
              </ErrorBoundary>
            }
          >
            <Route
              element={
                user && (
                  <ErrorBoundary inApp={true}>
                    <SideBarWrapper />
                  </ErrorBoundary>
                )
              }
            >
              <Route
                index
                element={user && <Home rowMode={rowMode} user={user} />}
              />
              <Route
                path="user/:username"
                element={
                  <ErrorBoundary inApp={true}>
                    <Profile />
                  </ErrorBoundary>
                }
              />

              <Route
                path="user/:username/friends"
                element={
                  <ErrorBoundary inApp={true}>
                    <Friends />
                  </ErrorBoundary>
                }
              />

              <Route
                path="chat"
                element={
                  <ErrorBoundary inApp={true}>
                    <ChatPage user={user} />
                  </ErrorBoundary>
                }
              />

              <Route
                path="feedback"
                element={
                  <ErrorBoundary inApp={true}>
                    <Feedback />
                  </ErrorBoundary>
                }
              />

              <Route
                path="forgot-password"
                element={
                  <ErrorBoundary inApp={true}>
                    <ForgotPassword />
                  </ErrorBoundary>
                }
              />

              <Route
                path="notifications"
                element={
                  <ErrorBoundary inApp={true}>
                    <Notifications />
                  </ErrorBoundary>
                }
              />

              <Route
                path="posts/:id"
                element={
                  <ErrorBoundary inApp={true}>
                    <PostView user={user} />
                  </ErrorBoundary>
                }
              />
              <Route errorElement path="*" element={<NotFound />} />

              <Route
                path="about"
                element={
                  <ErrorBoundary inApp={true}>
                    <About />
                  </ErrorBoundary>
                }
              />

              <Route
                path="contributors"
                element={
                  <ErrorBoundary inApp={true}>
                    <Contributors />
                  </ErrorBoundary>
                }
              />

              <Route
                path="guidelines"
                element={
                  <ErrorBoundary inApp={true}>
                    <Guidelines />
                  </ErrorBoundary>
                }
              />

              <Route
                path="help-center"
                element={
                  <ErrorBoundary inApp={true}>
                    <HelpCenter />
                  </ErrorBoundary>
                }
              />
            </Route>

            <Route
              path="settings"
              element={
                <ErrorBoundary inApp={true}>
                  <SettingsSidebar />
                </ErrorBoundary>
              }
            >
              <Route
                index
                element={
                  <ErrorBoundary inApp={true}>
                    <SoundSetting />
                  </ErrorBoundary>
                }
              />
              <Route
                path="account"
                element={
                  <ErrorBoundary inApp={true}>
                    <DeleteAccount user={user} />
                  </ErrorBoundary>
                }
              />
              <Route
                path="*"
                element={
                  <h1 style={{ color: "var(--text-secondary)" }}>Empty...</h1>
                }
              />
            </Route>

            <Route
              path="login"
              element={
                <ErrorBoundary inApp={true}>
                  <LoginScreen />
                </ErrorBoundary>
              }
            />

            <Route
              path="signup"
              element={
                <ErrorBoundary inApp={true}>
                  <SignupScreen />
                </ErrorBoundary>
              }
            />

            <Route errorElement path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </RowModeContext.Provider>
  );
}

function Wrapper({ user, setUser, setRowMode }) {
  const [showScroll, setShowScroll] = useState(false);
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const isCenteredScroll =
    location.href.includes("favourites") ||
    location.href.includes("about") ||
    location.href.includes("guidelines") ||
    location.href.includes("contributors");

  return (
    <div className="app">
      <Navbar
        onClick={() => setRowMode((prev) => !prev)}
        user={user}
        setUser={setUser}
      />
      {(location.href.includes("login") ||
        location.href.includes("signup")) && (
        <Darkmode themeClass="themeButton themeButton-login" />
      )}

      {/* All the children element will come here */}
      <Outlet />

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
  );
}

function SideBarWrapper() {
  return (
    <div className="flex">
      <ErrorBoundary inApp={true}>
        <SideBar />
      </ErrorBoundary>
      <div className="sidebar_wrapper">
        <Outlet />
      </div>
    </div>
  );
}
