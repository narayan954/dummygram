import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";

const Auth__ctn__group = ({
  handleSubmit,
  btn__label,
  submit__icon,
  handleSignInWithGoogle,
  handleSignInWithFacebook,
  have_acct_question,
  have__acct_action,
  have_acct_nav,
  forgot_pass_nav,
}) => {
  return (
    <>
      <button
        type="submit"
        onClick={handleSubmit}
        className="action__btn login__btn"
      >
        {btn__label} <FontAwesomeIcon icon={submit__icon} />
      </button>

      <div className="other__login__method">
        <div className="or option__divider">
          <div className="line" />
          <div style={{ padding: "5px 9px" }}>or</div>
          <div className="line" />
        </div>
        <div className="google__fb--login">
          <button
            className="other__login google"
            type="submit"
            onClick={handleSignInWithGoogle}
            aria-label="Sign Up with Google"
          >
            <FontAwesomeIcon icon={faGoogle} className="google-icon" /> Sign up
            with Google
          </button>
          <button
            className="other__login facebook"
            type="submit"
            onClick={handleSignInWithFacebook}
            aria-label="Sign Up with Facebook"
          >
            <FontAwesomeIcon icon={faFacebookF} className="facebook-icon" />{" "}
            Sign up with Facebook
          </button>
        </div>
        {forgot_pass_nav ? (
          <div className="forgot__new">
            <div className="forgot-pasword">
              <span role={"button"} onClick={forgot_pass_nav}>
                Forgot Password ?
              </span>
            </div>
            <div className="have-account">
              {have_acct_question}{" "}
              <span role={"button"} onClick={have_acct_nav} tabIndex="0">
                {have__acct_action}
              </span>
            </div>
          </div>
        ) : (
          <div className="have-account">
            {have_acct_question}{" "}
            <span role={"button"} onClick={have_acct_nav} tabIndex="0">
              {have__acct_action}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Auth__ctn__group;
