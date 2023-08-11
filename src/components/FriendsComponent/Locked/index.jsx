import "./index.css"
import lockImg from "../../../assets/lock.png"
import { Link } from "react-router-dom"

const LockedFriendPage = ({name}) => {
  return (
    <div className="lock_profile_container">
      <img 
        src={lockImg} 
        alt="User Profile Locked"
        className="profile_lock_img"
    />
    <h3>
        Add <Link to={`/dummygram/user/${name}`}>{name}</Link> as friend to unlock their friend list!
    </h3>
    </div>
  )
}

export default LockedFriendPage
