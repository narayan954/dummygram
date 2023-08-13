import "./index.css";

import { auth, db } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LockedFriendPage from "./Locked";
import blankImg from "../../assets/blank-profile.webp";
import { useSnackbar } from "notistack";

const FriendsComponent = () => {
  const { username } = useParams();
  const [friendsArr, setFriendsArr] = useState([]);
  const [name, setName] = useState("user");
  const [isFriend, setIsFriend] = useState(true);
  const currentUserUid = auth?.currentUser?.uid;

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const getFriendData = async (friendUid) => {
    try {
      const docRef = db.collection("users").doc(friendUid);
      const snapshot = await docRef.get();
      return snapshot.exists ? snapshot.data() : null;
    } catch (error) {
      console.error("Error fetching doc: ", error);
      return null;
    }
  };

  async function checkCurrentUser() {
    const docRef = db.collection("users").doc(currentUserUid);
    const docSnap = await docRef.get();
    const data = docSnap.data();

    return data.username === username;
  }

  useEffect(() => {
    async function getFriendsArr() {
      let docRef;
      if (checkCurrentUser) {
        docRef = db
          .collection("users")
          .where("username", "==", username)
          .limit(1);
      } else {
        docRef = db
          .collection("users")
          .where("username", "==", username)
          .where("Friends", "array-contains", currentUserUid)
          .limit(1);
      }
      const snapshot = await docRef.get().catch((err) => {
        enqueueSnackbar(`Error getting friends: ${err}`, {
          variant: "error",
        });
      });
      if (snapshot.empty) {
        setIsFriend(false);
      } else {
        const userData = snapshot.docs[0].data();
        const fetchedFriends = [];
        setName(userData.displayName);
        for (const friendUid of userData.Friends) {
          const friendData = await getFriendData(friendUid);
          if (friendData) {
            fetchedFriends.push({
              ...friendData,
            });
          }
        }

        setFriendsArr(fetchedFriends);
      }
    }
    currentUserUid && getFriendsArr();
  }, [currentUserUid]);

  return (
    <div className="friends_page_main_container">
      {isFriend ? (
        <div className="friends_page_sub_container">
          <h1 className="friend_page_header">{name}'s Friend List</h1>
          <ul className="friend_page_friend_list_container">
            {friendsArr.length > 0 &&
              friendsArr.map((friend) => {
                const { displayName, photoURL, bio, username } = friend;
                return (
                  <li key={username} className="friend_page_friend_list_item">
                    <img
                      src={photoURL ? photoURL : blankImg}
                      alt={displayName ? displayName : "user"}
                      className="friend_page_friend_avatar"
                      onClick={() => navigate(`/dummygram/user/${username}`)}
                    />
                    <div>
                      <h3
                        className="friend_page_friend_name"
                        onClick={() => navigate(`/dummygram/user/${username}`)}
                      >
                        {displayName ? displayName : "user"}
                      </h3>
                      <span className="friend_page_friend_bio">
                        {bio ? bio : "..."}
                      </span>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      ) : (
        <LockedFriendPage name={username} />
      )}
    </div>
  );
};

export default FriendsComponent;
