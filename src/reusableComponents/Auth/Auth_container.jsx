import React from "react";

const Auth_container = ({ right__img, children }) => {
  return (
    <section className="login__section">
      <div className="login__left">{children}</div>
      <div className="login__right signup__right">
        {right__img && <img src={right__img} alt="website image" />}
      </div>
    </section>
  );
};

export default Auth_container;
