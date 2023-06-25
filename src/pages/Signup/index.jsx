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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

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
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [username, setUsername] = useState("");
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
    if (!usernameAvailable) {
      enqueueSnackbar("Username not available!", {
        variant: "error",
      });
      return;
    }
    if (fullName === "") {
      enqueueSnackbar("Name cannot be blank", {
        variant: "error",
      });
      return;
    }
    if (password != confirmPassword) {
      enqueueSnackbar("Password dosen't match", {
        variant: "error",
      });
      return;
    }

    const usernameDoc = db.doc(`usernames/${username}`);
    const batch = db.batch();
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (authUser) => {
        await updateProfile(auth.currentUser, {
          displayName: fullName,
        })
          .then(batch.set(usernameDoc, { uid: auth.currentUser.uid }))
          .then(batch.commit())
          .then(() => {
            enqueueSnackbar(
              `Congratulations ${fullName},you have joined Dummygram`,
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
        const uploadTask = storage.ref(`images/${image?.name}`).put(image);
        uploadTask.on(
          "state_changed",
          () => {
            // // progress function ...
            // setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
          },
          (error) => {
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
                enqueueSnackbar("Signup Successful!", {
                  variant: "success",
                });
              });
          }
        );
      })
      .catch((error) =>
        enqueueSnackbar(error.message, {
          variant: "error",
        })
      )
      .finally(() => {
        setSigningUp(false);
      });
  };

  const signInWithGoogle = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(googleProvider)
      .then(() => {
        enqueueSnackbar("Signin successful!", {
          variant: "success",
        });
        navigate("/dummygram");
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
      .then(() => {
        enqueueSnackbar("Signin successful!", {
          variant: "success",
        });
        navigate("/dummygram");
      })
      .catch((error) =>
        enqueueSnackbar(error.message, {
          variant: "error",
        })
      );
  };

  const navigateToLogin = () => {
    navigate("/dummygram/login");
  };

  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
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
              checkUsername();
            }}
            className={
              usernameAvailable
                ? "username-available"
                : "username-not-available"
            }
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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

          {/* Confirm password */}
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
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                margin: 0,
                boxShadow: "none",
              }}
            />
            <button
              onClick={(e) => handleShowConfirmPassword(e)}
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
              {showConfirmPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
            </button>
          </div>

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
