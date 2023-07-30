import "./index.css";

import { Loader, ShareModal } from "../../reusableComponents";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";

import { Box } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SideBar } from "../index";

function Notifications() {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(auth?.currentUser?.uid)
      .collection("notifications")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const fetchedNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(fetchedNotifications);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <SideBar />
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="notification-container">
          <ShareModal
            openShareModal={openShareModal}
            setOpenShareModal={setOpenShareModal}
            currentPostLink={currentPostLink}
            postText={postText}
          />
          <Box>
            <div
              className="profile__favourites"
              style={{ marginTop: "5.5rem", marginBottom: "1.5rem" }}
              align="center"
            >
              {notifications.length ? (
                <>
                  <h1 className="notification-heading">
                    Notifications{" "}
                    <span className="notification-count">
                      {notifications.length}
                    </span>
                  </h1>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="notif-message-container"
                    >
                      <FaUserCircle style={{ width: "80px", height: "80px" }} />

                      <div className="notif-message">
                        {notification.message} from{" "}
                        <Link
                          className="friend-request-sender-name"
                          to={`/dummygram/user/${
                            notification.username ? notification.username : ""
                          }`}
                        >
                          {notification.senderName
                            ? notification.senderName
                            : ""}
                          .
                        </Link>
                        <div style={{ marginTop: "10px" }}>
                          <button className="accept-btn notif-btn">
                            Accept
                          </button>
                          <button className="decline-btn notif-btn">
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p style={{ color: "var(--color)" }}>No notifications</p>
              )}
            </div>
          </Box>
        </div>
      )}
    </>
  );
}

export default Notifications;
