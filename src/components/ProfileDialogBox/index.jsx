import "./index.css";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import profileAvatar from "../../assets/blank-profile.webp";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ProfileDialogBox = ({ mouseOnProfileImg, userData }) => {
  const [isHoverActive, setIsHoverActive] = useState(false);
  const { name, username, avatar, posts, bio, followers, following, country } =
    userData;
  const navigate = useNavigate();

  function hoverOver() {
    setIsHoverActive(true);
  }

  function hoverOut() {
    setTimeout(() => {
      setIsHoverActive(false);
    }, 1000);
  }

  function trimBio(bio) {
    const str = bio.substr(0, 90) + " ...";
    return str;
  }

  return (
    <div
      style={{
        display: mouseOnProfileImg || isHoverActive ? "flex" : "none",
      }}
      onMouseEnter={hoverOver}
      onMouseLeave={hoverOut}
      className="profile-dialog-box-container"
    >
      <div style={{ display: "flex", gap: "2rem" }}>
        <img
          src={avatar ? avatar : profileAvatar}
          alt={name}
          className="dialog-box-img"
          onClick={() => navigate(`/dummygram/user/${username}`)}
        />
        <div
          className="dialog-box-name-container"
          style={{ marginTop: "10px" }}
        >
          <h4
            className="dialog-box-display-name"
            onClick={() => navigate(`/dummygram/user/${username}`)}
          >
            {name}
          </h4>
          <h5 className="dialog-box-username">@{username}</h5>
          <span className="dialog-box-username">
            <LocationOnIcon className="hover-location-icon" fontSize="small" />{" "}
            {country}
          </span>
        </div>
      </div>
      <p className="dialog-box-bio">
        Bio:{" "}
        <span
          style={{ fontWeight: "400", fontSize: "13px", lineHeight: "0.0rem" }}
        >
          {bio?.length > 90 ? trimBio(bio) : bio}
        </span>
      </p>
      <p className="dialog-box-bio">Posts: {posts}</p>
      {followers && following && (
        <div className="dialog-box-follow-container">
          <p>
            <span>{following}</span> Following
          </p>
          <p>
            <span>{followers}</span> Followers
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileDialogBox;
