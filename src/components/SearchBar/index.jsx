import "./index.css";

import React, { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import SideBar from "../SideBar";
import blankImg from "../../assets/blank-profile.webp";
import { db } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";

const PAGESIZE = 7;

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();

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
  return (
    <div>
      <SideBar />
      <div>
        <div className="search-container">
          <div className="search-bar">
            <input
              type="search"
              className="search-input"
              value={searchQuery}
              placeholder="Search Here..."
              onChange={handleSearch}
            />
            <label className="search-icon">
              <FaSearch />
            </label>
          </div>
          {searchResults.length > 0 ? (
            <section className="searched-user-container">
              <ul className="searched-user-sub-container">
                {searchResults.map(({ id, user }) => {
                  return (
                    <li
                      key={id}
                      className="searched-user-li"
                      onClick={() => navigate(`/dummygram/${user.username}`)}
                    >
                      <img
                        src={user?.photoURL ? user.photoURL : blankImg}
                        alt={user.name}
                        className="searched-user-avatar"
                      />
                      <span>
                        <h5 className="searched-user-name">{user.name}</h5>
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
      </div>
    </div>
  );
}

export default SearchBar;
