import "./index.css";

import { Darkmode, Logo } from "../../reusableComponents";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";

import { AiOutlineInsertRowAbove } from "react-icons/ai";
import ChatIcon from "@mui/icons-material/Chat";
import { ClickAwayListener } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import appLogo from "../../assets/app-logo.webp";
import blankImg from "../../assets/blank-profile.webp";
import { useNavigate } from "react-router-dom";

const PAGESIZE = 7;

function Navbar({ onClick, user, setUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandSearchBar, setExpandSearchBar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [windowWidth, setWindowWidth] = useState(700);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleSearchModal = () => {
    setOpen(!open);
  };

  function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width;
  }

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  useEffect(() => {
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
    // Call fetchUsers function whenever debouncedQuery changes after the 1-second delay
    fetchUsers();
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        navigate("/login");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    !location.href.includes("login") &&
    !location.href.includes("signup") && (
      <div className="app__header">
        {windowWidth > 600 ? (
          <span className="nav_text_logo">
            <Logo />
          </span>
        ) : (
          <span onClick={() => navigate("/")}>
            <img src={appLogo} alt="dummygram" className="nav_img_logo" />
          </span>
        )}
        <div className="navSpace">
          <div className="search_bar_main_container">
            <div
              className={`hidden_search_bar_container ${
                expandSearchBar ? "show_search_bar" : "hide_search_bar"
              }`}
            >
              <ClickAwayListener onClickAway={() => setExpandSearchBar(false)}>
                <div className="searchbar" onClick={handleSearchModal}>
                  {expandSearchBar ? (
                    <>
                      <input
                        type="text"
                        className="search_bar_input"
                        value={searchQuery}
                        placeholder="Search users..."
                        onChange={handleSearch}
                      />
                      <CloseIcon
                        onClick={() => setExpandSearchBar(false)}
                        className="icon search_icon"
                      />
                    </>
                  ) : (
                    <SearchIcon
                      className="icon search_icon"
                      onClick={() => setExpandSearchBar(true)}
                    />
                  )}
                </div>
              </ClickAwayListener>
            </div>
            {expandSearchBar && searchResults.length > 0 && (
              <div className="searched_user_container">
                <ul className="searched_user_sub_container">
                  {searchResults.map(({ id, user }) => {
                    return (
                      <li
                        key={id}
                        className="searched_user_li"
                        onClick={() => navigate(`/user/${user.username}`)}
                      >
                        <img
                          src={user?.photoURL ? user.photoURL : blankImg}
                          alt={user.name}
                          className="searched_user_avatar"
                        />
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <h5 className="searched_user_name">{user.name}</h5>
                          <p className="searched_user_username">
                            @{user.username}
                          </p>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="container">
            <div className="rowConvert" onClick={onClick}>
              <AiOutlineInsertRowAbove style={{ margin: "auto" }} size={30} />
            </div>
            <div
              className="rowConvert"
              id="chat-icon"
              onClick={() => navigate("/chat")}
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
