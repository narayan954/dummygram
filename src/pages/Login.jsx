import React, { useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { auth, facebookProvider, googleProvider } from "../lib/firebase";
import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { getModalStyle, useStyles } from "../App";

import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../assets/logo.png";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const LoginScreen = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

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

  const navigateToSignup = () => {
    navigate("/dummygram/signup");
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
            src={Logo}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              border: "1px solid rgba(104, 85, 224, 1)",
              height: "100%",
              boxSizing: "border-box",
              marginTop: "10px",
              backgroundColor: "white",
              boxShadow: "0 0 20px rgba(104, 85, 224, 0.2)",
              borderRadius: "4px",
              // padding: "10px",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                margin: 0,
                boxShadow: "none",
              }}
            />
            <button
              onClick={(e) => handleShowPassword(e)}
              style={{
                height: "100%",
                width: "50px",
                margin: 0,
                background: "transparent",
                outline: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
            </button>
          </div>
          <button type="submit" onClick={signIn} className="button log">
            LogIn <FontAwesomeIcon icon={faRightToBracket} />
          </button>

          <div className="or">
            <div className="line" />
            <div style={{ padding: "9px" }}>or</div>
            <div className="line" />
          </div>
          <div className="google-fb-login">
            <button className="button" type="submit" onClick={signInWithGoogle}>
              <FontAwesomeIcon icon={faGoogle} />
            </button>
            <button
              className="button"
              type="submit"
              onClick={signInWithFacebook}
            >
              <FontAwesomeIcon icon={faSquareFacebook} />
            </button>
          </div>
          <div className="have-account">
            Need an account{" "}
            <span role={"button"} onClick={navigateToSignup}>
              Sign up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
