import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <ul className="sidebar-footer-container">
        <li className="github-icon">
          <a href="https://github.com/narayan954/dummygram" target="_blank">
            <GitHubIcon sx={{ color: "#4775df" }} />
          </a>
        </li>
        <li>
          <Link to="/dummygram/about" className="footer-link">
            About
          </Link>
        </li>
        <li>
          <Link to="/dummygram/feedback" className="footer-link">
            Feedback
          </Link>
        </li>
        <li>
          <Link to="/dummygram/contributors" className="footer-link">
            Contributors
          </Link>
        </li>
        <li>
          <Link to="/dummygram/help-center" className="footer-link">
            Help-center
          </Link>
        </li>
        <li>
          <Link to="/dummygram/guidelines" className="footer-link">
            Guidelines
          </Link>
        </li>
        <li>
          <Link to="/dummygram/guidelines" className="footer-link">
            Policy
          </Link>
        </li>
      </ul>
      <p className="copyright">&#169; MIT license since 2022</p>
    </footer>
  );
};

export default Footer;
