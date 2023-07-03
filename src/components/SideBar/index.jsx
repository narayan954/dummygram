import "./index.css";

import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineClose } from "react-icons/ai";
import { Dialog } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GitHubIcon from "@mui/icons-material/GitHub";
import HomeIcon from "@mui/icons-material/Home";
import ImgUpload from "../ImgUpload";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { auth } from "../../lib/firebase";

function SideBar() {
  const navigate = useNavigate();
  const [openNewUpload, setOpenNewUpload] = useState(false);
  const user = auth.currentUser;

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <ul className="sidebar-links">
          <li>
            <Link to="/dummygram">
              <HomeIcon className="icon" /> <span>Home</span>
            </Link>
          </li>
          <li onClick={() => setOpenNewUpload(true)}>
            <div className="sidebar_align">
              <AddCircleOutlineIcon className="icon" /> <span>New Post</span>
            </div>
          </li>
          <li onClick={() => navigate("/dummygram/search")}>
            <div className="sidebar_align">
              <SearchIcon className="icon" /> <span>Search</span>
            </div>
          </li>
          <li onClick={() => navigate("/dummygram/favourites")}>
            <div className="sidebar_align">
              <FavoriteBorderIcon className="icon" /> <span>Favourites</span>
            </div>
          </li>
          <li onClick={() => navigate("/dummygram/notifications")}>
            <div className="sidebar_align">
              <NotificationsIcon className="icon" /> <span>Notifications</span>
            </div>
          </li>
          <li
            onClick={() =>
              navigate("/dummygram/profile", {
                state: {
                  name: user.displayName,
                  email: user.email,
                  avatar: user.photoURL,
                },
              })
            }
          >
            <div className="sidebar_align">
              <AccountCircleIcon className="icon" /> <span>Profile</span>
            </div>
          </li>
        </ul>
        <footer>
          <ul className="sidebar-footer-container">
            <li>
              <a href="https://github.com/narayan954/dummygram" target="_blank">
                <GitHubIcon />
              </a>
            </li>
            <li>
              <Link to="/about" className="footer-link">
                about
              </Link>
            </li>
            <li>
              <Link to="/help-center" className="footer-link">
                help-center
              </Link>
            </li>
            <li>
              <Link to="/guidelines" className="footer-link">
                Guidelines
              </Link>
            </li>
            <li>
              <Link to="/guidelines" className="footer-link">
                policy
              </Link>
            </li>
          </ul>
          <p className="copyright">&#169; MIT license since 2022</p>
        </footer>
      </div>
      <Dialog
        PaperProps={{
          sx: {
            width: "60vw",
            height: "60vh",
          },
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
            size={18}
            style={{
              position: "absolute",
              right: "1rem",
              top: "1rem",
              cursor: "pointer",
            }}
          />
          <p
            style={{
              fontSize: "17px",
              fontWeight: 500,
              color: "var(--color)",
              marginTop: "10px",
              marginBottom: "8px",
            }}
          >
            Create new post
          </p>
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
