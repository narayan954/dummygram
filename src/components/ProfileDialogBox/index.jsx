import "./index.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ProfileDialogBox = ({ mouseOnProfileImg, userData, updatedUrl }) => {
  const [isHoverActive, setIsHoverActive] = useState(false);
  const { name, username, avatar, bio, followers, following } = userData;
  const navigate = useNavigate();
  // console.log(userData);

  function hoverOver() {
    setIsHoverActive(true);
  }

  function hoverOut() {
    setTimeout(() => {
      setIsHoverActive(false);
    }, 1000);
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
      <img
        src={updatedUrl ? updatedUrl : avatar}
        alt={name}
        className="dialog-box-img"
        onClick={() => navigate(`/dummygram/${username}`)}
      />
      <div className="dialog-box-name-container">
        <h4
          className="dialog-box-display-name"
          onClick={() => navigate(`/dummygram/${username}`)}
        >
          {name}
        </h4>
        <h5 className="dialog-box-username">@{username}</h5>
      </div>
      <p className="dialog-box-bio">{bio}</p>
      <div className="dialog-box-follow-container">
        <p>
          <span>{following}</span> Following
        </p>
        <p>
          <span>{followers}</span> Followers
        </p>
      </div>
    </div>
  );
};

export default ProfileDialogBox;
