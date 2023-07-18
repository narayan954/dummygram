import "./index.css";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate } from "react-router-dom";

const Logo = ({ ml }) => {
  const navigate = useNavigate();
  return (
    <p
      id="dummygram-logo"
      style={{ marginLeft: ml ? ml : "20px" }}
      onClick={() => {
        if (
          location.pathname !== "/dummygram/login" &&
          location.pathname !== "/dummygram/signup"
        ) {
          navigate("/dummygram/");
        }
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }}
    >
      <AutoAwesomeIcon className="sparkle-icon" />
      dummygram
    </p>
  );
};

export default Logo;
