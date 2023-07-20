import "./index.css";

import React, { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineClose } from "react-icons/ai";
import { Dialog } from "@mui/material";
import ErrorBoundary from "../../reusableComponents/ErrorBoundary";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeIcon from "@mui/icons-material/Home";
import ImgUpload from "../ImgUpload";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

const Footer = React.lazy(() => import("./Footer"));

function SideBar({ anonymous }) {
  const navigate = useNavigate();
  const [openNewUpload, setOpenNewUpload] = useState(false);
  const [username, setUsername] = useState("");
  const user = auth.currentUser;
  const location = useLocation();

  useEffect(() => {
    async function getUsername() {
      const docRef = doc(db, "users", user?.uid);
      const docSnap = await getDoc(docRef);
      setUsername(docSnap.data().username);
    }
    getUsername();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <ul className="sidebar-links">
          <li
            onClick={() => navigate("/dummygram/")}
            id="sidebar-home-link"
            className={location.pathname == "/dummygram/" ? "activeTab" : ""}
          >
            <div className="sidebar_align">
              <HomeIcon className="icon" /> <span>Home</span>
            </div>
          </li>
          <li onClick={() => anonymous? navigate("/dummygram/signup") : setOpenNewUpload(true)}>
            <div className="sidebar_align">
              <AddCircleOutlineIcon className="icon" /> <span>New Post</span>
            </div>
          </li>
          <li
            onClick={() => navigate(`/dummygram/${anonymous? "signup" : "search"}`)}
            className={
              location.pathname == "/dummygram/search" ? "activeTab" : ""
            }
          >
            <div className="sidebar_align">
              <SearchIcon className="icon" /> <span>Search</span>
            </div>
          </li>
          <li
            onClick={() => navigate(`/dummygram/${anonymous? "signup" : "favourites"}`)}
            className={
              location.pathname == "/dummygram/favourites" ? "activeTab" : ""
            }
          >
            <div className="sidebar_align">
              <FavoriteBorderIcon className="icon" /> <span>Favourites</span>
            </div>
          </li>
          <li
            onClick={() => navigate(`/dummygram/${anonymous? "signup" : "notifications"}`)}
            className={
              location.pathname == "/dummygram/notifications" ? "activeTab" : ""
            }
          >
            <div className="sidebar_align">
              <NotificationsIcon className="icon" /> <span>Notifications</span>
            </div>
          </li>
          <li
            className={
              location.pathname == `/dummygram/${anonymous? "signup" : username}` ? "activeTab" : ""
            }
            onClick={() => navigate(`/dummygram/${username}`)}
          >
            <div className="sidebar_align">
              {user && user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile picture"
                  className="profile-picture"
                />
              ) : (
                <AccountCircleIcon className="icon" />
              )}{" "}
              <span>Profile</span>
            </div>
          </li>
        </ul>
        <hr />
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </div>

      <Dialog
        PaperProps={{
          className: "dialogStyle",
        }}
        open={openNewUpload}
        onClose={() => setOpenNewUpload(false)}
      >
        <div
          style={{
            backgroundColor: "var(--bg-color)",
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
