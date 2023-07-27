import React from "react";

const Auth__image__input = ({
  address,
  image,
  blank_profile,
  handleChange
}) => {
  return (
    <div className="input__group">
      <label htmlFor="file" id="file-label">
        <div className="img-outer">
          {address ? (
            <img
              src={URL.createObjectURL(image)}
              alt="profile pic"
              className="img-inner"
            />
          ) : (
            <img src={blank_profile} alt="profile pic" className="img-inner" />
          )}
        </div>
      </label>
      <input
        type="file"
        id="file"
        className="file"
        onChange={handleChange}
        accept="image/*"
        required
        aria-labelledby="file-label"
      />
    </div>
  );
};

export default Auth__image__input;
