import "./index.css";

import { Link } from "react-router-dom";
import lockImg from "../../../assets/lock.png";

const LockedFriendPage = ({ name }) => {
  return (
    <div className="lock_profile_container">
      <img
        src={lockImg}
        alt="User Profile Locked"
        className="profile_lock_img"
      />
      <h3>
        Add <Link to={`/user/${name}`}>{name}</Link> as friend to unlock their
        friend list!
      </h3>
    </div>
  );
};

export default LockedFriendPage;
