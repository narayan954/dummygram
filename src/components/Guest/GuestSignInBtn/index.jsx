import "./index.css";

import { playErrorSound, playSuccessSound } from "../../../js/sounds";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth } from "../../../lib/firebase";
import { faRedditAlien } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const GuestSignInBtn = ({ show }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  function guestSignIn() {
    auth
      .signInAnonymously()
      .then(() => {
        playSuccessSound();
        enqueueSnackbar("Guest Sign In successfull", {
          variant: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        playErrorSound();
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      });
  }

  return (
    <button
      onClick={guestSignIn}
      className="guest-sign-in-button other__login"
      style={{ display: show ? "inline-block" : "none" }}
    >
      <FontAwesomeIcon icon={faRedditAlien} /> Sign up as a Guest!
    </button>
  );
};

export default GuestSignInBtn;
