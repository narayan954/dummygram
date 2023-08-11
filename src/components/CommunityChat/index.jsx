import "./index.css";

import { auth, db } from "../../lib/firebase";
import { playErrorSound, playSuccessSound } from "../../js/sounds";
import { useEffect, useRef, useState } from "react";

import { ClickAwayListener } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import EmojiPicker from "emoji-picker-react";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { Loader } from "../../reusableComponents";
import OptionIcon from "@mui/icons-material/MoreVert";
import Reaction from "./Reaction";
import SendIcon from "@mui/icons-material/Send";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import firebase from "firebase/compat/app";
import profileAvatar from "../../assets/blank-profile.webp";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const ChatBox = () => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadMoreMsgs, setLoadMoreMsgs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isLastMsgRecieved, setIsLastMsgRecieved] = useState(false);
  const chatMsgContainerRef = useRef(null);
  const [openOptions, setOpenOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleEmojiClick = () => {
    setShowEmojis((prevShowEmojis) => !prevShowEmojis);
  };

  const onEmojiClick = (emojiObject, event) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojis(false);
  };

  const handleOpenOptions = (messageId) => {
    setOpenOptions(messageId);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewMessage("");
  };

  const handleEditMsg = (messageId) => {
    const messageToEdit = messages.find((message) => message.id === messageId);
    if (messageToEdit) {
      setNewMessage(messageToEdit.text);
      setIsEditing(true);
      setEditingMessageId(messageId);
    }
  };

  const handleDeletMsg = async (messageId) => {
    try {
      await db.collection("messages").doc(messageId).delete();
      playSuccessSound();
      enqueueSnackbar("Message deleted successfully.", {
        variant: "success",
      });
    } catch (error) {
      playErrorSound();
      enqueueSnackbar("Failed to delete the message. Please try again.", {
        variant: "error",
      });
    }
  };

  function handleChange(e) {
    e.preventDefault();
    setNewMessage(e.target.value);
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    if (newMessage.trim()) {
      if (isEditing && editingMessageId) {
        // If user is in edit mode, update the existing message
        db.collection("messages")
          .doc(editingMessageId)
          .update({
            text: newMessage,
            edited: true,
          })
          .then(() => {
            setNewMessage("");
            setIsEditing(false);
            setEditingMessageId(null);
          })
          .catch((error) => {
            enqueueSnackbar(`Error Occurred: ${error}`, {
              variant: "error",
            });
          });
      } else {
        // If not in edit mode, send a new message
        db.collection("messages").add({
          text: newMessage,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });

        setNewMessage("");
      }
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

  function getTime(timestamp) {
    const timeInMilliSec = timestamp * 1000;
    const date = new Date(timeInMilliSec);
    const timeWithSec = date.toLocaleTimeString();
    const [time, timePeriod] = timeWithSec.split(" ");
    const formattedTime = time.split(":").slice(0, 2).join(":") + timePeriod;
    return formattedTime;
  }

  function getReaction(reaction) {
    const reactionsArr = Object.keys(reaction);
    let emoji = "";

    const rxnList = reactionsArr.map((rxn) => {
      switch (rxn) {
        case "smiley":
          emoji = "😅";
          break;
        case "like":
          emoji = "❤️";
          break;
        case "laughing":
          emoji = "😂";
          break;
        default:
          emoji = "👍";
      }

      return (
        reaction[rxn].length > 0 && (
          <li
            className="rxn-container"
            key={rxn}
            onClick={() => setShowRxnList((prev) => !prev)}
          >
            {emoji}
            <span className="rxn-count">{reaction[rxn].length}</span>
          </li>
        )
      );
    });
    return rxnList;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/dummygram/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const scrollTop = () => {
      window.scrollTo({ top: window.innerHeight + 800 });
    };
    if (!isLastMsgRecieved) {
      scrollTop();
    }
  }, [messages]);

  //Load messages for the first time
  useEffect(() => {
    const handleMouseScroll = (event) => {
      if (event.target.documentElement.scrollTop === 0 && !isLastMsgRecieved) {
        setLoadMoreMsgs(true);
      }
    };
    window.addEventListener("scroll", handleMouseScroll);
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
        setIsLoading(false);
      });

    return () => {
      window.removeEventListener("scroll", handleMouseScroll);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubscribed = false;

    if (loadMoreMsgs && messages.length) {
      const lastMessageCreatedAt = messages[0].createdAt;
      db.collection("messages")
        .orderBy("createdAt")
        .endBefore(lastMessageCreatedAt)
        .limitToLast(20)
        .onSnapshot((querySnapshot) => {
          if (!unsubscribed) {
            setMessages((loadedMsgs) => {
              return [
                ...querySnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                })),
                ...loadedMsgs,
              ];
            });

            if (querySnapshot.empty) {
              setIsLastMsgRecieved(true);
            }
          }
        });
    }

    return () => {
      setLoadMoreMsgs(false);
      unsubscribed = true;
    };
  }, [loadMoreMsgs]);

  return (
    <>
      <div className="chat-main-container">
        <div className="closeBtn">
          <HighlightOffRoundedIcon onClick={() => navigate("/dummygram/")} />
        </div>

        {isLoading ? (
          <div className="chat-loader-container">
            <Loader />
          </div>
        ) : (
          <div className="all-chat-msg-container" ref={chatMsgContainerRef}>
            <ul className="chat-msg-container">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={`chat-message ${
                    user?.uid == message.uid ? "current-user-msg" : ""
                  }`}
                >
                  <img
                    src={message.photoURL || profileAvatar}
                    alt={message.displayName}
                    className={"chat-user-img"}
                    onClick={() => goToUserProfile(message.uid)}
                  />
                  <div className="chat-msg-text">
                    <span className="name-and-date-container">
                      <h5
                        className="chat-msg-sender-name"
                        onClick={() => goToUserProfile(message.uid)}
                      >
                        {message.displayName}
                      </h5>
                      <span className="time-reaction-container">
                        <h6 className="message-time">
                          {getTime(message?.createdAt?.seconds)}
                        </h6>
                        <Reaction message={message} userUid={message.uid} />
                        {user.uid === message.uid && (
                          <span className="flex-center message-options">
                            <OptionIcon
                              onClick={() => {
                                setOpenOptions(true);
                                handleOpenOptions(message.id);
                              }}
                            />
                            {openOptions && openOptions === message.id && (
                              <ClickAwayListener
                                onClickAway={() => setOpenOptions(false)}
                              >
                                <div className="delete-message-container">
                                  <span
                                    className="delete-option"
                                    onClick={() => handleDeletMsg(message.id)}
                                  >
                                    <DeleteIcon />
                                    Delete
                                  </span>
                                  <span
                                    className="edit-option"
                                    onClick={() => handleEditMsg(message.id)}
                                  >
                                    <EditIcon />
                                    Edit
                                  </span>
                                </div>
                              </ClickAwayListener>
                            )}
                          </span>
                        )}
                      </span>
                    </span>
                    <p>{message.text}</p>
                    {message.edited && (
                      <div className="edit-state">
                        <span>Edited</span>
                      </div>
                    )}
                    {message.reaction && (
                      <ul className="rxn-main-container">
                        {getReaction(message.reaction)}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <form className="chat-input-container" onSubmit={handleOnSubmit}>
        {showEmojis && (
          <ClickAwayListener onClickAway={() => setShowEmojis(false)}>
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
          </ClickAwayListener>
        )}
        <SentimentVerySatisfiedIcon
          className="communitychat-emoji-btn"
          style={{ color: "rgb(242, 186, 4)", fontSize: "2rem" }}
          onClick={handleEmojiClick}
        />
        <input
          style={{ boxShadow: "none", border: "none" }}
          type="text"
          onChange={handleChange}
          value={newMessage}
          className="chat-input"
          maxLength={250}
          placeholder="Enter message"
        />
        {isEditing && (
          <CloseIcon
            style={{ color: "var(--text-grey)" }}
            onClick={handleCancel}
          />
        )}
        <button className="chat-msg-send-btn-container">
          <SendIcon className="chat-msg-send-btn" onClick={handleOnSubmit} />
        </button>
      </form>
    </>
  );
};

export default ChatBox;
