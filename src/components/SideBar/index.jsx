import "./index.css";

import { AnimatedButton, Logo } from "../../reusableComponents";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getModalStyle, useStyles } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";

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
  const [userData, setUserData] = useState({
    name: "",
    username: "",
  });

  useEffect(() => {
    async function getUsername() {
      const docRef = doc(db, "users", user?.uid);
      const docSnap = await getDoc(docRef);
      setUserData({
        name: docSnap.data().displayName,
        username: docSnap.data().username,
      });
    }
    if (anonymous) {
      setUserData({
        name: "Guest",
        username: "guest",
      });
    } else {
      getUsername();
    }
  }, []);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/dummygram");
      })
      .finally(() => {
        playSuccessSound();
        enqueueSnackbar("Logged out Successfully !", {
          variant: "info",
        });
      });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <ul className="sidebar-links">
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
          <li
            className={
              location.pathname.includes("/dummygram/user") ? "activeTab" : ""
            }
          >
            <div
              className="sidebar_align"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              {user && user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile picture"
                  className="profile-picture"
                />
              ) : (
                <AccountCircleIcon className="icon" />
              )}{" "}
              <span className="sidebar_user_dropdown">
                {user && !anonymous ? user.displayName : userData.name}{" "}
                <ArrowDropDownIcon />
              </span>
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
                    `/dummygram/${
                      anonymous ? "signup" : `user/${userData.username}`
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
