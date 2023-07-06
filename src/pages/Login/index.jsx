import "./index.css";

import React, { useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { auth, db, facebookProvider, googleProvider } from "../../lib/firebase";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { playErrorSound, playSuccessSound } from "../../js/sounds";

import Facebook from "../../assets/facebook.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Google from "../../assets/goggle.svg";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo.webp";
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
            <img src={logo} alt="dummygram logo" />
            <div className="greetings">
              <h3>Hey, hello 👋</h3>
              <p>Enter your information to get started</p>
            </div>
          </div>

          <div className="form__bottom">
            <div className="input__group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                id="email"
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleError(e.target.name, e.target.value);
                }}
                className={error.emailError ? "error-border" : null}
                required
              />
              {error.email && error.emailError && (
                <p className="error">{error.emailError}</p>
              )}
            </div>
            <div className="input__group">
              <label htmlFor="password">Password</label>
              <div id="password-container" className="pass__input__container">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  required
                />
                <button
                  onClick={(e) => handleShowPassword(e)}
                  className="show__hide--pass"
                >
                  {showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              onClick={signIn}
              className="action__btn login__btn"
            >
              LogIn <FontAwesomeIcon icon={faRightToBracket} />
            </button>
            <div className="forgot__new">
              <div className="forgot-pasword">
                <span role={"button"} onClick={navigateToForgot}>
                  Forgot Password
                </span>
              </div>
              <div className="have-account">
                New User?
                <span role={"button"} onClick={navigateToSignup}>
                  {" "}
                  Sign up!
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="login__right">
        {/* <img src={loginRight} alt="website image" /> */}
      </div>
    </section>
  );
};

export default LoginScreen;
