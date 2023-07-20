import "./index.css"
import SendIcon from '@mui/icons-material/Send';
import { db, auth } from "../../lib/firebase"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import { useSnackbar } from "notistack";


const ChatBox = () => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
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
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }))
                setMessages(data)
            })

        return unsubscribe
    }, [db])

    function handleChange(e) {
        e.preventDefault()
        setNewMessage(e.target.value)
    }

    function handleOnSubmit(e) {
        e.preventDefault()
        if(newMessage.trim() !== "" && db){
                db.collection('messages').add({
                    text: newMessage,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                })
    
                setNewMessage("")
            }
    }

    function goToUserProfile(uid) {
        async function getUsername() {
            const docRef = db.collection("users").doc(uid);
            docRef
                .get()
                .then((doc) => {
                    navigate(`/dummygram/${doc.data().username}`)
                })
                .catch((error) => {
                    enqueueSnackbar(`Error Occured: ${error}`, {
                        variant: "error",
                    });
                });
        }

        getUsername()
    }


    return (
        <div className="chat-main-container">
            <div className="all-chat-msg-container">
                <ul className="chat-msg-container">
                    {messages.map(message => (
                        <li key={message.id}
                            className={`chat-message ${user?.uid == message.uid ? "current-user-msg" : ""}`}
                        >
                            <img
                                src={message.photoURL}
                                alt={message.displayName}
                                className={`chat-user-img`}
                                onClick={() => goToUserProfile(message.uid)}
                            />
                            <p className="chat-msg-text">
                                {message.text}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            <form className="chat-input-container" onSubmit={handleOnSubmit}>
                <input
                    type="text"
                    onChange={handleChange}
                    value={newMessage}
                    className="chat-input"
                    maxLength={250}
                />
                <button className="chat-msg-send-btn-container">
                    <SendIcon
                        className="chat-msg-send-btn"
                        onClick={handleOnSubmit}
                    />
                </button>
            </form>
        </div>
    )
}

export default ChatBox
