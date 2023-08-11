import "./index.css";

import { Loader } from "../../reusableComponents";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import firebase from "firebase/compat/app";

import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { SideBar } from "../index";
import { useSnackbar } from "notistack";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const getNotifUserData = async (senderUid) => {
    try {
      const docRef = db.collection("users").doc(senderUid);
      const snapshot = await docRef.get();
      return snapshot.exists ? snapshot.data() : null;
    } catch (error) {
      console.error("Error fetching doc: ", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(auth?.currentUser?.uid)
      .collection("notifications")
      .orderBy("timestamp", "desc")
      .onSnapshot(async (snapshot) => {
        const fetchedNotifications = [];

        for (const doc of snapshot.docs) {
          const { sender, recipient, message } = doc.data();
          const userData = await getNotifUserData(sender);
          if (userData) {
            const { photoURL, username, name } = userData;
            fetchedNotifications.push({
              id: doc.id,
              sender: sender,
              recipient: recipient,
              photoURL: photoURL,
              username: username,
              name: name,
              message: message,
            });
          }
        }

        setNotifications(fetchedNotifications);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  async function handleRemoveNotifiction(
    currentUserUid,
    targetUserUid,
    accept,
  ) {
    const batch = db.batch();
    const friendRequestRef = db
      .collection("users")
      .doc(currentUserUid)
      .collection("friendRequests")
      .doc(targetUserUid);

    const notificationRef = db
      .collection("users")
      .doc(currentUserUid)
      .collection("notifications")
      .doc(targetUserUid);

    // Queue the delete operations in the batch
    batch.delete(friendRequestRef);
    batch.delete(notificationRef);

    // Commit the batch
    batch
      .commit()
      .then(() => {
        enqueueSnackbar(`Friend Request ${accept ? "Accepted" : "Declined"}!`, {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(`Error Occurred: ${error}`, {
          variant: "error",
        });
      });
  }

  async function handleAcceptRequest(currentUserUid, targetUserUid) {
    const batch = db.batch();

    const currentUserRef = db.collection("users").doc(currentUserUid);
    const targetUserRef = db.collection("users").doc(targetUserUid);

    batch.update(currentUserRef, {
      Friends: firebase.firestore.FieldValue.arrayUnion(targetUserUid),
    });

    batch.update(targetUserRef, {
      Friends: firebase.firestore.FieldValue.arrayUnion(currentUserUid),
    });

    await handleRemoveNotifiction(currentUserUid, targetUserUid, true);
    await batch.commit().catch((error) => {
      enqueueSnackbar(`Error Occurred: ${error}`, {
        variant: "error",
      });
    });
  }

  return (
    <>
      <SideBar />
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="notification-container">
          <Box>
            <div
              className="profile__favourites"
              style={{ marginBlock: "1.5rem" }}
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
                  {notifications.map((notification) => {
                    const { id, message, username, name, photoURL } =
                      notification;
                    return (
                      <div key={id} className="notif-message-container">
                        <img
                          src={photoURL}
                          alt={name}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                          }}
                        />

                        <div className="notif-message">
                          {message} from{" "}
                          <Link
                            className="friend-request-sender-name"
                            to={`/dummygram/user/${username ? username : ""}`}
                          >
                            {name ? name : ""}.
                          </Link>
                          <div style={{ marginTop: "10px" }}>
                            <button
                              className="accept-btn notif-btn"
                              onClick={() => {
                                handleAcceptRequest(
                                  notification.recipient,
                                  notification.sender,
                                );
                              }}
                            >
                              Accept
                            </button>
                            <button
                              className="decline-btn notif-btn"
                              onClick={() =>
                                handleRemoveNotifiction(
                                  notification.recipient,
                                  notification.sender,
                                )
                              }
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
