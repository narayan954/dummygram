import "./index.css";

import { AccountCircle, AddCircleOutlined } from "@mui/icons-material";
import { AnimatedButton, ErrorBoundary, Logo } from "../../reusableComponents";
import { ClickAwayListener, Dialog, Modal } from "@mui/material";
import {
  Home,
  Logout,
  MoreVert,
  Notifications,
  Settings,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { getModalStyle, useStyles } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";

import { AiOutlineClose } from "react-icons/ai";
import ImgUpload from "../ImgUpload";
import { auth } from "../../lib/firebase";
import blankImg from "../../assets/blank-profile.webp";
import getUserSessionData from "../../js/userData";
import { useSnackbar } from "notistack";

const Footer = React.lazy(() => import("./Footer"));

function SideBar() {
  const classes = useStyles();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const anonymous = auth?.currentUser?.isAnonymous;
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const [logout, setLogout] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openNewUpload, setOpenNewUpload] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
  });

  const windowWidth = window.innerWidth;

  useEffect(() => {
    async function getUsername() {
      try {
        const data = await getUserSessionData();
        if (data) {
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
        <ul className="sidebar-links">
          <li
            className={
              windowWidth < 1200 && location.pathname.includes("/user")
                ? "activeTab"
                : ""
            }
            style={{
              cursor: windowWidth > 1200 ? "default" : "pointer",
            }}
            id="sidebar_profile_link"
            onClick={() => {
              if (windowWidth < 1200) {
                setOpenMenu((prev) => !prev);
              }
            }}
          >
            <div className="sidebar_profile">
              {windowWidth > 1200 && (
                <MoreVert
                  className="sidebar_menu_icon"
                  onClick={() => setOpenMenu((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <img
                src={user?.photoURL?.length > 0 ? user.photoURL : blankImg}
                alt="profile picture"
                className="profile-picture"
              />
              <h3 className="sidebar_user_name">{user?.displayName}</h3>
            </div>
          </li>
          <li
            id="sidebar-home-link"
            onClick={() => navigate("/")}
            className={
              location.pathname === "" || location.pathname === "/"
                ? "activeTab"
                : ""
            }
          >
            <div className="sidebar_align">
              <Home className="icon" /> <span>Home</span>
            </div>
          </li>
          <li
            onClick={() =>
              anonymous ? navigate("/signup") : setOpenNewUpload(true)
            }
          >
            <div className="sidebar_align">
              <AddCircleOutlined className="icon" /> <span>Create</span>
            </div>
          </li>
          <li
            onClick={() =>
              navigate(`/${anonymous ? "signup" : "notifications"}`)
            }
            className={
              location.pathname.includes("/notifications") ? "activeTab" : ""
            }
          >
            <div className="sidebar_align">
              <Notifications className="icon" /> <span>Notifications</span>
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
          <div
            className="sidebar_user_dropdown_container"
            onClick={() => setOpenMenu(false)}
          >
            <ul className="sidebar_user_dropdown_sub_container">
              <li
                onClick={() =>
                  navigate(
                    `/${anonymous ? "signup" : `user/${userData.username}`}`,
                  )
                }
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="profile picture"
                    className="dropdown-list-profile-picture icon"
                  />
                ) : (
                  <AccountCircle className="icon" />
                )}{" "}
                Profile
              </li>
              <li
                onClick={() =>
                  navigate(`/${anonymous ? "signup" : "settings"}`)
                }
              >
                <Settings className="icon" /> Settings
              </li>
              <li onClick={() => setLogout(true)}>
                <Logout className="icon" /> Logout
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
