// custom css import
import "./SideBar.css";

import { Link, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// icons import
import HomeIcon from "@mui/icons-material/Home";
import React from "react";

function SideBar(props) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/dummygram">
            <HomeIcon className="icon" /> <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/dummygram">
            <AddCircleOutlineIcon className="icon" /> <span>New Post</span>
          </Link>
        </li>
        <li onClick={() => navigate("/dummygram/favourites")}>
          <div className="profile">
            <FavoriteBorderIcon className="icon" /> <span>Favourites</span>
          </div>
        </li>
        <li
          onClick={() =>
            navigate("/dummygram/profile", {
              state: {
                name: props.user.toJSON().displayName,
                email: props.user.toJSON().email,
                avatar: props.user.toJSON().photoURL,
              },
            })
          }
        >
          <div className="profile">
            <AccountCircleIcon className="icon" /> <span>Profile</span>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
