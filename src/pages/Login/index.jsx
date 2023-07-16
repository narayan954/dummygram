import "./index.css";
import "../Signup/index.css";

import React, { useState } from "react";
import { auth, db, facebookProvider, googleProvider } from "../../lib/firebase";
import { playErrorSound, playSuccessSound } from "../../js/sounds";
import {
  Auth__ctn__group, 
  Auth__pass__input, 
  Auth__text__input, 
  Auth_container, Auth__top
} from "../../reusableComponents/Auth"
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import loginRight from "../../assets/login-right.webp";
import { Logo, validate } from "../../reusableComponents"
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

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

  const signInWithGoogle = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(googleProvider)
      .then(async (val) => {
        const userRef = db
          .collection("users")
          .where("uid", "==", val?.user?.uid);
        // alert(((await userRef.get()).docs.length))

        if ((await userRef.get()).docs.length < 1) {
          const usernameDoc = db.collection(`users`);
          await usernameDoc.doc(auth.currentUser.uid).set({
            uid: val.user.uid,
            username: val.user.uid,
            name: val.user.displayName,
            photoURL: val.user.photoURL,
            displayName: val.user.displayName,
            Friends: [],
            posts: [],
          });
        } else {
          const usernameDoc = db.collection(`users`);
          usernameDoc
            .doc(auth.currentUser.uid)
            .get()
            .then((doc) => {
              if (!doc.data().username) {
                doc.ref.update({
                  username: doc.data().uid,
                });
              }
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
        if ((await userRef.get()).docs.length < 1) {
          const usernameDoc = db.collection(`users`);
          await usernameDoc.doc(auth.currentUser.uid).set({
            uid: val.user.uid,
            username: val.user.uid,
            name: val.user.displayName,
            photoURL: val.user.photoURL,
            displayName: val.user.displayName,
            Friends: [],
            posts: [],
          });
        } else {
          const usernameDoc = db.collection(`users`);
          usernameDoc
            .doc(auth.currentUser.uid)
            .get()
            .then((doc) => {
              if (!doc.data().username) {
                doc.ref.update({
                  username: doc.data().uid,
                });
              }
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
    <Auth_container right__img={loginRight}>
      <form aria-label="Sign Up Form">
        <Logo ml={1} />
        <Auth__top
          heading={"Hey, hello 👋"}
          top__greeting={"Enter your information to get started"}
        />
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
            handleSignInWithGoogle={signInWithGoogle}
            handleSignInWithFacebook={signInWithFacebook}
            have_acct_question={"Don't have an account? "}
            have_acct_nav={navigateToSignup}
            have__acct_action={"Sign up"}
            forgot_pass_nav={navigateToForgot}
          />
        </div>
      </form>
    </Auth_container>
  );
};

export default LoginScreen;
