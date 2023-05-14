import React, { useState } from "react";
import { getModalStyle, useStyles } from "../App";
import { updateProfile } from "firebase/auth";
import {
  auth,
  storage,
  googleProvider,
  facebookProvider,
} from "../lib/firebase";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";

const SignupScreen = () => {
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
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
    if (username === "") {
      enqueueSnackbar("Username cannot be blank", {
        variant: "error",
      });
      return;
    }
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (authUser) => {
        await updateProfile(auth.currentUser, {
          displayName: username,
        })
          .then(() => {
            enqueueSnackbar(
              `Congratulations ${username},you have joined Dummygram`,
              {
                variant: "success",
              }
            );
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
                  displayName: username,
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
            onChange={(e) => setUsername(e.target.value)}
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
