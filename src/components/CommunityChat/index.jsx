import "./index.css";

import { auth, db } from "../../lib/firebase";
import { useEffect, useState } from "react";

import EmojiPicker from "emoji-picker-react";
import SendIcon from "@mui/icons-material/Send";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const ChatBox = () => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);

  const handleEmojiClick = () => {
    setShowEmojis((prevShowEmojis) => !prevShowEmojis);
  };

  const onEmojiClick = (emojiObject, event) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojis(false);
  };

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser && !authUser.isAnonymous) {
        setUser(authUser);
      } else {
        setUser(null);
        navigate("/dummygram/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .orderBy("createdAt")
      .limitToLast(20)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(data);
      });

    return unsubscribe;
  }, [db]);

  function handleChange(e) {
    e.preventDefault();
    setNewMessage(e.target.value);
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    if (newMessage.trim()) {
      db.collection("messages").add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      setNewMessage("");
    } else {
      enqueueSnackbar("Enter something!", {
        variant: "error",
      });
    }
  }

  function goToUserProfile(uid) {
    async function getUsername() {
      const docRef = db.collection("users").doc(uid);
      docRef
        .get()
        .then((doc) => {
          navigate(`/dummygram/user/${doc.data().username}`);
        })
        .catch((error) => {
          enqueueSnackbar(`Error Occured: ${error}`, {
            variant: "error",
          });
        });
    }

    getUsername();
  }

  return (
    <div className="chat-main-container">
      <span className="chat-header">showing last 20 messages</span>
      <div className="all-chat-msg-container">
        <ul className="chat-msg-container">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`chat-message ${
                user?.uid == message.uid ? "current-user-msg" : ""
              }`}
            >
              <img
                src={message.photoURL}
                alt={message.displayName}
                className={"chat-user-img"}
                onClick={() => goToUserProfile(message.uid)}
              />
              <div className="chat-msg-text">
                <h5
                  className="chat-msg-sender-name"
                  onClick={() => goToUserProfile(message.uid)}
                >
                  {message.displayName}
                </h5>
                <p>{message.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form className="chat-input-container" onSubmit={handleOnSubmit}>
        {showEmojis && (
          <div
            style={{
              position: "absolute",
              top: "-350px",
              left: 0,
              zIndex: 999,
            }}
          >
            <EmojiPicker
              emojiStyle="native"
              height={330}
              searchDisabled
              style={{ zIndex: 999 }}
              onEmojiClick={onEmojiClick}
              previewConfig={{
                showPreview: false,
              }}
            />
          </div>
        )}
        <SentimentVerySatisfiedIcon
          className="communitychat-emoji-btn"
          style={{ color: "rgb(242, 186, 4)", fontSize: "2rem" }}
          onClick={handleEmojiClick}
        />
        <input
          type="text"
          onChange={handleChange}
          value={newMessage}
          className="chat-input"
          maxLength={250}
        />
        <button className="chat-msg-send-btn-container">
          <SendIcon className="chat-msg-send-btn" onClick={handleOnSubmit} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
