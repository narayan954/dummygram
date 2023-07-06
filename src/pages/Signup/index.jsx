import "./index.css";

import React, { useRef, useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import {
  auth,
  db,
  facebookProvider,
  googleProvider,
  storage,
} from "../../lib/firebase";
import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { getModalStyle, useStyles } from "../../App";
import { playErrorSound, playSuccessSound } from "../../js/sounds";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
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
                });
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
    <div className="flex signup-container">
      <div style={modalStyle} className={classes.paper}>
        <form className="modal__signup">
          <input
            type="file"
            id="file"
            className="file"
            onChange={handleChange}
            accept="image/*"
          />
          <label htmlFor="file">
            <div className="img-outer">
              {address ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="profile pic"
                  className="img-inner"
                />
              ) : (
                <div className="img-inner">Profile Picture</div>
              )}
            </div>
          </label>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              usernameRef.current = e.target.value.trim();
              setUsername(e.target.value.trim());
              // checkUsername();
            }}
            className={
              usernameAvailable ? "username-available" : "error-border"
            }
          />
          {!usernameAvailable && (
            <p className="error">Username not availaible</p>
          )}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            name="name"
            onChange={(e) => {
              setFullName(e.target.value);
              handleError(e.target.name, e.target.value);
            }}
            className={error.nameError ? "error-border" : null}
          />
          {error.name && error.nameError && (
            <p className="error">{error.nameError}</p>
          )}
          <input
            type="email"
            placeholder=" Email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleError(e.target.name, e.target.value);
            }}
            className={error.emailError ? "error-border" : null}
          />
          {error.email && error.emailError && (
            <p className="error">{error.emailError}</p>
          )}
          <div
            className={
              error.passwordError
                ? "error-border password-container"
                : "password-container"
            }
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" Password"
              value={password}
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
                handleError(e.target.name, e.target.value);
              }}
              className="password-input "
            />
            <button
              onClick={(e) => handleShowPassword(e)}
              className="show-password"
            >
              {showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
            </button>
          </div>
          {error.password && error.passwordError && (
            <p className="error">{error.passwordError}</p>
          )}

          {/* Confirm password */}
          <div
            className={
              error.confirmPasswordError
                ? "error-border password-container"
                : "password-container"
            }
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              name="confirmPassword"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                handleError(e.target.name, e.target.value);
              }}
              className="password-input"
            />
            <button
              onClick={(e) => handleShowConfirmPassword(e)}
              className="show-password"
            >
              {showConfirmPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
            </button>
          </div>
          {error.confirmPassword && error.confirmPasswordError && (
            <p className="error">{error.confirmPasswordError}</p>
          )}
          <button type="submit" onClick={signUp} className="button signup">
            Sign Up <FontAwesomeIcon icon={faRightToBracket} />
          </button>
          <div className="or">
            <div className="line" />
            <div style={{ padding: "9px" }}>or</div>
            <div className="line" />
          </div>
          <div className="google-fb-login">
            <button className="button" onClick={signInWithGoogle}>
              <FontAwesomeIcon icon={faGoogle} />
            </button>
            <button className="button" onClick={signInWithFacebook}>
              <FontAwesomeIcon icon={faSquareFacebook} />
            </button>
          </div>
          <div className="have-account">
            Already have an account?{" "}
            <span role={"button"} onClick={navigateToLogin}>
              Sign in
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupScreen;
