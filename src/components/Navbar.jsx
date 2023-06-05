import React, { useEffect } from "react";
// custom css import
import "./Navbar.css";
// icons import
import HomeIcon from "@mui/icons-material/Home";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Navbar() {
  return (
    <div className="nav-bar">
      <ul>
        <li>
          <a href="">
            <HomeIcon className="icon" /> <span>Home</span>
          </a>
        </li>
        <li>
          <a href="">
            <AddCircleOutlineIcon className="icon" /> <span>New Post</span>
          </a>
        </li>
        <li>
          <a href="">
            <FavoriteBorderIcon className="icon" /> <span>Favourites</span>
          </a>
        </li>
        <li>
          <a href="">
            <AccountCircleIcon className="icon" /> <span>Profile</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
