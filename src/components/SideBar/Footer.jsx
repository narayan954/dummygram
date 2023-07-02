import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <ul className="sidebar-footer-container">
        <li>
          <a href="https://github.com/narayan954/dummygram" target="_blank">
            <GitHubIcon />
          </a>
        </li>
        <li>
          <Link to="/dummygram/about" className="footer-link">
            about
          </Link>
        </li>
        <li>
          <Link to="/dummygram/help-center" className="footer-link">
            help-center
          </Link>
        </li>
        <li>
          <Link to="/dummygram/guidelines" className="footer-link">
            Guidelines
          </Link>
        </li>
        <li>
          <Link to="/dummygram/guidelines" className="footer-link">
            policy
          </Link>
        </li>
      </ul>
      <p className="copyright">&#169; MIT license since 2022</p>
    </footer>
  );
};

export default Footer;
