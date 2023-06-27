import "./index.css"
import { useEffect, useState, useRef } from "react";
import { db } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Username = ({ user }) => {
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameAlreayGiven, setUsernameAlreadyGiven] = useState(false)
  const usernameRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }


  const checkUsername = () => {
    const name = usernameRef.current;
    const regex = /^[A-Za-z][A-Za-z0-9_]{4,17}$/gi;
    if (!regex.test(name)) {
      setUsernameAvailable(false);
    } else {
      debounce(findUsernameInDB());
    }
  };

  const findUsernameInDB = async () => {
    const ref = await db.doc(`usernames/${usernameRef.current}`);
    const { exists } = await ref.get();
    setUsernameAvailable(!exists);
  };

  const getUsername = async (e) => {
    e.preventDefault();
    if (!usernameAvailable) {
      enqueueSnackbar("Username not available!", {
        variant: "error",
      });
      return;
    }
    const usernameDoc = db.doc(`usernames/${username}`);
    const batch = db.batch();
    batch.set(usernameDoc, { uid: user.uid })
    batch.commit()
      .then(() => {
        enqueueSnackbar(
          `Congratulations! you got your Username ${username}`,
          {
            variant: "success",
          }
        );
        navigate("/dummygram");
      })
      .catch((error) => {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      });
  }

  const alreadyHasUsername = async () => {
      const collectionReference = db.collection("usernames");
      const query = await collectionReference.where("uid", "==", user.uid);
      query.get().then(function(querySnapshot) {
        if (!querySnapshot.empty) {
            setUsernameAlreadyGiven(true)
            navigate("/dummygram")
          } 
    });
  }

  if(user){
    alreadyHasUsername()
  }

  return (
    <div className="username-container">
      <div className="username-sub-container">
        <h2
          htmlFor="get-username-input"
          className="username-heading">
          Let's get a Username for you🤗
        </h2>
        <input
          type="text"
          placeholder="Enter username"
          id="get-username-input"
          value={username}
          onChange={(e) => {
            usernameRef.current = e.target.value.trim();
            setUsername(e.target.value.trim());
            checkUsername();
          }}
          className={
            usernameAvailable
              ? "username-available"
              : "username-not-available"
          }
        />
        <button
          className="button-style get-username-btn"
          onClick={getUsername}>
          Get it
        </button>
      </div>
    </div>
  )
}


export default Username
