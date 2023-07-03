import "./index.css";

import React, { useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { auth, db, facebookProvider, googleProvider } from "../../lib/firebase";
import { errorSound, successSound } from "../../assets/sounds";
import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../assets/app-logo.png"
import loginRight from "../../assets/loginleft.jpg"
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
    <section className="login__section">
      <div className="login__left">
        <form>
          <div className="form__top">
            <img src={Logo} alt="" />
            <div className="greetings">
              <h3>Hey, hello 👋</h3>
              <p>Enter your information to get started</p>
            </div>
          </div>

          <div className="form__bottom">
            <div className="input__group">
              <label htmlFor="email">Email</label>
              <input type="email"             
              placeholder="Enter your email"
              value={email}
              id="email" 
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
                handleError(e.target.name, e.target.value);
              }}
              className={error.emailError ? "error-border" : null}
              required />
            {error.email && error.emailError && (
            <p className="error">{error.emailError}</p>
            )}

            </div>
            <div className="input__group">
              <label htmlFor="password">Password</label>
              <div id="password-container" className="password-container pass__input__container">
              <input 
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
               id="password" required />
              <button
              onClick={(e) => handleShowPassword(e)}
              className="show-password"
              >
              {showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
              </button>
            </div>
          </div>
            <button type="submit" onClick={signIn} className="action__btn login__btn">
            LogIn <FontAwesomeIcon icon={faRightToBracket} />
          </button>
          <div className="other__login__method">
          <div className="or option__divider">
            <div className="line" />
            <div style={{ padding: "5px 9px" }}>or</div>
            <div className="line" />
          </div>
          <div className="google__fb--login">
            <button className="other__login" type="submit" onClick={signInWithGoogle}>
              <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
            </button>
            <button
              className="other__login"
              type="submit"
              onClick={signInWithFacebook}
            >
              <FontAwesomeIcon icon={faSquareFacebook} /> Sign in with Facebook
            </button>
          </div>
          </div>
          <div className="forgot__new">
          <div className="forgot-pasword">
            <span role={"button"} onClick={navigateToForgot}>
              Forgot Password
            </span>
          </div>
          <div className="no__acct">
              New User? 
            <span role={"button"} onClick={navigateToSignup}> Sign up!</span>
          </div>
        </div>
          </div>
      </form>
      </div>
      <div className="login__right">
        <img src={loginRight} alt="" />
      </div>
    </section>
  );
};

export default LoginScreen;