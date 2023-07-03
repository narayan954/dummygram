import "./index.css";

import React, { useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { auth, db, facebookProvider, googleProvider } from "../../lib/firebase";
import { errorSound, successSound } from "../../assets/sounds";
import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { getModalStyle, useStyles } from "../../App";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../assets/logo.webp";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import validate from "../../reusableComponents/validation";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ email: true });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const classes = useStyles();

  function playSuccessSound() {
    new Audio(successSound).play();
  }

  function playErrorSound() {
    new Audio(errorSound).play();
  }

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const signIn = (e) => {
    e.preventDefault();
    if (!error.email && password !== "") {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          playSuccessSound();
          enqueueSnackbar("Login successful!", {
            variant: "success",
          });
          navigate("/dummygram");
        })
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            playErrorSound();
            enqueueSnackbar("Invalid email address", {
              variant: "error",
            });
          } else if (error.code === "auth/user-not-found") {
            playErrorSound();
            enqueueSnackbar("User not found", {
              variant: "error",
            });
          } else if (error.code === "auth/wrong-password") {
            playErrorSound();
            enqueueSnackbar("Wrong password", {
              variant: "error",
            });
          } else if (
            error.code === "auth/account-exists-with-different-credential"
          ) {
            playErrorSound();
            enqueueSnackbar("Account exists with a different credential", {
              variant: "error",
            });
          } else {
            playErrorSound();
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          }
        });
    } else {
      playErrorSound();
      enqueueSnackbar("Please fill all fields with valid data", {
        variant: "error",
      });
    }
  };

  const signInWithGoogle = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(googleProvider)
      .then(async (val) => {
        const userRef = await db
          .collection("users")
          .where("uid", "==", val?.user?.uid);
        // alert(((await userRef.get()).docs.length))

        if ((await userRef.get()).docs.length < 1) {
          const usernameDoc = db.collection(`users`);
          await usernameDoc.doc(auth.currentUser.uid).set({
            uid: val.user.uid,
            name: val.user.displayName,
            photoURL: val.user.photoURL,
            displayName: val.user.displayName,
            Friends: [],
            posts: [],
          });
        }
        playSuccessSound();
        enqueueSnackbar("Login successful!", {
          variant: "success",
        });
        navigate("/dummygram");
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          playErrorSound();
          enqueueSnackbar("Account exists with a different credential", {
            variant: "error",
          });
        } else {
          playErrorSound();
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        }
      });
  };

  const signInWithFacebook = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(facebookProvider)
      .then(async (val) => {
        const userRef = await db
          .collection("users")
          .where("uid", "==", val?.user?.uid);
        // alert(((await userRef.get()).docs.length))
        if ((await userRef.get()).docs.length < 1) {
          const usernameDoc = db.collection(`users`);
          await usernameDoc.doc(auth.currentUser.uid).set({
            uid: val.user.uid,
            name: val.user.displayName,
            photoURL: val.user.photoURL,
            displayName: val.user.displayName,
            Friends: [],
            posts: [],
          });
        }
        playSuccessSound();
        enqueueSnackbar("Login successful!", {
          variant: "success",
        });
        navigate("/dummygram");
      })
      .catch((error) => {
        playErrorSound();
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

  const navigateToForgot = () => {
    navigate("/dummygram/forgot-password");
  };
  const navigateToSignup = () => {
    navigate("/dummygram/signup");
  };

  const handleError = (name, value) => {
    const errorMessage = validate[name](value);
    setError((prev) => {
      return { ...prev, ...errorMessage };
    });
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
              filter: "var(--filter-img)",
            }}
          />
          <input
            type="email"
            placeholder=" Email"
            value={email}
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
              handleError(e.target.name, e.target.value);
            }}
            className={error.emailError ? "error-border" : null}
          />
          {error.email && error.emailError && (
            <p className="error">{error.emailError}</p>
          )}
          <div className="password-container">
            <input
              name="password"
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
          <div className="login-footer">
            <div className="forgot-pasword">
              <span role={"button"} onClick={navigateToForgot}>
                Forgot Password
              </span>
            </div>
            <div className="have-account">
              <span role={"button"} onClick={navigateToSignup}>
                Create an account
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
