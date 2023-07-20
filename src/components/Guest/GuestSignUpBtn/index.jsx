import "./index.css";

import { useNavigate } from "react-router-dom";

const GuestSignUpBtn = () => {
  const navigate = useNavigate();
  return (
    <div className="guest-sign-up-button-container">
      <button
        className="guest-sign-up-button"
        onClick={() => navigate("/dummygram/signup")}
      >
        Sign Up
      </button>
    </div>
  );
};

export default GuestSignUpBtn;
