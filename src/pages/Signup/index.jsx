import "./index.css";
import "../Login/index";

import React, { useRef, useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import {
  auth,
  db,
  facebookProvider,
  googleProvider,
  storage,
} from "../../lib/firebase";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { getModalStyle, useStyles } from "../../App";
import { playErrorSound, playSuccessSound } from "../../js/sounds";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import blank_profile from "../../assets/blank-profile.webp";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import loginRight from "../../assets/login-right.webp";
import logo from "../../assets/logo.webp";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import validate from "../../reusableComponents/validation";

const SignupScreen = () => {
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [username, setUsername] = useState("");
  const [isOauthSignUp, setIsOauthSignUp] = useState(false);
  const [error, setError] = useState(validate.initialValue);
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
    const ref = db.doc(`usernames/${usernameRef.current}`);
    const { exists } = await ref.get();
    setUsernameAvailable(!exists);
  };

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = (e) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setAddress(e.target.value);
    }
  };

  const signUp = async (e) => {
    e.preventDefault();
    setSigningUp(true);
    let submitable = true;
    Object.values(error).forEach((err) => {
      if (err !== false) {
        submitable = false;
      }
    });

    if (username === "") submitable = false;

    if (!usernameAvailable) {
      playErrorSound();
      enqueueSnackbar("Username not available!", {
        variant: "error",
      });
      return;
    }

    if (submitable) {
      const usernameDoc = db.collection(`users`);
      await auth
        .createUserWithEmailAndPassword(email, password)
        .then(async (authUser) => {
          await updateProfile(auth.currentUser, {
            displayName: fullName,
          })
            .then(
              await usernameDoc.doc(auth.currentUser.uid).set({
                uid: auth.currentUser.uid,
                name: username,
                photoURL: auth.currentUser.photoURL,
                posts: [],
              })
            )
            .then(() => {
              playSuccessSound();
              enqueueSnackbar(
                `Congratulations ${fullName},you have joined Dummygram`,
                {
                  variant: "success",
                }
              );
              navigate("/dummygram");
            })
            .catch((error) => {
              playErrorSound();
              enqueueSnackbar(error.message, {
                variant: "error",
              });
            });
          const uploadTask = storage.ref(`images/${image?.name}`).put(image);
          uploadTask.on(
            "state_changed",
            () => {
              // // progress function ...
              // setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            },
            (error) => {
              playErrorSound();
              enqueueSnackbar(error.message, {
                variant: "error",
              });
            },
            () => {
              storage
                .ref("images")
                .child(image?.name)
                .getDownloadURL()
                .then((url) => {
                  authUser.user.updateProfile({
                    displayName: fullName,
                    photoURL: url,
                  });
                  playSuccessSound();
                  enqueueSnackbar("Signup Successful!", {
                    variant: "success",
                  });
                })
                .catch((error) => console.error(error));
            }
          );
        })
        .catch((error) => {
          playErrorSound();
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        })
        .finally(() => {
          setSigningUp(false);
        });
    } else {
      enqueueSnackbar("Please fill all fields with valid data", {
        variant: "error",
      });
      return;
    }
  };

  const signInWithGoogle = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(googleProvider)
      .then(async (val) => {
        setIsOauthSignUp(true);
        const usernameDoc = db.collection(`users`);
        await usernameDoc
          .doc(auth.currentUser.uid)
          .set({
            uid: val.user.uid,
            name: val.user.displayName,
            photoURL: val.user.photoURL,
            displayName: val.user.displayName,
            Friends: [],
            posts: [],
          })
          .then(() => {
            playSuccessSound();
            enqueueSnackbar(
              `Congratulations ${fullName},you have joined Dummygram`,
              {
                variant: "success",
              }
            );
            navigate("/dummygram");
          })
          .catch((error) => {
            playErrorSound();
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          });
      })
      .catch((error) =>
        enqueueSnackbar(error.message, {
          variant: "error",
        })
      );
  };

  const signInWithFacebook = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(facebookProvider)
      .then(async (val) => {
        setFullName(val?.user?.displayName);
        setEmail(val?.user?.email);
        setIsOauthSignUp(true);
        const usernameDoc = db.collection(`users`);
        await usernameDoc
          .doc(auth.currentUser.uid)
          .set({
            uid: val.user.uid,
            name: val.user.displayName,
            photoURL: val.user.photoURL,
            displayName: val.user.displayName,
            Friends: [],
            posts: [],
          })
          .then(() => {
            playSuccessSound();
            enqueueSnackbar(
              `Congratulations ${fullName},you have joined Dummygram`,
              {
                variant: "success",
              }
            );
            navigate("/dummygram");
          })
          .catch((error) => {
            playErrorSound();
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          });
      })
      .catch((error) => {
        playErrorSound();
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      });
  };

  const navigateToLogin = () => {
    navigate("/dummygram/login");
  };

  const handleError = (name, value) => {
    let errorMessage = validate[name](value);
    if (name === "confirmPassword")
      errorMessage = validate.confirmPassword(value, password);
    setError((prev) => {
      return { ...prev, ...errorMessage };
    });
  };

  return (
    <section className="login__section">
      <div className="login__left">
        <form aria-label="Sign Up Form">
          <div className="form__top">
            <img src={logo} alt="dummygram logo" />
            <div className="greetings">
              <h3>Hey, hello 👋</h3>
              <p>Welcome to DummyGram 😊, let's get your account created</p>
            </div>
          </div>
          <div className="form__bottom">
            <div className="input__group">
              <label htmlFor="file" id="file-label">
                <div className="img-outer">
                  {address ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="profile pic"
                      className="img-inner"
                    />
                  ) : (
                    <img
                      src={blank_profile}
                      alt="profile pic"
                      className="img-inner"
                    />
                  )}
                </div>
              </label>
              <input
                type="file"
                id="file"
                className="file"
                onChange={handleChange}
                accept="image/*"
                required
                aria-labelledby="file-label"
              />
            </div>
            <div className="input__group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => {
                  usernameRef.current = e.target.value.trim();
                  setUsername(e.target.value.trim());
                  checkUsername();
                }}
                className={usernameAvailable ? null : "error-border"}
                required
                aria-required="true"
                aria-label="Username"
                aria-describedby="username-error"
              />
              {!usernameAvailable && (
                <p className="error" id="username-error">
                  Username not availaible
                </p>
              )}
            </div>

            <div className="input__group">
              <label htmlFor="full__name">Full name</label>
              <input
                id="full__name"
                type="text"
                placeholder="Enter your Fullname"
                value={fullName}
                name="name"
                onChange={(e) => {
                  setFullName(e.target.value);
                  handleError(e.target.name, e.target.value);
                }}
                className={error.nameError ? "error-border" : null}
                required
                aria-required="true"
                aria-label="Full Name"
                aria-describedby="name-error"
              />
              {error.name && error.nameError && (
                <p className="error" id="name-error">
                  {error.nameError}
                </p>
              )}
            </div>

            <div className="input__group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleError(e.target.name, e.target.value);
                }}
                className={error.emailError ? "error-border" : null}
                required
                aria-required="true"
                aria-label="Email"
                aria-describedby="email-error"
              />
              {error.email && error.emailError && (
                <p className="error" id="email-error">
                  {error.emailError}
                </p>
              )}
            </div>

            <div className="input__group">
              <label htmlFor="password">Password</label>
              <div
                id="password-container"
                className={
                  error.passwordError
                    ? "error-border pass__input__container"
                    : "pass__input__container"
                }
              >
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleError(e.target.name, e.target.value);
                  }}
                  required
                  aria-required="true"
                  aria-label="Password"
                  aria-describedby="password-error"
                />
                <button
                  onClick={(e) => handleShowPassword(e)}
                  className="show-password"
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
                </button>
              </div>
              {error.password && error.passwordError && (
                <p className="error" id="password-error">
                  {error.passwordError}
                </p>
              )}
            </div>
            {/* confirm password */}

            <div className="input__group">
              <label htmlFor="confirmpassword">Confirm Password</label>
              <div
                id="password-container"
                className={
                  error.confirmPasswordError
                    ? "error-border pass__input__container"
                    : "pass__input__container"
                }
              >
                <input
                  id="confirmpassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    handleError(e.target.name, e.target.value);
                  }}
                  required
                  aria-required="true"
                  aria-label="Confirm Password"
                  aria-describedby="confirm-password-error"
                />
                <button
                  onClick={(e) => handleShowConfirmPassword(e)}
                  className="show-password"
                  aria-label={
                    showConfirmPassword
                      ? "Hide Confirm Password"
                      : "Show Confirm Password"
                  }
                >
                  {showConfirmPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
                </button>
              </div>
              {error.confirmPassword && error.confirmPasswordError && (
                <p className="error" id="confirm-password-error">
                  {error.confirmPasswordError}
                </p>
              )}
            </div>
            <button
              type="submit"
              onClick={signUp}
              className="action__btn login__btn"
            >
              Sign Up <FontAwesomeIcon icon={faRightToBracket} />
            </button>

            <div className="other__login__method">
              <div className="or option__divider">
                <div className="line" />
                <div style={{ padding: "5px 9px" }}>or</div>
                <div className="line" />
              </div>
              <div className="google__fb--login">
                <button
                  className="other__login google"
                  type="submit"
                  onClick={signInWithGoogle}
                  aria-label="Sign Up with Google"
                >
                  <FontAwesomeIcon icon={faGoogle} className="google-icon" />{" "}
                  Sign up with Google
                </button>
                <button
                  className="other__login facebook"
                  type="submit"
                  onClick={signInWithFacebook}
                  aria-label="Sign Up with Facebook"
                >
                  <FontAwesomeIcon
                    icon={faFacebookF}
                    className="facebook-icon"
                  />{" "}
                  Sign up with Facebook
                </button>
              </div>
              <div className="have-account">
                Already have an account?{" "}
                <span role={"button"} onClick={navigateToLogin} tabIndex="0">
                  Sign in!
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="login__right signup__right">
        <img src={loginRight} alt="website image" />
      </div>
    </section>
  );
};

export default SignupScreen;
