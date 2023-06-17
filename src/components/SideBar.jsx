// custom css import
import "./SideBar.css";

import { Link, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineClose } from "react-icons/ai";
import { Dialog } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeIcon from "@mui/icons-material/Home";
import ImgUpload from "../components/ImgUpload";
import React from "react";
import { auth } from "../lib/firebase";
import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationPopup from "../components/NotificationPopup";

function SideBar(props) {

  const navigate = useNavigate();
  const [openNewUpload, setOpenNewUpload] = useState(false);
  const user = auth.currentUser;
  const [openNotificationPopup, setOpenNotificationPopup] = useState(false);
  const handleOpenNotificationPopup = () => {
    setOpenNotificationPopup(true);
  };
  const [requests, setRequests] = useState([]);

  const acceptRequest = (request) => {
    setRequests(requests.filter((req) => req.id !== request.id));
  };

  const rejectRequest = (request) => {
    setRequests(requests.filter((req) => req.id !== request.id));
  };
  return (
    <div className="sidebar">
      <ul>
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
        <li onClick={() => navigate("/dummygram/favourites")}>
          <div className="sidebar_align">
            <FavoriteBorderIcon className="icon" /> <span>Favourites</span>
          </div>
        </li>
        <li onClick={handleOpenNotificationPopup}>
          <div className="sidebar_align">
            <NotificationsIcon className="icon" /> <span>Notifications</span>
          </div>
        </li>
        <li
          onClick={() =>
            navigate("/dummygram/profile", {
              state: {
                name: props.user.toJSON().displayName,
                email: props.user.toJSON().email,
                avatar: props.user.toJSON().photoURL,
              },
            })
          }
        >
          <div className="sidebar_align">
            <AccountCircleIcon className="icon" /> <span>Profile</span>
          </div>
        </li>
      </ul>
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
      <Dialog
        PaperProps={{
          sx: {
            width: "60vw",
            height: "60vh",
          },
        }}
        open={openNotificationPopup}
        onClose={() => setOpenNotificationPopup(false)}
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
              setOpenNotificationPopup(false);
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
            Notifications
          </p>
          <hr />
          <NotificationPopup
            requests={requests}
            acceptRequest={acceptRequest}
            rejectRequest={rejectRequest}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default SideBar;
