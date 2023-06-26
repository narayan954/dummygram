import "./index.css";

import React, { useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { auth, facebookProvider, googleProvider } from "../../lib/firebase";
import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { getModalStyle, useStyles } from "../../App";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../assets/logo.webp";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const classes = useStyles();

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
        navigate("/dummygram");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          enqueueSnackbar("Invalid email address", {
            variant: "error",
          });
        } else if (error.code === "auth/user-not-found") {
          enqueueSnackbar("User not found", {
            variant: "error",
          });
        } else if (error.code === "auth/wrong-password") {
          enqueueSnackbar("Wrong password", {
            variant: "error",
          });
        } else if (
          error.code === "auth/account-exists-with-different-credential"
        ) {
          enqueueSnackbar("Account exists with a different credential", {
            variant: "error",
          });
        } else {
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        }
      });
  };

  const signInWithGoogle = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(googleProvider)
      .then(() => {
        enqueueSnackbar("Login successful!", {
          variant: "success",
        });
        navigate("/dummygram");
      })
      .catch((error) =>
        // enqueueSnackbar(error.message, {
        //   variant: "error",
        // })
        {
          if (error.code === "auth/account-exists-with-different-credential") {
            enqueueSnackbar("Account exists with a different credential", {
              variant: "error",
            });
          } else {
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          }
        }
      );
  };

  const signInWithFacebook = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(facebookProvider)
      .then(() => {
        enqueueSnackbar("Login successful!", {
          variant: "success",
        });
        navigate("/dummygram");
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          enqueueSnackbar("Account exists with a different credential", {
            variant: "error",
          });
        } else {
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        }
      });
  };

  const navigateToSignup = () => {
    navigate("/dummygram/signup");
  };

  return (
    <div className="flex">
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
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
            <button
              onClick={(e) => handleShowPassword(e)}
              className="show-password"
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
