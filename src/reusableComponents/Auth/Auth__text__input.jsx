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
  fieldName,
  maxLength,
  type = "text",
}) => {
  return (
    <div className="input__group">
      <input
        name={fieldName}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e)}
        className={error_border ? null : "error-border"}
        required
        maxLength={maxLength}
        aria-required="true"
        aria-label={label}
        aria-describedby={aria_dsc_by}
      />
      {isError && (
        <p className="error" id={`${fieldName}-error`}>
          {errorMesssage}
        </p>
      )}
<label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Auth__text__input;
