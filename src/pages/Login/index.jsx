import "./index.css";
import "../Signup/index.css";

import {
  Auth__ctn__group,
  Auth__pass__input,
  Auth__text__input,
  Auth_container,
} from "../../reusableComponents/Auth";
import React, { useState } from "react";
import { auth } from "../../lib/firebase";
import { playErrorSound, playSuccessSound } from "../../js/sounds";
import signInWithOAuth from "../../js/signIn";

import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { validate } from "../../reusableComponents";

const LoginScreen = () => {
  const [userDatails, setuserDatails] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({ email: true });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    if (!error.email && userDatails.password !== "") {
      auth
        .signInWithEmailAndPassword(userDatails.email, userDatails.password)
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
    <Auth_container>
      <form aria-label="Sign Up Form">
        <div className="form__bottom">
          {/* Email Input for the form */}
          <Auth__text__input
            label={"Email"}
            id={"email"}
            type="email"
            placeholder={"Enter your email"}
            value={userDatails.email}
            handleChange={(e) => {
              setuserDatails({ ...userDatails, email: e.target.value });
              handleError(e.target.name, e.target.value);
            }}
            maxLength={64}
            fieldName={"email"}
            aria_dsc_by={"email-error"}
            isError={error.email && error.emailError}
            errorMesssage={error.emailError}
            error_border={!error.emailError}
          />
          {/* password input for the form  */}
          <Auth__pass__input
            label={"Password"}
            id={"password"}
            name={"password"}
            maxLength={30}
            placeholder={"Enter your password"}
            value={userDatails.password}
            handleChange={(e) =>
              setuserDatails({ ...userDatails, password: e.target.value })
            }
            aria_dsc_by={"password-error"}
            errorMesssage={error.passwordError}
            isError={error.password && error.passwordError}
          />

          <Auth__ctn__group
            handleSubmit={signIn}
            btn__label={"LogIn"}
            submit__icon={faRightToBracket}
            handleSignInWithGoogle={(e) => signInWithOAuth(e, enqueueSnackbar, navigate)}
            handleSignInWithFacebook={(e) => signInWithOAuth(e, enqueueSnackbar, navigate, false)}
            have_acct_question={"Don't have an account? "}
            have_acct_nav={navigateToSignup}
            have__acct_action={"Sign up"}
            forgot_pass_nav={navigateToForgot}
            showGuestSignIn={false}
          />
        </div>
      </form>
    </Auth_container>
  );
};

export default LoginScreen;
