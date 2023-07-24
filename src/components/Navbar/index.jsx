import "./index.css";

import React, { useEffect } from "react";

import { AiOutlineInsertRowAbove } from "react-icons/ai";
import ChatIcon from "@mui/icons-material/Chat";
import { Darkmode } from "../../reusableComponents";
import { Logo } from "../../reusableComponents";
import { auth } from "../../lib/firebase";
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
        <Logo />
        <div className="navSpace">
          <div className="container">
            <div className="rowConvert" onClick={onClick}>
              <AiOutlineInsertRowAbove style={{ margin: "auto" }} size={30} />
            </div>
            <div
              className="rowConvert"
              id="chat-icon"
              onClick={() => navigate("/dummygram/chat")}
            >
              <ChatIcon className="chatIcon" />
            </div>
          </div>
          <Darkmode themeClass="themeButton" />
        </div>
      </div>
    )
  );
}

export default Navbar;
