import "./index.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ProfileDialogBox = ({ mouseOnProfileImg, userData }) => {
    const [isHoverActive, setIsHoverActive] = useState(false)
    const { name, username, avatar, bio, followers, following } = userData
    const navigate = useNavigate()
    console.log(userData)

    function hoverOver() {
        setIsHoverActive(true)
    }

    function hoverOut() {
        setTimeout(() => {
            setIsHoverActive(false)
        }, 1000)
    }


    return (
        <div
            style={{ 
                display: (mouseOnProfileImg || isHoverActive) ? "flex" : "none",
            }}
            onMouseEnter={hoverOver}
            onMouseLeave={hoverOut}
            className="profile-dialog-box-container"
        >
            <img
                src={avatar}
                alt={name}
                className="dialog-box-img"
                onClick={() => navigate(`/dummygram/${username}`)}
            />
            <div className="dialog-box-name-container">
                <h4 
                    className="dialog-box-display-name"
                >
                    {name}
                </h4>
                <h5
                    className="dialog-box-username"
                >
                    @{username}
                </h5>
            </div>
            <p className="dialog-box-bio">{bio}</p>
            <div className="dialog-box-follow-container">
                <p>
                    <span>{following}</span>{" "}
                    Following
                </p>
                <p>
                    <span>{followers}</span> {" "}
                    Followers
                </p>
            </div>
        </div>
    )
}

export default ProfileDialogBox
