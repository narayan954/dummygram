import React, { useState } from "react";
import { getModalStyle, useStyles } from "../App";

import Logo from "../assets/logo.png";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { playSuccessSound, playErrorSound } from "../js/sounds";
import { useSnackbar } from "notistack";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const classes = useStyles();

  const signIn = (e) => {
    e.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        playSuccessSound()
        enqueueSnackbar("Check your mail and change the pasword.", {
          variant: "success",
        });
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          playErrorSound()
          enqueueSnackbar("Invalid email address", {
            variant: "error",
          });
        } else if (error.code === "auth/user-not-found") {
          playErrorSound()
          enqueueSnackbar("User not found", {
            variant: "error",
          });
        } else if (error.code === "auth/wrong-password") {
          playErrorSound()
          enqueueSnackbar("Wrong password", {
            variant: "error",
          });
        } else if (
          error.code === "auth/account-exists-with-different-credential"
        ) {
          playErrorSound()
          enqueueSnackbar("Account exists with a different credential", {
            variant: "error",
          });
        } else {
          playErrorSound()
          enqueueSnackbar("Error Occured!", {
            variant: "error",
          });
        }
      });
  };

  const navigateToSignin = () => {
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
            }}
          ></div>
          <button type="submit" onClick={signIn} className="button log">
            RESET PASSWORD
          </button>

          <div className="have-account">
            Already have a account?{" "}
            <span role={"button"} onClick={navigateToSignin}>
              Sign in
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
