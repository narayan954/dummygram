import React, { useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";

const Auth__pass__input = ({
  label,
  id,
  name,
  placeholder,
  value,
  handleChange,
  aria_dsc_by,
  errorMesssage,
  isError,
  maxLength,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="input__group">
      <label htmlFor={id}>{label}</label>
      <div
        id="password-container"
        className={
          errorMesssage
            ? "error-border pass__input__container"
            : "pass__input__container"
        }
      >
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e)}
          required
          maxLength={maxLength}
          aria-required="true"
          aria-label={label}
          aria-describedby={aria_dsc_by}
        />
        <button
          onClick={(e) => handleShowPassword(e)}
          className="show-password show__hide--pass"
          aria-label={showPassword ? "Hide Password" : "Show Password"}
        >
          {showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
        </button>
      </div>
      {isError && (
        <p className="error" id="password-error">
          {errorMesssage}
        </p>
      )}
    </div>
  );
};

export default Auth__pass__input;
