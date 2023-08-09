import "./index.css";

import Logo from "../Logo";

const Auth_container = ({ children }) => {
  return (
    <div className="page-over">
      <section className="login__section">
        <div className="login__right__container">
          <div className="login__right__sub__container">
            <Logo />
            <p id="welcome__msg">
              Welcome to Dummygram, place to share your wonderful moments and
              connect with others
            </p>
          </div>
        </div>
        <div className="login__left">{children}</div>
      </section>
    </div>
  );
};

export default Auth_container;
