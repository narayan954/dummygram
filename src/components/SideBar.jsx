// custom css import
import "./SideBar.css";

import { Link, useNavigate } from "react-router-dom";
import NewPost from "./NewPost";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeIcon from "@mui/icons-material/Home";
import { useState } from "react";
import React from "react";


function SideBar(props) {
  const navigate = useNavigate();
  const [openNewUpload, setOpenNewUpload] = useState(false);
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/dummygram">
            <HomeIcon className="icon" /> <span>Home</span>
          </Link>
        </li>
        <li onClick={() => setOpenNewUpload(true)}>
          <div className="sidebar_align">
            <AddCircleOutlineIcon className="icon" /> <span>New Post</span>
          </div>
        </li>
        <li onClick={() => navigate("/dummygram/favourites")}>
          <div className="sidebar_align">
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
          <div className="sidebar_align">
            <AccountCircleIcon className="icon" /> <span>Profile</span>
          </div>
        </li>
        {openNewUpload && <NewPost openNewUpload={openNewUpload} setOpenNewUpload={setOpenNewUpload} />}
      </ul>
    </div>
  );
}

export default SideBar;
