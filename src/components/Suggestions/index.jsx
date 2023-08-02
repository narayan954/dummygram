import "./index.css";

import { auth, db } from "../../lib/firebase";
import { useEffect, useRef, useState } from "react";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import blankImg from "../../assets/blank-profile.webp";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Suggestion = () => {
  const [randomDocs, setRandomDocs] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const currentUser = auth.currentUser;
  const { enqueueSnackbar } = useSnackbar();

  const checkFriendRequestSent = async (uid) => {
    const currentUserUid = currentUser?.uid;
    const targetUserUid = uid;

    if (targetUserUid) {
      const friendRequestsRef = db
        .collection("users")
        .doc(targetUserUid)
        .collection("friendRequests");
      const query = friendRequestsRef
        .where("sender", "==", currentUserUid)
        .where("recipient", "==", targetUserUid)
        .limit(1);

      const snapshot = await query.get();
      if (!snapshot.empty) {
        return true;
      }
    }
    return false;
  };

  const fetchRandomDocument = async () => {
    const collectionRef = db.collection("users");

    // Generate a new auto-id (random value)
    const randomValue = collectionRef.doc().id;

    const snapshot = await collectionRef
      .orderBy(firebase.firestore.FieldPath.documentId())
      .startAt(randomValue)
      .limit(5)
      .get();

    const randomDocuments = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const isFriendRequestSent = await checkFriendRequestSent(data.uid);
        return { ...data, friendRequestSent: isFriendRequestSent };
      }),
    );
    setRandomDocs(randomDocuments);
  };

  useEffect(() => {
    fetchRandomDocument();
  }, []);

  const handleSendFriendRequest = (
    friendRequestSent,
    uid,
    name,
    username,
    idx,
  ) => {
    const currentUserUid = currentUser?.uid;
    const targetUserUid = uid;
    const batch = db.batch();

    const friendRequestRef = db
      .collection("users")
      .doc(targetUserUid)
      .collection("friendRequests")
      .doc(currentUserUid);

    const notificationRef = db
      .collection("users")
      .doc(targetUserUid)
      .collection("notifications")
      .doc(currentUserUid);

    if (friendRequestSent) {
      batch.delete(friendRequestRef);
      batch.delete(notificationRef);

      batch
        .commit()
        .then(() => {
          const updatedDocuments = [...randomDocs];
          updatedDocuments[idx].friendRequestSent = false;
          setRandomDocs(updatedDocuments);
          enqueueSnackbar("Friend Request Declined", {
            variant: "success",
          });
        })
        .catch((error) => {
          enqueueSnackbar(`Error Occurred: ${error}`, {
            variant: "error",
          });
        });
    } else {
      const friendRequestData = {
        sender: currentUserUid,
        recipient: targetUserUid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const notificationData = {
        recipient: targetUserUid,
        sender: currentUserUid,
        message: "You have received a friend request",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };

      batch.set(friendRequestRef, friendRequestData);
      batch.set(notificationRef, notificationData);

      batch
        .commit()
        .then(() => {
          const updatedDocuments = [...randomDocs];
          updatedDocuments[idx].friendRequestSent = true;
          setRandomDocs(updatedDocuments);
          enqueueSnackbar("Friend Request Sent", {
            variant: "success",
          });
        })
        .catch((error) => {
          enqueueSnackbar(`Error Occurred: ${error}`, {
            variant: "error",
          });
        });
    }
  };

  const scroll = (scrollOffset) => {
    scrollRef.current.scrollLeft += scrollOffset;
  };

  return (
    <div className="suggestion-main-container">
      <button
        className="suggestion-scroll-btn suggestion-scroll-btn-left"
        onClick={() => scroll(-160)}
      >
        <ArrowBackIosIcon className="suggestion-scroll" />
      </button>
      <ul className="suggestion-user-container" ref={scrollRef}>
        {randomDocs.map((user, idx) => {
          const { photoURL, username, name, uid, bio, friendRequestSent } =
            user;
          return (
            <li
              className="suggestion-user-list-item"
              onClick={() => navigate(`/dummygram/user/${username}`)}
              key={uid}
            >
              <img
                src={photoURL ? photoURL : blankImg}
                alt={name ? name : "user"}
                className="suggestion-user-img"
              />
              <div className="suggestion-user-data">
                <h4 className="suggestion-user-name">{name}</h4>
                <p className="suggestion-user-bio">{bio ? bio : "..."}</p>
                {uid !== currentUser?.uid && (
                  <button
                    className="suggestion-user-btn button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendFriendRequest(
                        friendRequestSent,
                        uid,
                        name,
                        username,
                        idx,
                      );
                    }}
                  >
                    {friendRequestSent ? "Remove Request" : "Add Friend"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <button
        className="suggestion-scroll-btn suggestion-scroll-btn-right"
        onClick={() => scroll(160)}
      >
        <ArrowForwardIosIcon className="suggestion-scroll" />
      </button>
    </div>
  );
};

export default Suggestion;
