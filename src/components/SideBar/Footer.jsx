import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HelpIcon from "@mui/icons-material/Help";
import ContributorsIcon from "@mui/icons-material/Diversity3";
import GuidelinesIcon from "@mui/icons-material/LibraryBooks";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <ul className="sidebar-footer-container">
        <li>
          <a href="https://github.com/narayan954/dummygram" target="_blank">
            <span style={{ display: "flex", gap: "6px" }}>
              <GitHubIcon className="footer-icons" fontSize="small" />{" "}
              Repository
            </span>
          </a>
        </li>
        <li>
          <Link to="/dummygram/about" className="footer-link">
            <span style={{ display: "flex", gap: "6px" }}>
              <InfoIcon className="footer-icons" fontSize="small" />
              About
            </span>
          </Link>
        </li>
        <li>
          <Link
            style={{ display: "flex" }}
            to="/dummygram/feedback"
            className="footer-link"
          >
            <span style={{ display: "flex", gap: "6px" }}>
              <FeedbackIcon className="footer-icons" fontSize="small" />
              Feedback
            </span>
          </Link>
        </li>
        <li>
          <Link to="/dummygram/contributors" className="footer-link">
            <span style={{ display: "flex", gap: "6px" }}>
              <ContributorsIcon className="footer-icons" fontSize="small" />
              Contributors
            </span>
          </Link>
        </li>
        <li>
          <Link to="/dummygram/help-center" className="footer-link">
            <span style={{ display: "flex", gap: "6px" }}>
              <HelpIcon className="footer-icons" fontSize="small" />
              Help-center
            </span>
          </Link>
        </li>
        <li>
          <Link to="/dummygram/guidelines" className="footer-link">
            <span style={{ display: "flex", gap: "6px" }}>
              <GuidelinesIcon className="footer-icons" fontSize="small" />
              Guidelines
            </span>
          </Link>
        </li>
      </ul>
      <p className="copyright">&#169; MIT license since 2022</p>
    </footer>
  );
};

export default Footer;
