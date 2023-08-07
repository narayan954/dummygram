import "./index.css";

import { AnimatedButton, Logo } from "../../reusableComponents";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getModalStyle, useStyles } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import blankImg from "../../assets/blank-profile.webp"
import MoreVertIcon from '@mui/icons-material/MoreVert';

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineClose } from "react-icons/ai";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ClickAwayListener } from "@mui/material";
import { Dialog } from "@mui/material";
import ErrorBoundary from "../../reusableComponents/ErrorBoundary";
import HomeIcon from "@mui/icons-material/Home";
import ImgUpload from "../ImgUpload";
import LogoutIcon from "@mui/icons-material/Logout";
import Modal from "@mui/material/Modal";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSnackbar } from "notistack";

const Footer = React.lazy(() => import("./Footer"));

function SideBar({ anonymous }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const [logout, setLogout] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openNewUpload, setOpenNewUpload] = useState(false);
  const [windowWidth, setWindowWidth] = useState(700);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
  });

  function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width;
  }

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function getUsername() {
      try {
        const docRef = doc(db, "users", user?.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (docSnap.exists()) {
          setUserData({
            name: data?.displayName || auth.currentUser?.displayName,
            username: data?.username || auth.currentUser?.uid,
          });
        } else {
          setUserData({
            name: auth.currentUser?.displayName,
            username: auth.currentUser?.uid,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          name: auth.currentUser?.displayName,
          username: auth.currentUser?.uid,
        });
      }
    }

    if (anonymous) {
      setUserData({
        name: "Guest",
        username: "guest",
      });
    } else {
      getUsername();
    }
  }, [user, anonymous]);

  const signOut = () => {
    auth.signOut().finally(() => {
      playSuccessSound();
      enqueueSnackbar("Logged out Successfully !", {
        variant: "info",
      });
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar_design">
          <span style={{ backgroundColor: "red" }}></span>
          <span style={{ backgroundColor: "orange" }}></span>
          <span style={{ backgroundColor: "rgb(30, 222, 30)" }}></span>
        </div>
        <ul className="sidebar-links">
          <li
            className={
              location.pathname.includes("/dummygram/user") ? "activeTab" : ""
            }
            id="sidebar_profile_link"
            onClick={() => {
              if (windowWidth < 1200) {
                setOpenMenu((prev) => !prev)
              }
            }}
          >
            <div className="sidebar_profile">
              {windowWidth > 1200 && (
                <MoreVertIcon
                  className="sidebar_menu_icon"
                  onClick={() => setOpenMenu((prev) => !prev)}
                />)}
              <img
                src={user?.photoURL?.length > 0? user.photoURL : blankImg}
                alt="profile picture"
                className="profile-picture"
              />
              <h3 className="sidebar_user_name">{user?.displayName}</h3>
            </div>
          </li>
          <li
            id="sidebar-home-link"
            onClick={() => navigate("/dummygram")}
            className={
              location.pathname === "/dummygram/" ||
                location.pathname === "/dummygram"
                ? "activeTab"
                : ""
            }
          >
            <div className="sidebar_align">
              <HomeIcon className="icon" /> <span>Home</span>
            </div>
          </li>
          <li
            onClick={() =>
              anonymous ? navigate("/dummygram/signup") : setOpenNewUpload(true)
            }
          >
            <div className="sidebar_align">
              <AddCircleOutlineIcon className="icon" /> <span>Create</span>
            </div>
          </li>
          <li
            onClick={() =>
              navigate(`/dummygram/${anonymous ? "signup" : "notifications"}`)
            }
            className={
              location.pathname.includes("/dummygram/notifications")
                ? "activeTab"
                : ""
            }
          >
            <div className="sidebar_align">
              <NotificationsIcon className="icon" /> <span>Notifications</span>
            </div>
          </li>
        </ul>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </div>

      <Modal open={logout} onClose={() => setLogout(false)}>
        <div style={getModalStyle()} className={classes.paper}>
          <form className="modal__signup">
            <Logo />
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
                style={{ marginRight: "20px" }} // Add right margin to create a gap
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

      {openMenu && (
        <ClickAwayListener onClickAway={() => setOpenMenu(false)}>
          <div className="sidebar_user_dropdown_container">
            <ul className="sidebar_user_dropdown_sub_container">
              <li
                onClick={() =>
                  navigate(
                    `/dummygram/${anonymous ? "signup" : `user/${userData.username}`
                    }`,
                  )
                }
              >
                {user && user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="profile picture"
                    className="dropdown-list-profile-picture icon"
                  />
                ) : (
                  <AccountCircleIcon className="icon" />
                )}{" "}
                Profile
              </li>
              <li
                onClick={() =>
                  navigate(`/dummygram/${anonymous ? "signup" : "settings"}`)
                }
              >
                <SettingsIcon className="icon" /> Settings
              </li>
              <li onClick={() => setLogout(true)}>
                <LogoutIcon className="icon" /> Logout
              </li>
            </ul>
          </div>
        </ClickAwayListener>
      )}

      <Dialog
        PaperProps={{
          className: "dialogStyle",
        }}
        open={openNewUpload}
        onClose={() => setOpenNewUpload(false)}
      >
        <div
          style={{
            backgroundColor: "var(--dark-post-bg)",
            textAlign: "center",
            color: "var(--color)",
          }}
        >
          <AiOutlineClose
            onClick={() => {
              setOpenNewUpload(false);
            }}
            size={"1rem"}
            className="crossIcon"
          />
          <p className="createNewPost">Create new post</p>
          <hr />
          <ImgUpload
            user={user}
            onUploadComplete={() => setOpenNewUpload(false)}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default SideBar;
