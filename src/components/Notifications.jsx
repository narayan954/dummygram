import React, { useEffect, useState } from "react";

import { Box } from "@mui/material";
import ShareModal from "../reusableComponents/ShareModal";
import SideBar from "./SideBar";
import { db } from "../lib/firebase";

function Notifications() {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("notifications")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const fetchedNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(fetchedNotifications);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <SideBar />
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
              <h1>Notifications</h1>
              {notifications.map((notification) => (
                <div key={notification.id}>
                  <p>{notification.message}</p>
                </div>
              ))}
            </>
          ) : (
            <>No notifications</>
          )}
        </div>
      </Box>
    </div>
  );
}

export default Notifications;
