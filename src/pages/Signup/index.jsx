import "../Login/index";
import "./index.css";

import {
  Auth__ctn__group,
  Auth__image__input,
  Auth__pass__input,
  Auth__text__input,
  Auth_container,
} from "../../reusableComponents/Auth";
import React, { useRef, useState } from "react";
import { auth, db, storage } from "../../lib/firebase";
import { playErrorSound, playSuccessSound } from "../../js/sounds";

import blank_profile from "../../assets/blank-profile.webp";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import signInWithOAuth from "../../js/signIn";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { validate } from "../../reusableComponents";

const SignupScreen = () => {
  const usernameRef = useRef("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(validate.initialValue);

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
    const regex = /^[a-z][a-z0-9_]{4,20}$/;
    if (!regex.test(name)) {
      setUsernameAvailable(false);
    } else {
      const debouncedFunction = debounce(findUsernameInDB);
      debouncedFunction();
    }
  };

  const findUsernameInDB = async () => {
    const newName = usernameRef.current; // Assuming `usernameRef.current` contains the document ID
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("username", "==", newName).get();
    if (querySnapshot.empty) {
      setUsernameAvailable(true);
    } else {
      setUsernameAvailable(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setAddress(e.target.value);
    }
  };

  const signUp = async (e) => {
    e.preventDefault();
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
      const userCollectionRef = db.collection("users");
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
            .then(
              await userCollectionRef.doc(auth.currentUser.uid).set({
                uid: auth.currentUser.uid,
                username: username,
                name: fullName,
                email: email,
                photoURL: auth.currentUser.photoURL,
                posts: [],
                friends: [auth.currentUser.uid],
              }),
            )
            .then(() => {
              playSuccessSound();
              enqueueSnackbar(
                `Congratulations ${fullName},you have joined Dummygram`,
                {
                  variant: "success",
                },
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
            () => {},
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
            },
          );
        })
        .catch((error) => {
          playErrorSound();
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        });
    } else {
      enqueueSnackbar("Please fill all fields with valid data", {
        variant: "error",
      });
    }
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
    <Auth_container>
      <form aria-label="Sign Up Form">
        <div className="form__bottom">
          {/* image input for the form  */}
          <Auth__image__input
            address={address}
            blank_profile={blank_profile}
            image={image}
            handleChange={handleChange}
          />
          {/* Username Input for the form */}
          <Auth__text__input
            label={"Username"}
            id={"username"}
            placeholder={"Enter your Username"}
            value={username}
            handleChange={(e) => {
              usernameRef.current = e.target.value.trim();
              setUsername(e.target.value.trim());
              checkUsername();
            }}
            maxLength={18}
            fieldName={"username"}
            aria_dsc_by={"username-error"}
            isError={!usernameAvailable}
            errorMesssage={"Username not availaible"}
            error_border={usernameAvailable}
          />

          {/* fullname input for the form */}
          <Auth__text__input
            label={"Full name"}
            id={"full__name"}
            placeholder={"Enter your Fullname"}
            value={fullName}
            handleChange={(e) => {
              setFullName(e.target.value);
              handleError(e.target.name, e.target.value);
            }}
            maxLength={40}
            fieldName={"name"}
            aria_dsc_by={"name-error"}
            isError={error.name && error.nameError}
            errorMesssage={error.nameError}
            error_border={!error.nameError}
          />

          {/* Email input for the form */}
          <Auth__text__input
            label={"Email"}
            id={"email"}
            type="email"
            placeholder={"Enter your email"}
            value={email}
            handleChange={(e) => {
              setEmail(e.target.value);
              handleError(e.target.name, e.target.value);
            }}
            maxLength={64} // limiting to 64 characters emails
            fieldName={"email"}
            aria_dsc_by={"email-error"}
            isError={error.email && error.emailError}
            errorMesssage={error.emailError}
            error_border={!error.emailError}
          />
          <div className="pass-container-both">
            {/* password input for the form  */}
            <Auth__pass__input
              label={"Password"}
              id={"password"}
              name={"password"}
              placeholder={"Enter your password"}
              value={password}
              handleChange={(e) => {
                setPassword(e.target.value);
                handleError(e.target.name, e.target.value);
              }}
              maxLength={30}
              aria_dsc_by={"password-error"}
              errorMesssage={error.passwordError}
              isError={error.password && error.passwordError}
            />

            {/* confirm password input for the form  */}
            <Auth__pass__input
              label={"Confirm Password"}
              id={"confirmpassword"}
              name={"confirmPassword"}
              placeholder={"Confirm your Password"}
              value={confirmPassword}
              handleChange={(e) => {
                setConfirmPassword(e.target.value);
                handleError(e.target.name, e.target.value);
              }}
              maxLength={30}
              aria_dsc_by={"confirm-password-error"}
              errorMesssage={error.confirmPasswordError}
              isError={error.confirmPassword && error.confirmPasswordError}
            />
          </div>
          <Auth__ctn__group
            handleSubmit={signUp}
            btn__label={"Sign up"}
            submit__icon={faRightToBracket}
            handleSignInWithGoogle={(e) =>
              signInWithOAuth(e, enqueueSnackbar, navigate)
            }
            handleSignInWithFacebook={(e) =>
              signInWithOAuth(e, enqueueSnackbar, navigate, false)
            }
            have_acct_question={"Already have an account?"}
            have_acct_nav={navigateToLogin}
            have__acct_action={"Sign in!"}
          />
        </div>
      </form>
    </Auth_container>
  );
};

export default SignupScreen;
