import "./index.css";

import React, { useEffect } from "react";

import { AiOutlineInsertRowAbove } from "react-icons/ai";
import { auth } from "../../lib/firebase";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../reusableComponents"

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

        {
          user && (
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
          )
        }
      </div >
    )
  );
}

export default Navbar;
