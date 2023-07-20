import "./index.css";

import { playErrorSound, playSuccessSound } from "../../../js/sounds";

import { auth } from "../../../lib/firebase";
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
        navigate("/dummygram/");
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
      Sign In as Guest
    </button>
  );
};

export default GuestSignInBtn;
