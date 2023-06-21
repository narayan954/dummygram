import "./index.css";

import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";

import { AiOutlineInsertRowAbove } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { RowModeContext } from "../../hooks/useRowMode";
import { auth } from "../../lib/firebase";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Navbar({ onClick, open, setOpen, user, setUser, setLogout }) {
  const navigate = useNavigate();
  const rowMode = useContext(RowModeContext);

  const buttonStyle = {
    background: "linear-gradient(40deg, #e107c1, #59afc7)",
    borderRadius: "20px",
    margin: "10px",
    ":hover": {
      background: "linear-gradient(-40deg, #59afc7, #e107c1)",
    },
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        navigate("/dummygram/");
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
      <img
        src={logo}
        alt="dummygram"
        className="app__header__img"
        onClick={() => {
          if (
            location.pathname !== "/dummygram/login" &&
            location.pathname !== "/dummygram/signup"
          ) {
            navigate("/dummygram/");
          }
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
        style={{
          cursor: "pointer",
        }}
      />

      {user && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <div className="rowConvert" onClick={onClick}>
              <AiOutlineInsertRowAbove style={{ margin: "auto" }} size={30} />
            </div>
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <Button
                onClick={() => setOpen((cur) => !cur)}
                color="secondary"
                variant="contained"
                sx={{ ...buttonStyle, marginRight: "10px" }}
              >
                <FaUserCircle fontSize="large" />
                {open && (
                  <Box
                    backgroundColor="#fff"
                    color="black"
                    padding="2px"
                    width="80px"
                    position="absolute"
                    borderRadius="4px"
                    marginTop={16}
                    marginRight={3}
                    sx={{
                      width: "fit-content",
                      mt: "10rem",
                      mr: "4rem",
                      vertical: "top",
                      border: "1px solid black",
                    }}
                  >
                    <Box
                      display="flex"
                      padding="0.5rem"
                      sx={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate("/dummygram/profile", {
                          state: {
                            name: user.toJSON().displayName,
                            email: user.toJSON().email,
                            avatar: user.toJSON().photoURL,
                          },
                        })
                      }
                    >
                      <Typography fontFamily="Poppins" fontSize="1rem">
                        Profile
                      </Typography>
                    </Box>
                    <Divider />
                    <Box
                      display="flex"
                      padding="0.5rem"
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate("/dummygram/favourites")}
                    >
                      <Typography fontFamily="serif" fontSize="1rem">
                        Favourites
                      </Typography>
                    </Box>
                    <Divider />
                    <Box
                      display="flex"
                      padding="0.5rem"
                      sx={{ cursor: "pointer" }}
                      onClick={() => setLogout(true)}
                    >
                      <Typography fontFamily="Poppins" fontSize="0.9rem">
                        Log Out
                      </Typography>
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
