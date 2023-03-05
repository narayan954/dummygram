import React, { useState, useEffect } from "react";
import { getModalStyle, useStyles } from "../App";
import { Input } from "@mui/material";
import AnimatedButton from "../components/AnimatedButton";
import { auth, googleProvider, facebookProvider } from "../lib/firebase";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

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
        // history.push('/dummygram/');
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
          <div className="logsignin">
            <button type="submit" onClick={signIn} className="log">
              LogIn <i class="fa-solid fa-right-to-bracket"></i>
            </button>
          </div>

          <div className="or">
            <div className="line"></div>
            <div style={{ padding: "9px" }}>or</div>
            <div className="line"></div>
          </div>
          <div className="g-fb-lin">
            <button type="submit" onClick={signInWithGoogle}>
              <i class="fa-brands fa-google"></i>
            </button>
            <button type="submit" onClick={signInWithFacebook}>
              <i class="fa-brands fa-facebook"></i>
            </button>
          </div>
          <button
            type="submit"
            onClick={() => {
              history.push("/dummygram/signup");
            }}
            className="reg"
          >
            Need an account <span> Sign up </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
