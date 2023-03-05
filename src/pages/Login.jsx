import React, { useState, useEffect } from "react";
import { getModalStyle, useStyles } from "../App";
import { auth, googleProvider, facebookProvider } from "../lib/firebase";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { faRightToBracket} from "@fortawesome/free-solid-svg-icons"

const LoginScreen = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const buttonStyle = {
    background: "linear-gradient(40deg, #e107c1, #59afc7)",
    borderRadius: "20px",
    ":hover": {
      background: "linear-gradient(-40deg, #59afc7, #e107c1)",
    },
  };

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        enqueueSnackbar("Login successful!", {
          variant: "success",
        });
      })
      .catch((error) =>
        enqueueSnackbar(error.message, {
          variant: "error",
        })
      )
      .finally(() => {});
  };

  const signInWithGoogle = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(googleProvider)
      .then(() => {
        enqueueSnackbar("Login successful!", {
          variant: "success",
        });
      })
      .catch((error) =>
        enqueueSnackbar(error.message, {
          variant: "error",
        })
      )
      .finally(() => {});
  };

  const signInWithFacebook = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(facebookProvider)
      .then(() => {
        enqueueSnackbar("Login successful!", {
          variant: "success",
        });
      })
      .catch((error) =>
        enqueueSnackbar(error.message, {
          variant: "error",
        })
      )
      .finally(() => {});
  };

  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <div style={getModalStyle()} className={classes.paper}>
        <form className="modal__signup">
          <img
            src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
            alt="dummygram"
            className="modal__signup__img"
            style={{
              width: "80%",
              filter: "invert(var(--val))",
            }}
          />
          <input
            type="email"
            placeholder=" Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder=" Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" onClick={signIn} className="button log">
            LogIn <FontAwesomeIcon style={faRightToBracket}></FontAwesomeIcon>
          </button>

          <div className="or">
            <div className="line"></div>
            <div style={{ padding: "9px" }}>or</div>
            <div className="line"></div>
          </div>
          <div className="google-fb-login">
            <button className="button" type="submit" onClick={signInWithGoogle}>
              <FontAwesomeIcon icon={faGoogle}></FontAwesomeIcon>
            </button>
            <button
              className="button"
              type="submit"
              onClick={signInWithFacebook}
            >
              <FontAwesomeIcon icon={faSquareFacebook}></FontAwesomeIcon>
            </button>
          </div>
          <button
            type="submit"
            onClick={() => {
              history.push("/dummygram/signup");
            }}
            className="button reg"
          >
            Need an account <span> Sign up </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
