import { IoCheckmarkCircle } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import React from "react";

const Auth__text__input = ({
  label,
  id,
  placeholder,
  value,
  handleChange,
  error_border,
  isError,
  aria_dsc_by,
  errorMesssage,
  successMessage,
  fieldName,
  maxLength,
  type = "text",
}) => {
  return (
    <div className="input__group">
      <label htmlFor={id}>{label}</label>
      <input
        name={fieldName}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e)}
        className={
          error_border ? (!value ? null : "success-border") : "error-border"
        }
        required
        maxLength={maxLength}
        aria-required="true"
        aria-label={label}
        aria-describedby={aria_dsc_by}
      />
      {isError && (
        <p className="error" id={`${fieldName}-error`}>
          <IoIosWarning /> {errorMesssage}
        </p>
      )}
      {!isError && value && (
        <p className="success" id={`${fieldName}-success`}>
          <IoCheckmarkCircle /> {successMessage}
        </p>
      )}
    </div>
  );
};

export default Auth__text__input;
