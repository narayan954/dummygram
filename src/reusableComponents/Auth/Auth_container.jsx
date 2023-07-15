import React from "react";

const Auth_container = ({ right__img, children }) => {
  return (
    <div className="page-over">
      <section className="login__section">
        <div className="login__right signup__right">
          {right__img && (
            <img
              src={right__img}
              alt="website image"
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <div className="login__left">{children}</div>
      </section>
    </div>
  );
};

export default Auth_container;
