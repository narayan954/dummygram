import "./index.css";

import React, { useEffect, useState } from "react";

import { AiOutlineInsertRowAbove } from "react-icons/ai";
import { Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { Darkmode } from "../../reusableComponents";
import { FaSearch } from "react-icons/fa";
import { Logo } from "../../reusableComponents";
import Modal from "@mui/material/Modal";
import SearchIcon from "@mui/icons-material/Search";
import { auth } from "../../lib/firebase";
import blankImg from "../../assets/blank-profile.webp";
import { db } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";

const PAGESIZE = 7;

function Navbar({ onClick, user, setUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handlequery = () => {
    setSearchQuery("");
  };
  const handleSearchModal = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  useEffect(() => {
    // Call fetchUsers function whenever debouncedQuery changes after the 2-second delay
    fetchUsers();
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchUsers = async () => {
    const value = searchQuery;
    if (value.length > 0) {
      const usersCollection = await db
        .collection("users")
        .orderBy("name", "asc")
        .startAt(value.toUpperCase())
        .endAt(value.toLowerCase())
        .limit(PAGESIZE)
        .get();

      const fetchedUsers = usersCollection.docs.map((doc) => ({
        id: doc.id,
        user: doc.data(),
      }));
      setSearchResults(fetchedUsers);
    } else {
      setSearchResults([]);
    }
  };

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
          <div className="searchbar" onClick={handleSearchModal}>
            <SearchIcon sx={{ fontSize: 30 }} className="icon" />
          </div>
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
          <Modal
            open={open}
            onClose={handleSearchModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                height: "80vh",
                boxShadow: 24,
                // backdropFilter: "blur(7px)",
                border: "1px solid #fff",
                zIndex: "1000",
                textAlign: "center",
                borderRadius: "5%",
                position: "relative",
              }}
              className="search-modal"
            >
              <div className="search-closeicon" onClick={handleSearchModal}>
                <CloseIcon sx={{ fontSize: 40 }} />
              </div>
                  <div className="search-bar">
                    <input
                      type="search"
                      className="search-input"
                      value={searchQuery}
                      placeholder="Search users..."
                      onChange={handleSearch}
                    />
                    <label className="search-icon">
                      <FaSearch />
                    </label>
                    {!searchQuery ? (
                      ""
                    ) : (
                      <span
                        style={{
                          position: "absolute",
                          right: "57px",
                          display: "flex",
                          color: "rgba(0, 0, 0, 0.8)",
                          cursor: "pointer",
                        }}
                        onClick={handlequery}
                      >
                        <CloseIcon sx={{ fontSize: "30" }} />
                      </span>
                    )}
                  </div>
              <div
                style={{
                  // position: "absolute",
                  marginTop: "10px",
                  width: "100%",
                  height: "calc(100% - 60px)",
                }}
              >
                {searchResults.length > 0 ? (
                  <section className="searched-user-container">
                    <ul className="searched-user-sub-container">
                      {searchResults.map(({ id, user }) => {
                        return (
                          <li
                            key={id}
                            className="searched-user-li"
                            onClick={() =>
                              navigate(`/dummygram/user/${user.username}`)
                            }
                          >
                            <img
                              src={user?.photoURL ? user.photoURL : blankImg}
                              alt={user.name}
                              className="searched-user-avatar"
                            />
                            <span
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <h5 className="searched-user-name">
                                {user.name}
                              </h5>
                              <p className="searched-user-username">
                                @{user.username}
                              </p>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ) : (
                  <Box>
                    <div
                      style={{ marginTop: "5px", marginBottom: "1.5rem" }}
                      align="center"
                    >
                      <div className="text-white">Nothing to search</div>
                    </div>
                  </Box>
                )}
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    )
  );
}

export default Navbar;
