import "./index.css";

import React, { useEffect } from "react";

import { AiOutlineInsertRowAbove } from "react-icons/ai";
import { auth } from "../../lib/firebase";
import { blue } from "@mui/material/colors";
// import logo from "../../assets/logo.webp";
import { useNavigate } from "react-router-dom";

function Navbar({ onClick, user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        navigate("/dummygram/login");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    location.pathname !== "/dummygram/login" &&
    location.pathname !== "/dummygram/signup" && (
      <div className="app__header">
        <div className="logo">
          <img
            src="https://dummy-gram.web.app/assets/logo-4fa32b9d.png"
            id="dummygram-logo"
            onClick={() => {
              navigate("/dummygram/");
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }}
          />
        </div>
        {user && (
          <>
            <div className="container">
              <div className="rowConvert" onClick={onClick}>
                <AiOutlineInsertRowAbove style={{ margin: "auto" }} size={30} />
              </div>
            </div>
          </>
        )}
      </div>
    )
  );
}

export default Navbar;
