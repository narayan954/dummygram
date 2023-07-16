import "./index.css";

import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import { AiOutlineInsertRowAbove } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { auth } from "../../lib/firebase";
// import logo from "../../assets/logo.webp";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

function Navbar({ onClick, open, setOpen, user, setUser, setLogout }) {
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
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Button
                  onClick={() => setOpen((cur) => !cur)}
                  color="secondary"
                  variant="contained"
                  className="button-style"
                >
                  <FaUserCircle fontSize="large" />
                  {open && (
                    <Box className="nav-menu">
                      <Box
                        className="nav-menu-item"
                        onClick={() => navigate("/dummygram/settings")}
                      >
                        <Typography fontSize="0.9rem">Settings</Typography>
                      </Box>
                      <Divider />
                      <Box
                        className="nav-menu-item"
                        onClick={() => setLogout(true)}
                      >
                        <Typography fontSize="0.9rem">Log Out</Typography>
                      </Box>
                    </Box>
                  )}
                </Button>
              </ClickAwayListener>
            </div>
          </>
        )}
      </div>
    )
  );
}

export default Navbar;
