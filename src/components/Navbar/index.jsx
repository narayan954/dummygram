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
import logo from "../../assets/logo.webp";
import { useNavigate } from "react-router-dom";

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
    <div className="app__header">
      <p
        id="dummygram-logo"
        onClick={() => {
          if (
            location.pathname !== "/dummygram/login" &&
            location.pathname !== "/dummygram/signup"
          ) {
            navigate("/dummygram/");
          }
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
      >
        dummygram
      </p>

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
                      onClick={() =>
                        navigate("/dummygram/profile", {
                          state: {
                            name: user.toJSON().displayName,
                            email: user.toJSON().email,
                            avatar: user.toJSON().photoURL,
                            uid: user.toJSON().uid
                          },
                        })
                      }
                    >
                      <Typography fontSize="1rem">Profile</Typography>
                    </Box>
                    <Divider />
                    <Box
                      className="nav-menu-item"
                      onClick={() => navigate("/dummygram/favourites")}
                    >
                      <Typography fontSize="1rem">Favourites</Typography>
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
  );
}

export default Navbar;
